import React, { useState, useEffect } from 'react'
import { Callout } from './BasicBlock'

export const EncryptedCallout = ({ block, children }: { block: any; children: any }) => {
  // 1. 获取 Callout 的文本内容
  const richText = block.callout?.rich_text || [];
  const rawText = richText.map((t: any) => t.plain_text).join('') || '';
  
  // 2. 检查是否包含加密标记 (支持 "LOCK:" 或 "LOCK: ")
  // 使用正则匹配，允许冒号后面有空格，更加灵活
  const lockMatch = rawText.match(/^LOCK:\s*(.+)$/);
  const isLockedBlock = !!lockMatch;

  // 如果没有 LOCK: 标记，直接渲染原本的 Callout 组件
  if (!isLockedBlock) {
    return <Callout block={block}>{children}</Callout>;
  }

  // --- 加密逻辑 ---
  
  // 提取密码 (正则捕获组)
  const correctPassword = lockMatch[1].trim();
  
  const [input, setInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  // 检查本地缓存
  useEffect(() => {
    if (localStorage.getItem(`unlocked-${block.id}`) === 'true') {
      setIsUnlocked(true);
    }
  }, [block.id]);

  const handleUnlock = () => {
    if (input === correctPassword) {
      setIsUnlocked(true);
      setError(false);
      localStorage.setItem(`unlocked-${block.id}`, 'true');
    } else {
      setError(true);
      alert('密码错误');
    }
  };

  // 状态 A: 已解锁
  if (isUnlocked) {
    // 🎨 【关键优化】：创建一个“干净”的 Block 数据副本
    // 我们把 rich_text 清空，这样解锁后，顶部的 "LOCK:123" 文字就会消失
    // 只保留分割线和下面的内容，视觉效果更完美
    const cleanBlock = {
      ...block,
      callout: {
        ...block.callout,
        rich_text: [] // 清空标题文字
      }
    };

    return (
      <div className="relative animate-fade-in group">
        {/* 右上角的小提示，鼠标悬停时显示重新上锁按钮(可选) */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             onClick={() => {
               localStorage.removeItem(`unlocked-${block.id}`);
               setIsUnlocked(false);
             }}
             className="text-xs bg-neutral-200 dark:bg-neutral-700 hover:bg-red-500 hover:text-white px-2 py-1 rounded text-neutral-500"
             title="重新上锁"
           >
             🔒
           </button>
        </div>

        {/* 渲染 Callout：此时标题为空，第一行直接显示分割线（如果在 Notion 里加了的话） */}
        <Callout block={cleanBlock}>
          {children}
        </Callout>
      </div>
    );
  }

  // 状态 B: 未解锁 -> 显示密码框 (UI 美化版)
  return (
    <div className="my-4 p-8 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-center shadow-sm select-none transition-all hover:shadow-md">
      <div className="text-4xl mb-3 animate-bounce">🔐</div>
      <h3 className="font-bold text-lg mb-2 text-neutral-800 dark:text-neutral-200">
        受保护的内容
      </h3>
      <p className="text-sm text-neutral-500 mb-6">
        此内容已被加密，请输入密码解锁
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-sm mx-auto">
        <input 
          type="password" 
          placeholder="输入访问密码..."
          className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
        />
        <button 
          onClick={handleUnlock}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <span>解锁</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </button>
      </div>
      
      {error && (
        <div className="mt-4 text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 py-1 px-3 rounded inline-block animate-pulse">
          ⚠️ 密码错误，请核对后重试
        </div>
      )}
    </div>
  );
};
