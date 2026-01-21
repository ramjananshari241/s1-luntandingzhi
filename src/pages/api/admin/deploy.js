export default async function handler(req, res) {
  // 🔴 请务必把下面的 URL 换成你刚才复制的那个！
  const VERCEL_HOOK = 'https://api.vercel.com/v1/integrations/deploy/prj_VLi5jzJ66SohK987g8lev5SPgiCi/Zg1wvfNE9W';
  
  try {
    await fetch(VERCEL_HOOK, { method: 'POST' });
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false });
  }
}