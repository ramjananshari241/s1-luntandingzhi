import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  const notion = new Client({ auth: process.env.NOTION_KEY || process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_DATABASE_ID || process.env.NOTION_PAGE_ID;

  try {
    let allResults = [];
    let hasMore = true;
    let cursor = undefined;

    // 🟢 核心修复：全量递归抓取逻辑
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: cursor,
        page_size: 100, // 每次抓取最大上限
        sorts: [{ property: 'date', direction: 'descending' }],
      });

      allResults.push(...response.results);
      hasMore = response.has_more;
      cursor = response.next_cursor;
      
      // 安全阀：如果数据量极其庞大（比如超过500条），Vercel 可能会超时。
      // 对于一般的博客管理，100-500条可以一次性加载。
    }

    const categories = new Set();
    const tags = new Set();

    const posts = allResults.map((page) => {
      const p = page.properties;
      
      const catName = p.category?.select?.name || p.Category?.select?.name || '';
      if (catName) categories.add(catName);
      
      const tagList = p.tags?.multi_select || p.Tags?.multi_select || [];
      const tagNames = tagList.map(t => t.name);
      tagNames.forEach(t => tags.add(t));

      return {
        id: page.id,
        title: p.title?.title?.[0]?.plain_text || p.Page?.title?.[0]?.plain_text || '无标题',
        slug: p.slug?.rich_text?.[0]?.plain_text || p.Slug?.rich_text?.[0]?.plain_text || '',
        category: catName,
        tags: tagNames.join(','),
        status: p.status?.status?.name || p.status?.select?.name || 'Published',
        type: p.type?.select?.name || p.Type?.select?.name || 'Post',
        date: p.date?.date?.start || p.Date?.date?.start || '',
        cover: p.cover?.url || p.cover?.file?.url || p.cover?.external?.url || ''
      };
    });

    res.status(200).json({ 
      success: true, 
      posts,
      options: {
        categories: Array.from(categories),
        tags: Array.from(tags)
      }
    });

  } catch (error) {
    console.error('Posts API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
