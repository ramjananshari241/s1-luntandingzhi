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
      
      // 🟢 修复：兼容小写 category
      const catName = p.category?.select?.name || p.Category?.select?.name || '';
      if (catName) categories.add(catName);
      
      // 🟢 修复：兼容小写 tags
      const tagList = p.tags?.multi_select || p.Tags?.multi_select || [];
      const tagNames = tagList.map(t => t.name);
      tagNames.forEach(t => tags.add(t));

      // 🟢 修复：兼容小写 status, type, cover, date
      return {
        id: page.id,
        title: p.title?.title?.[0]?.plain_text || '无标题',
        slug: p.slug?.rich_text?.[0]?.plain_text || '',
        category: catName,
        tags: tagNames.join(','),
        
        status: p.status?.select?.name || p.status?.status?.name || 'Published',
        type: p.type?.select?.name || 'Post',
        date: p.date?.date?.start || '',
        
        // 封面优先读 URL
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