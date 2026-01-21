'use client';
import React, { useState, useEffect } from 'react';

// --- 图标定义 ---
const Icons = {
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  ArrowUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"></polyline></svg>,
  ArrowDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>,
  Top: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 11 12 5 6 11"></polyline><polyline points="18 18 12 12 6 18"></polyline></svg>,
  Bottom: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 6 12 12 18 6"></polyline><polyline points="6 13 12 19 18 13"></polyline></svg>,
  Edit: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>,
  Trash: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
  Refresh: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
  Tutorial: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  FolderIcon: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff" style={{opacity:0.8}}><path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path></svg>,
};

// --- 全局样式 ---
const GlobalStyle = () => (
  <style dangerouslySetInnerHTML={{__html: `
    body { background-color: #303030; color: #ffffff; margin: 0; font-family: system-ui, sans-serif; overflow-x: hidden; }
    .card-item { background: #424242; border-radius: 12px; margin-bottom: 12px; padding: 20px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #555; cursor: pointer; transition: 0.2s; }
    .card-item:hover { border-color: greenyellow; }
    .glow-input { width: 100%; padding: 12px; background: #18181c; border: 1px solid #444; border-radius: 8px; color: #fff; margin-bottom: 10px; box-sizing: border-box; }
    .glow-input:focus { border-color: greenyellow; outline: none; }
    .neo-btn { background: #333; color: #fff; border: 1px solid #555; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-weight: bold; }
    .neo-btn:hover { background: greenyellow; color: #000; }
    .block-card { background: #2a2a2e; border: 1px solid #333; border-radius: 10px; padding: 15px 15px 15px 55px; margin-bottom: 12px; position: relative; transition: border 0.2s; }
    .block-card:hover { border-color: greenyellow; }
    .block-card.just-moved { animation: moveHighlight 0.6s ease-out; }
    @keyframes moveHighlight { 0% { box-shadow: 0 0 0 0 rgba(173, 255, 47, 0); } 30% { box-shadow: 0 0 15px 2px rgba(173, 255, 47, 0.4); } 100% { box-shadow: none; } }
    
    .block-left-ctrl { position: absolute; left: 0; top: 0; bottom: 0; width: 45px; background: rgba(0,0,0,0.2); border-right: 1px solid #333; border-radius: 10px 0 0 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
    .move-btn { cursor: pointer; color: #888; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); }
    .move-btn:hover { background: greenyellow; color: #000; }
    .block-del { position: absolute; right: 0; top: 0; bottom: 0; width: 40px; background: #ff4d4f; border-radius: 0 10px 10px 0; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; cursor: pointer; color: white; }
    .block-card:hover .block-del { opacity: 1; right: -40px; }
    .block-card:hover { margin-right: 40px; }
    
    .loader-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 9999; }
    .fab-scroll { position: fixed; right: 30px; bottom: 30px; display: flex; flex-direction: column; gap: 10px; z-index: 99; }
    .fab-btn { width: 45px; height: 45px; background: greenyellow; color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.3); cursor: pointer; transition: 0.2s; }
    .fab-btn:hover { transform: scale(1.1); }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: #202024; }
    ::-webkit-scrollbar-thumb { background: #444; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }
  `}} />
);

// --- 工具函数 ---
const cleanAndFormat = (input) => {
  if (!input) return "";
  try {
    return input.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return ""; 
      const mdMatch = trimmed.match(/(?:!|)?\[.*?\]\((.*?)\)/);
      if(mdMatch) return `![](${mdMatch[1]})`;
      if (/\.(jpg|jpeg|png|gif|webp|bmp|svg|mp4)(\?|$)/i.test(trimmed)) return `![](${trimmed})`;
      return trimmed;
    }).filter(l=>l).join('\n');
  } catch (e) { return input; }
};

