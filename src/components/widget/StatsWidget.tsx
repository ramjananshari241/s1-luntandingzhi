/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
// @ts-ignore
import { createPortal } from 'react-dom'
import { useGlobal } from '@/src/lib/global' // 👈 核心：引入全局数据钩子

// 硬编码站长ID
const SHOP_CODE = "PRO-001A"

// 定义数据接口（防止TS报错）
interface PostData {
  slug: string
  title: string
  summary?: string
  excerpt?: string
  pageCover?: string
  cover?: string
}

export const StatsWidget = ({ data: initialData }: { data: any }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // 1. 获取全局数据
  const { allNavPages } = useGlobal()
  const [announcement, setAnnouncement] = useState<PostData | null>(null)

  useEffect(() => {
    setMounted(true)
    // 2. 自动查找公告数据 (优先使用 props 传入的，如果没有，去全局列表找)
    if (initialData) {
      setAnnouncement(initialData)
    } else if (allNavPages) {
      const found = allNavPages.find((p: any) => p.slug === 'announcement')
      if (found) setAnnouncement(found)
    }
  }, [initialData, allNavPages])

  // 3. 数据解析
  const cover = announcement?.pageCover || announcement?.cover || ''; 
  const title = announcement?.title || '暂无公告';
  // 优先取 summary，没有则取 excerpt
  const summary = announcement?.summary || announcement?.excerpt || '暂无详细内容...';
  // 如果找到了文章，生成链接；否则不可点击
  const linkHref = announcement?.slug ? `/post/${announcement.slug}` : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SHOP_CODE)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // 禁止背景滚动
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [showModal])

  // --- 弹窗组件 ---
  const Modal = () => {
    if (!mounted) return null
    
    // @ts-ignore
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <style jsx>{`
          @keyframes modalEnter { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
          .animate-modal-enter { animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={() => setShowModal(false)}></div>
        <div className="relative z-10 w-full max-w-[260px] overflow-hidden rounded-2xl animate-modal-enter bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 shadow-2xl text-center p-6">
          <h3 className="text-base font-bold text-white mb-4 tracking-wide">站长 ID</h3>
          <div onClick={handleCopy} className="group relative cursor-pointer p-3 bg-black/50 rounded-xl border border-white/5 hover:border-blue-500/50 transition-all active:scale-95">
            <span className="text-xl font-mono font-bold text-white tracking-wider">{SHOP_CODE}</span>
            <div className={`absolute inset-0 flex items-center justify-center rounded-xl bg-blue-600 transition-all duration-200 ${isCopied ? 'opacity-100 visible' : 'opacity-0 invisible'}`}><span className="text-xs font-bold text-white">已复制 ✅</span></div>
          </div>
          <button className="mt-5 w-full py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors" onClick={() => setShowModal(false)}>关闭</button>
        </div>
      </div>,
      document.body
    )
  }

  // 包装器：如果有链接，就是 Link；否则是 div
  const Wrapper = linkHref ? Link : 'div';
  const wrapperProps = linkHref 
    ? { href: linkHref, className: "flex-1 flex flex-col justify-center group/text cursor-pointer relative z-20" } 
    : { className: "flex-1 flex flex-col justify-center relative z-20 opacity-80" };

  return (
    <React.StrictMode>
      <style jsx global>{`
        @keyframes borderFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-border-flow { background-size: 200% 200%; animation: borderFlow 3s ease infinite; }
      `}</style>

      {showModal && <Modal />}

      <div className="relative h-full w-full group/card transition-transform duration-500 ease-out hover:scale-[1.015]">
        
        {/* 流光边缘 (与 Profile 一致) */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity duration-500 animate-border-flow"></div>

        {/* 主体容器 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516] flex flex-col">
          
          {/* ================= 背景处理 ================= */}
          <div className="absolute inset-0 z-0">
            {cover ? (
              // 方案 A: 有封面图 -> 显示图片 + 动效
              <img 
                src={cover} 
                alt="Announcement Cover" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110 opacity-90"
              />
            ) : (
              // 方案 B: 无封面图 -> 显示紫色默认渐变 (你截图里的效果)
              <div className="w-full h-full bg-gradient-to-br from-[#2e1065] via-[#4c1d95] to-[#000000]">
                 {/* 加一点噪点或光斑，增加质感 */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px]"></div>
              </div>
            )}
            
            {/* 渐变遮罩：无论有没有图，都加一层，保证文字清晰 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10"></div>
          </div>

          {/* ================= 内容层 ================= */}
          <div className="relative z-10 flex flex-col h-full justify-between p-5 md:p-6">
            
            {/* 上半部分：公告信息 */}
            {/* @ts-ignore */}
            <Wrapper {...wrapperProps}>
               {/* 装饰性标签 */}
               <div className="mb-2 flex items-center gap-1.5 opacity-90">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                 <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">公告</span>
               </div>

               {/* 标题 */}
               <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight mb-2 group-hover/text:text-purple-300 transition-colors line-clamp-2">
                 {title}
               </h2>

               {/* 摘要 (excerpt) */}
               <p className="text-xs text-gray-300/90 font-medium line-clamp-2 leading-relaxed">
                 {summary}
               </p>
            </Wrapper>

            {/* 下半部分：站长 ID 按钮 */}
            <div className="w-full mt-4 relative z-20">
              <button 
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation();
                  setShowModal(true);
                }} 
                type="button" 
                // 按钮样式：毛玻璃 + 边框，与整体风格融合
                className="w-full h-9 rounded-xl flex items-center justify-center gap-2
                  bg-white/10 backdrop-blur-md border border-white/10
                  text-xs font-bold text-white tracking-wide
                  transition-all duration-300
                  hover:bg-white/20 hover:scale-[1.02] active:scale-95 active:bg-white/5"
              >
                <span className="text-sm">🆔</span>
                <span>站长 ID</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
