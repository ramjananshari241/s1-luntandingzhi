import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

export default async function handler(req, res) {
  const notion = new Client({ auth: process.env.NOTION_KEY || process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_DATABASE_ID || process.env.NOTION_PAGE_ID;
  const n2m = new NotionToMarkdown({ notionClient: notion });
  const { id } = req.query;

  try {
    // --- 1. 获取详情 ---
    if (req.method === 'GET') {
      const page = await notion.pages.retrieve({ page_id: id });
      const mdblocks = await n2m.pageToMarkdown(id);
      const mdString = n2m.toMarkdownString(mdblocks);
      const props = page.properties;
      return res.status(200).json({
        success: true,
        post: {
          id: page.id,
          title: props.title?.title?.[0]?.plain_text || props.Page?.title?.[0]?.plain_text || '',
          category: props.category?.select?.name || '',
          date: props.date?.date?.start || '',
          status: props.status?.select?.name || 'Published',
          content: mdString.parent || ''
        }
      });
    }

    // --- 2. 删除 ---
    if (req.method === 'DELETE') {
      await notion.pages.update({ page_id: id, archived: true });
      return res.status(200).json({ success: true });
    }

    // --- 3. 保存/更新 (POST) ---
    if (req.method === 'POST') {
      const data = JSON.parse(req.body);
      const properties = {
        title: { title: [{ text: { content: data.title } }] },
        category: { select: { name: data.category } },
        date: { date: { start: data.date } },
        status: { select: { name: data.status } },
      };

      if (data.id) {
        // 更新现有文章 (Notion API 更新内容较复杂，这里先更新属性)
        await notion.pages.update({ page_id: data.id, properties });
      } else {
        // 创建新文章
        await notion.pages.create({
          parent: { database_id: databaseId },
          properties
        });
      }
      return res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}