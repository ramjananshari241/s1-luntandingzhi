import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  const notion = new Client({ auth: process.env.NOTION_KEY || process.env.NOTION_TOKEN });
  const databaseId = process.env.NOTION_DATABASE_ID || process.env.NOTION_PAGE_ID;

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: 'date', direction: 'descending' }],
    });

    const categories = new Set();
    const tags = new Set();

    const posts = response.results.map((page) => {
      const p = page.properties;
      
      const catName = p.category?.select?.name || '';
      if (catName) categories.add(catName);
      
      const tagNames = p.tags?.multi_select?.map(t => t.name) || [];
      tagNames.forEach(t => tags.add(t));

      return {
        id: page.id,
        title: p.title?.title?.[0]?.plain_text || '无标题',
        slug: p.slug?.rich_text?.[0]?.plain_text || '',
        category: catName,
        tags: tagNames.join(','),
        // 兼容 Status 和 Select 两种读取方式
        status: p.status?.status?.name || p.status?.select?.name || 'Published',
        date: p.date?.date?.start || '',
        
        // ✅ 关键修复：优先读取 URL 类型的封面
        cover: p.cover?.url || p.cover?.file?.url || p.cover?.external?.url || '',

        type: p.type?.select?.name || 'Post' 
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