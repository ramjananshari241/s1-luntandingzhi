/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
// @ts-ignore
import { createPortal } from 'react-dom'
// ⬇️ 关键修改：使用相对路径 + 忽略TS检查，强行引入全局数据钩子
// @ts-ignore
import { useGlobal } from '../../lib/global'

// 硬编码站长ID
const SHOP_CODE = "PRO-001A"

export const StatsWidget = ({ data }: { data: any }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // 1. 获取全局数据 (包含所有文章)
  const globalData = useGlobal()
  const allNavPages = globalData?.allNavPages || []
  
  const [announcement, setAnnouncement] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
    // 2. 自动在全局数据中查找 slug 为 'announcement' 的文章
    if (allNavPages && allNavPages.length > 0) {
      const found = allNavPages.find((p: any) => p.slug === 'announcement')
      if (found) {
        setAnnouncement(found)
      }
    }
  }, [allNavPages])

  // 3. 数据解析 (如果没找到文章，使用默认兜底)
  // 这里的逻辑和 Profile 组件完全一致：优先读 pageCover，没有就读 cover
  const cover = announcement?.pageCover || announcement?.cover || ''; 
  const title = announcement?.title || '暂无公告';
  // 优先读 summary，没有就读 excerpt
  const summary = announcement?.summary || announcement?.excerpt || '暂无详细内容...';
  // 生成跳转链接
  const slugLink = announcement?.slug ? `/post/${announcement.slug}` : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SHOP_CODE)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

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
          @keyframes modalEnter { 0% { opacity: 0; transform: scale(0.95) translateY(10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
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

  // --- 动态渲染标签 ---
  const Wrapper = slugLink ? Link : 'div';
  const wrapperProps = slugLink 
    ? { href: slugLink, className: "flex-1 flex flex-col justify-center group/text cursor-pointer relative z-20" } 
    : { className: "flex-1 flex flex-col justify-center relative z-20 opacity-80" };

  return (
    <React.StrictMode>
      <style jsx global>{`
        @keyframes borderFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-border-flow { background-size: 200% 200%; animation: borderFlow 3s ease infinite; }
      `}</style>

      {showModal && <Modal />}

      <div className="relative h-full w-full group/card transition-transform duration-500 ease-out hover:scale-[1.015]">
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity duration-500 animate-border-flow"></div>
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516] flex flex-col">
          
          {/* ================= 背景图层 ================= */}
          <div className="absolute inset-0 z-0">
            {cover ? (
              <img 
                src={cover} 
                alt="Announcement Cover" 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110 opacity-90"
              />
            ) : (
              // 兜底背景：你喜欢的紫色渐变 (当 Notion 没有 Cover 时显示这个)
              <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px]"></div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20"></div>
          </div>

          {/* ================= 内容层 ================= */}
          <div className="relative z-10 flex flex-col h-full justify-between p-5 md:p-6">
            
            {/* 上半部分：公告内容 */}
            {/* @ts-ignore */}
            <Wrapper {...wrapperProps}>
               <div className="mb-2 flex items-center gap-1.5 opacity-90">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                 <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">公告</span>
               </div>

               <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight mb-2 group-hover/text:text-purple-300 transition-colors line-clamp-2">
                 {title}
               </h2>

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
