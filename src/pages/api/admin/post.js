import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

const notion = new Client({
  auth: process.env.NOTION_KEY || process.env.NOTION_TOKEN,
});
const n2m = new NotionToMarkdown({ notionClient: notion });

// 辅助：解析 Markdown
function mdToBlocks(markdown) {
  const rawChunks = markdown.split(/\n{2,}/);
  const blocks = [];
  for (let chunk of rawChunks) {
    const t = chunk.trim();
    if (!t) continue;
    if (t.startsWith('# ')) {
      blocks.push({ object: 'block', type: 'heading_1', heading_1: { rich_text: [{ text: { content: t.replace('# ', '') } }] } });
    } else {
      blocks.push({ object: 'block', type: 'paragraph', paragraph: { rich_text: [{ text: { content: t } }] } });
    }
  }
  return blocks;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req, res) {
  const { id } = req.query;
  const databaseId = process.env.NOTION_DATABASE_ID || process.env.NOTION_PAGE_ID;

  try {
    // === GET: 获取详情 (用于编辑和预览) ===
    if (req.method === 'GET') {
      const page = await notion.pages.retrieve({ page_id: id });
      const mdblocks = await n2m.pageToMarkdown(id);
      const mdString = n2m.toMarkdownString(mdblocks);
      const p = page.properties;

      // ✅ 修复预览：获取原始 Block 数据
      let rawBlocks = [];
      try {
        const blocksRes = await notion.blocks.children.list({ block_id: id });
        rawBlocks = blocksRes.results;
      } catch (e) { console.warn("预览数据获取失败", e); }

      return res.status(200).json({
        success: true,
        post: {
          id: page.id,
          title: p.title?.title?.[0]?.plain_text || '无标题',
          slug: p.slug?.rich_text?.[0]?.plain_text || '',
          excerpt: p.excerpt?.rich_text?.[0]?.plain_text || '',
          category: p.category?.select?.name || '',
          tags: (p.tags?.multi_select || []).map(t => t.name).join(','),
          status: p.status?.status?.name || p.status?.select?.name || 'Published',
          type: p.type?.select?.name || 'Post',
          date: p.date?.date?.start || '',
          // ✅ 修复封面：优先读 URL 字段，没有再读 File
          cover: p.cover?.url || p.cover?.file?.url || p.cover?.external?.url || '', 
          content: mdString.parent || '',
          rawBlocks: rawBlocks // 把预览数据传给前端
        }
      });
    }

    // === POST: 保存/创建 (核心修复) ===
    if (req.method === 'POST') {
      const body = JSON.parse(req.body);
      const { id, title, content, slug, excerpt, category, tags, status, date, type, cover } = body;
      const newBlocks = mdToBlocks(content);

      const props = {};

      props["title"] = { title: [{ text: { content: title || "无标题" } }] };
      if (slug) props["slug"] = { rich_text: [{ text: { content: slug } }] };
      props["excerpt"] = { rich_text: [{ text: { content: excerpt || "" } }] };
      if (category) props["category"] = { select: { name: category } };
      
      if (tags) {
        const tagList = tags.split(',').filter(t => t.trim()).map(t => ({ name: t.trim() }));
        if (tagList.length > 0) props["tags"] = { multi_select: tagList };
      }

      // ✅✅✅ 关键修复：针对 Notion 原生 Status 类型的写法
      // 如果你的 status 是圆圈图标，必须用 { status: ... }，不能用 { select: ... }
      props["status"] = { status: { name: status || "Published" } };

      props["type"] = { select: { name: type || "Post" } };
      if (date) props["date"] = { date: { start: date } };

      // ✅ 修复封面写入：如果是 URL 类型，直接作为属性写入
      if (cover && cover.startsWith('http')) {
         props["cover"] = { url: cover };
      }

      if (id) {
        // 更新
        await notion.pages.update({ page_id: id, properties: props });
        // (为了求稳，暂时不更新积木内容，先保证属性报错解决。
        // 等保存成功不报错了，如果你需要更新正文，我们再加积木更新逻辑)
      } else {
        // 创建
        await notion.pages.create({
          parent: { database_id: databaseId },
          properties: props,
          children: newBlocks.slice(0, 50)
        });
      }

      return res.status(200).json({ success: true });
    }

    // === DELETE: 删除 ===
    if (req.method === 'DELETE') {
      await notion.pages.update({ page_id: id, archived: true });
      return res.status(200).json({ success: true });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
}