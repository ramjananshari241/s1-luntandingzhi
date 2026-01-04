import React, { useState, useEffect } from 'react'
// 引入原本的基础 Callout 组件，用于解锁后显示
import { Callout } from './BasicBlock'

export const EncryptedCallout = ({ block, children }: { block: any; children: any }) => {
  // 1. 获取 Callout 里的纯文本内容
  // Notion API 数据结构通常是 block.callout.rich_text[0].plain_text
  // 这里做了多重兼容处理
  const richText = block.callout?.rich_text || [];
  const rawText = richText.map((t: any) => t.plain_text).join('') || '';
  
  // 2. 检查是否有加密标记
  const isLockedBlock = rawText.startsWith('LOCK:');

  // 如果没有 LOCK: 标记，直接渲染原本的 Callout 组件
  if (!isLockedBlock) {
    return <Callout block={block}>{children}</Callout>;
  }

  // --- 加密逻辑 ---
  const correctPassword = rawText.replace('LOCK:', '').trim();
  const [input, setInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);

  // 检查本地缓存 (可选：用户刷新页面不用重新输密码)
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

  // 状态 A: 已解锁 -> 显示原本的 Callout（包含其中的图片/文字）
  if (isUnlocked) {
    return (
      <div className="relative animate-fade-in">
        <div className="absolute top-0 right-0 z-10 px-2 py-1 text-xs text-green-600 bg-green-100 rounded-bl-lg rounded-tr-lg opacity-80 pointer-events-none">
          已解锁 🔓
        </div>
        {/* 渲染原本的 Callout 组件 */}
        <Callout block={block}>{children}</Callout>
      </div>
    );
  }

  // 状态 B: 未解锁 -> 显示密码框
  return (
    <div className="my-4 p-8 border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 rounded-xl text-center shadow-sm select-none">
      <div className="text-4xl mb-3">🔏</div>
      <h3 className="font-bold text-lg mb-2 text-neutral-800 dark:text-neutral-200">
        加密内容
      </h3>
      <p className="text-sm text-neutral-500 mb-4">
        请输入密码以查看此区域的图片或文字
      </p>
      
      <div className="flex justify-center items-center gap-2 max-w-[280px] mx-auto">
        <input 
          type="password" 
          placeholder="密码..."
          className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
        />
        <button 
          onClick={handleUnlock}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
        >
          查看
        </button>
      </div>
      {error && <p className="text-red-500 text-xs mt-3 font-medium">❌ 密码错误</p>}
    </div>
  );
};