// --- 积木编辑器 (包含视角锁定逻辑) ---
const BlockBuilder = ({ blocks, setBlocks }) => {
  const [movingId, setMovingId] = useState(null);

  // 视角锁定函数
  const scrollToBlock = (id) => {
    setTimeout(() => {
       const el = document.getElementById(`block-${id}`);
       if(el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100); // 延时等待渲染
  };

  const addBlock = (type) => {
    const newId = Date.now() + Math.random();
    setBlocks([...blocks, { id: newId, type, content: '', pwd: '' }]);
    scrollToBlock(newId); // 添加后自动聚焦
  };

  const updateBlock = (id, val, key='content') => { 
    setBlocks(blocks.map(b => b.id === id ? { ...b, [key]: val } : b)); 
  };

  const removeBlock = (id) => { setBlocks(blocks.filter(b => b.id !== id)); };

  const moveBlock = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const targetIndex = index + direction;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
    setMovingId(newBlocks[targetIndex].id);
    scrollToBlock(newBlocks[targetIndex].id); // 移动后自动跟随
  };

  const moveExtreme = (index, position) => {
    if (index === 0 && position === 'top') return;
    if (index === blocks.length - 1 && position === 'bottom') return;
    const newBlocks = [...blocks];
    const [item] = newBlocks.splice(index, 1);
    if (position === 'top') newBlocks.unshift(item);
    else newBlocks.push(item);
    setBlocks(newBlocks);
    setMovingId(item.id);
    scrollToBlock(item.id); // 置顶置底后自动跟随
  };

  return (
    <div style={{marginTop: 30}}>
      <div style={{display:'flex', gap:10, marginBottom:20, flexWrap:'wrap', justifyContent:'center'}}>
          <button className="neo-btn" onClick={()=>addBlock('h1')}>H1 标题</button>
          <button className="neo-btn" onClick={()=>addBlock('text')}>📝 内容块</button>
          <button className="neo-btn" onClick={()=>addBlock('note')}>💬 注释块</button>
          <button className="neo-btn" onClick={()=>addBlock('lock')}>🔒 加密块</button>
      </div>
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {blocks.map((b, index) => (
          <div key={b.id} id={`block-${b.id}`} className={`block-card ${movingId === b.id ? 'just-moved' : ''}`}>
            <div className="block-left-ctrl">
               <div className="move-btn" onClick={() => moveExtreme(index, 'top')} title="置顶"><Icons.Top /></div>
               <div className="move-btn" onClick={() => moveBlock(index, -1)}><Icons.ArrowUp /></div>
               <div className="move-btn" onClick={() => moveBlock(index, 1)}><Icons.ArrowDown /></div>
               <div className="move-btn" onClick={() => moveExtreme(index, 'bottom')} title="置底"><Icons.Bottom /></div>
            </div>
            <div style={{fontSize:12, color:'greenyellow', marginBottom:5, marginLeft:40}}>{b.type.toUpperCase()}</div>
            {b.type === 'h1' && <input className="glow-input" placeholder="输入大标题..." value={b.content} onChange={e=>updateBlock(b.id, e.target.value)} style={{fontWeight:'bold', fontSize:18}} />}
            {b.type === 'text' && <textarea className="glow-input" placeholder="输入正文..." value={b.content} onChange={e=>updateBlock(b.id, e.target.value)} style={{minHeight:150}} />}
            {b.type === 'note' && <textarea className="glow-input" placeholder="输入注释..." value={b.content} onChange={e=>updateBlock(b.id, e.target.value)} style={{minHeight:80, color:'#ff6b6b', fontFamily:'monospace'}} />}
            {b.type === 'lock' && (
               <div style={{background:'#202024', padding:10, borderRadius:8}}>
                 <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10}}><span>🔑</span><input className="glow-input" placeholder="留空则无密码" value={b.pwd} onChange={e=>updateBlock(b.id, e.target.value, 'pwd')} style={{width:150, margin:0}} /></div>
                 <textarea className="glow-input" placeholder="输入加密内容..." value={b.content} onChange={e=>updateBlock(b.id, e.target.value)} style={{minHeight:150}} />
               </div>
            )}
            <div className="block-del" onClick={()=>removeBlock(b.id)}><Icons.Trash /></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 主页面 ---
export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('list');
  const [posts, setPosts] = useState([]);
  const [siteTitle, setSiteTitle] = useState('PROBLOG');
  const [searchQuery, setSearchQuery] = useState('');
  
  // 编辑器状态
  const [form, setForm] = useState({ title: '', slug: '', category: '', tags: '', status: 'Published', date: '' });
  const [editorBlocks, setEditorBlocks] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => { setMounted(true); fetchPosts(); }, []);

  // 后退拦截逻辑
  useEffect(() => {
    if (view === 'edit') {
      window.history.pushState({ view: 'edit' }, '', '?mode=edit');
    } else {
      if (window.location.search.includes('mode=edit')) window.history.back();
    }
    const onPopState = () => { if (view === 'edit') setView('list'); };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [view]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/admin/posts');
      const d = await r.json();
      if (d.success) setPosts(d.posts);
      
      const rConf = await fetch('/api/admin/config');
      const dConf = await rConf.json();
      if (dConf.success) setSiteTitle(dConf.siteInfo.title);
    } catch(e) { console.error(e); } 
    finally { setLoading(false); }
  };

  // 状态机解析器 (修复加密块显示)
  const parseContentToBlocks = (md) => {
    if(!md) return [];
    const lines = md.split(/\r?\n/);
    const res = [];
    let buffer = []; let isLocking = false; let lockPwd = ''; let lockBuffer = [];  
    const stripMd = (str) => { const match = str.match(/(?:!|)?\[.*?\]\((.*?)\)/); return match ? match[1] : str; };
    const flushBuffer = () => {
      if (buffer.length > 0) {
        const joined = buffer.map(stripMd).join('\n').trim();
        if (joined) {
           if (joined.startsWith('`') && joined.endsWith('`') && joined.length > 1) {
              res.push({ id: Date.now() + Math.random(), type: 'note', content: joined.slice(1, -1) });
           } else {
              res.push({ id: Date.now() + Math.random(), type: 'text', content: joined });
           }
        }
        buffer = [];
      }
    };
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]; const trimmed = line.trim();
      if (!isLocking && trimmed.startsWith(':::lock')) { flushBuffer(); isLocking = true; lockPwd = trimmed.replace(':::lock', '').replace(/[>*\s🔒]/g, '').trim(); continue; }
      if (isLocking && trimmed === ':::') { isLocking = false; const joinedLock = lockBuffer.map(stripMd).join('\n').trim(); res.push({ id: Date.now() + Math.random(), type: 'lock', pwd: lockPwd, content: joinedLock }); lockBuffer = []; continue; }
      if (isLocking) { lockBuffer.push(line); continue; }
      if (trimmed.startsWith('# ')) { flushBuffer(); res.push({ id: Date.now() + Math.random(), type: 'h1', content: trimmed.replace('# ', '') }); continue; }
      if (!trimmed) { flushBuffer(); continue; }
      buffer.push(line);
    }
    if (isLocking) { // 强制闭合
        const joinedLock = lockBuffer.join('\n').trim();
        res.push({ id: Date.now() + Math.random(), type: 'lock', pwd: lockPwd, content: joinedLock });
    } else {
        flushBuffer();
    }
    return res;
  };

  const handleEdit = async (id) => {
    setLoading(true);
    const r = await fetch(`/api/admin/post?id=${id}`);
    const d = await r.json();
    if (d.success) {
      setForm(d.post);
      setEditorBlocks(parseContentToBlocks(d.post.content));
      setCurrentId(id);
      setView('edit');
    }
    setLoading(false);
  };

  const handleCreate = () => {
    setForm({ title: '', slug: '', category: '', tags: '', status: 'Published', date: new Date().toISOString().split('T')[0] });
    setEditorBlocks([]);
    setCurrentId(null);
    setView('edit');
  };

  const handleSave = async () => {
    setLoading(true);
    const fullContent = editorBlocks.map(b => {
      if (b.type === 'h1') return `# ${b.content}`;
      if (b.type === 'note') return `\`${b.content}\``;
      if (b.type === 'lock') return `:::lock ${b.pwd}\n${b.content}\n:::`;
      return b.content;
    }).join('\n\n');

    try {
      const res = await fetch('/api/admin/post', {
        method: 'POST',
        body: JSON.stringify({ ...form, content: fullContent, id: currentId, type: 'Post' })
      });
      const d = await res.json();
      if (d.success) {
        alert('保存成功！正在触发博客更新...');
        // 触发自动更新
        await fetch('/api/admin/deploy');
        setView('list');
        fetchPosts();
      } else {
        alert(`保存失败: ${d.error}`);
      }
    } catch(e) { alert(e.message); }
    finally { setLoading(false); }
  };

  const handleManualDeploy = async () => {
     if(confirm('立即更新博客前端？')) {
        await fetch('/api/admin/deploy');
        alert('更新指令已发送！请等待约 1 分钟。');
     }
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#303030', padding: '40px 20px' }}>
      <GlobalStyle />
      {loading && <div className="loader-overlay"><div className="loader-text">PROCESSING...</div></div>}
      
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30, alignItems: 'center' }}>
          <div style={{fontSize:24, fontWeight:'bold', display:'flex', alignItems:'center', gap:10}}>
             {siteTitle} 
             <button onClick={handleManualDeploy} className="neo-btn" title="更新前端"><Icons.Refresh /> 更新博客</button>
          </div>
          <button className="neo-btn" onClick={() => view==='list' ? handleCreate() : setView('list')}>
            {view === 'list' ? '发布新内容' : '返回列表'}
          </button>
        </div>

        {view === 'list' ? (
          <div>
            <input className="glow-input" placeholder="搜索..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} />
            {posts.filter(p=>p.title.toLowerCase().includes(searchQuery.toLowerCase())).map(p => (
              <div key={p.id} className="card-item">
                <div>
                  <div style={{fontWeight:'bold', fontSize:18}}>{p.title}</div>
                  <div style={{fontSize:12, color:'#888', marginTop:5}}>{p.date} · {p.status}</div>
                </div>
                <div style={{display:'flex', gap:10}}>
                   <div onClick={()=>handleEdit(p.id)} style={{color:'greenyellow'}}><Icons.Edit /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{background: '#424242', padding: 30, borderRadius: 20}}>
            <input className="glow-input" placeholder="标题" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
               <input className="glow-input" placeholder="分类" value={form.category} onChange={e=>setForm({...form, category:e.target.value})} />
               <input className="glow-input" type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} />
            </div>
            <BlockBuilder blocks={editorBlocks} setBlocks={setEditorBlocks} />
            
            <div className="fab-scroll">
              <div className="fab-btn" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}><Icons.ArrowUp /></div>
              <div className="fab-btn" onClick={() => window.scrollTo({top:99999, behavior:'smooth'})}><Icons.ArrowDown /></div>
            </div>

            <button onClick={handleSave} style={{width:'100%', padding:15, background:'greenyellow', border:'none', borderRadius:10, fontWeight:'bold', marginTop:20, cursor:'pointer'}}>确认提交</button>
          </div>
        )}
      </div>
    </div>
  );
}