'use client';
import React, { useState, useEffect } from 'react';

// --- 1. 图标库 ---
const Icons = {
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  CoverMode: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>,
  TextMode: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
  GridMode: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
};

// --- 子组件：积木编辑器 ---
const BlockBuilder = ({ blocks, setBlocks }) => {
  const addBlock = (type) => setBlocks([...blocks, { id: Math.random(), type, content: '', pwd: '' }]);
  const update = (id, val, key='content') => setBlocks(blocks.map(b => b.id === id ? { ...b, [key]: val } : b));
  return (
    <div style={{marginTop: 20}}>
      <div style={{display:'flex', gap:10, marginBottom:20}}>
        <button onClick={()=>addBlock('h1')} className="neo-btn">H1标题</button>
        <button onClick={()=>addBlock('text')} className="neo-btn">正文块</button>
        <button onClick={()=>addBlock('note')} className="neo-btn">注释块</button>
        <button onClick={()=>addBlock('lock')} className="neo-btn">加密块</button>
      </div>
      {blocks.map(b => (
        <div key={b.id} className="block-card">
          <div style={{color:'greenyellow', fontSize:11, marginBottom:5}}>{b.type.toUpperCase()}</div>
          {b.type === 'lock' && <input className="glow-input" placeholder="密码" value={b.pwd} onChange={e=>update(b.id, e.target.value, 'pwd')} style={{marginBottom:10}} />}
          <textarea className="glow-input" value={b.content} onChange={e=>update(b.id, e.target.value)} placeholder="输入内容..." />
          <div className="block-del" onClick={()=>setBlocks(blocks.filter(x=>x.id!==b.id))}><Icons.Trash /></div>
        </div>
      ))}
    </div>
  );
};

// --- 主页面 ---
export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list');
  const [activeTab, setActiveTab] = useState('Post');
  const [editorBlocks, setEditorBlocks] = useState([]);
  const [form, setForm] = useState({ title: '', category: '', date: '', status: 'Published' });
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => { setMounted(true); fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const r = await fetch('/api/admin/posts');
    const d = await r.json();
    if (d.success) setPosts(d.posts);
    setLoading(false);
  };

  const handleEdit = async (id) => {
    setLoading(true);
    const r = await fetch(`/api/admin/post?id=${id}`);
    const d = await r.json();
    if (d.success) {
      setForm(d.post);
      // 简单的内容解析（这里后续可以根据你的 Markdown 逻辑优化）
      setEditorBlocks([{ id: 1, type: 'text', content: d.post.content }]);
      setCurrentId(id);
      setView('edit');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    // 将积木块合成为 Markdown
    const fullContent = editorBlocks.map(b => {
      if (b.type === 'h1') return `# ${b.content}`;
      if (b.type === 'note') return `\`${b.content}\``;
      if (b.type === 'lock') return `:::lock ${b.pwd}\n${b.content}\n:::`;
      return b.content;
    }).join('\n\n');

    await fetch('/api/admin/post', {
      method: 'POST',
      body: JSON.stringify({ ...form, content: fullContent, id: currentId })
    });
    setView('list');
    fetchData();
  };

  if (!mounted) return null;

  return (
    <div className="admin-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-wrapper { min-height: 100vh; background: #1a1a1a; color: #fff; padding: 40px 20px; font-family: system-ui; }
        .card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border-radius: 15px; padding: 20px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.1); }
        .glow-input { width: 100%; background: #222; border: 1px solid #444; color: #fff; padding: 12px; border-radius: 8px; margin-bottom: 10px; }
        .neo-btn { background: #333; color: #fff; border: 1px solid #555; padding: 8px 15px; border-radius: 6px; cursor: pointer; }
        .neo-btn:hover { background: greenyellow; color: #000; }
        .block-card { background: #252525; padding: 15px; border-radius: 10px; margin-bottom: 10px; position: relative; }
        .block-del { position: absolute; right: 10px; top: 10px; color: #ff4d4f; cursor: pointer; }
        .loader { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 100; }
      `}} />

      {loading && <div className="loader">处理中...</div>}

      <div style={{maxWidth: 800, margin: '0 auto'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom: 30}}>
          <h1>后台管理</h1>
          <button className="neo-btn" onClick={() => { if(view==='list'){ setForm({title:'', category:'', date:'', status:'Published'}); setEditorBlocks([]); setCurrentId(null); setView('edit'); } else { setView('list'); } }}>
            {view === 'list' ? '发布新文章' : '返回列表'}
          </button>
        </div>

        {view === 'list' ? (
          <div>
            {posts.map(p => (
              <div key={p.id} className="card">
                <div>
                  <div style={{fontWeight:'bold'}}>{p.title}</div>
                  <div style={{fontSize:12, color:'#888'}}>{p.date} · {p.status}</div>
                </div>
                <div style={{display:'flex', gap:10}}>
                  <div onClick={() => handleEdit(p.id)} style={{color:'greenyellow', cursor:'pointer'}}><Icons.Edit /></div>
                  <div onClick={async () => { if(confirm('确定删除?')){ await fetch('/api/admin/post?id='+p.id, {method:'DELETE'}); fetchData(); }}} style={{color:'#ff4d4f', cursor:'pointer'}}><Icons.Trash /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{background: '#222', padding: 30, borderRadius: 20}}>
            <input className="glow-input" placeholder="文章标题" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10}}>
              <input className="glow-input" placeholder="分类" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
              <input className="glow-input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
            </div>
            <BlockBuilder blocks={editorBlocks} setBlocks={setEditorBlocks} />
            <button onClick={handleSave} style={{width:'100%', padding:15, background:'greenyellow', color:'#000', border:'none', borderRadius:10, fontWeight:'bold', marginTop:20, cursor:'pointer'}}>确认提交到 Notion</button>
          </div>
        )}
      </div>
    </div>
  );
}