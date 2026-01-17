/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
// @ts-ignore
import { createPortal } from 'react-dom'
import Link from 'next/link'

// 硬编码商家编号
const SHOP_CODE = "PRO-001A"

// 定义公告数据的接口 (假设沿用 Post 的结构)
interface AnnouncementPost {
  id: string
  title: string
  slug: string
  summary?: string
  page_cover?: string
  [key: string]: any
}

export const StatsWidget = ({ data }: { data: AnnouncementPost[] }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // 轮播状态
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const announcements = data && data.length > 0 ? data : [
    {
      id: 'default',
      title: '暂无公告',
      slug: '#',
      summary: '请在 Notion 中添加类型为 Announcement 的文章。',
      page_cover: '' // 空背景
    }
  ]

  const currentPost = announcements[currentIndex]

  useEffect(() => {
    setMounted(true)
  }, [])

  // 自动轮播逻辑
  useEffect(() => {
    if (announcements.length <= 1) return
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length)
        setIsAnimating(false)
      }, 500) // 与 CSS transition 时间匹配
    }, 5000) // 5秒切换一次

    return () => clearInterval(interval)
  }, [announcements.length])

  // 复制功能
  const handleCopy = () => {
    navigator.clipboard.writeText(SHOP_CODE)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // 弹窗组件 (极简版)
  const Modal = () => {
    if (!mounted) return null
    // @ts-ignore
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <style jsx>{`
          @keyframes modalEnter { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
          .animate-modal-enter { animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}</style>
        
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setShowModal(false)}
        ></div>
        
        {/* 弹窗主体：简化高度，去除多余信息 */}
        <div className="relative z-10 w-full max-w-[260px] overflow-hidden rounded-2xl animate-modal-enter
          bg-[#1c1c1e]/90 backdrop-blur-2xl border border-white/10 shadow-2xl p-5 text-center"
        >
          <h3 className="text-lg font-bold text-white mb-4 tracking-wide">
            我的 PRO ID
          </h3>
          
          <div 
            onClick={handleCopy}
            className="group relative cursor-pointer mb-4 p-3 bg-black/40 rounded-xl border border-white/5 shadow-inner hover:border-blue-500/50 transition-colors"
          >
            <span className="text-xl font-mono font-bold text-white tracking-widest select-all">
              {SHOP_CODE}
            </span>
            <div className={`absolute inset-0 flex items-center justify-center rounded-xl bg-blue-600 transition-all duration-200 ${isCopied ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <span className="text-xs font-bold text-white">已复制 ✅</span>
            </div>
          </div>

          <button
            onClick={() => setShowModal(false)}
            className="w-full py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>,
      document.body
    )
  }

  return (
    <React.StrictMode>
      {showModal && <Modal />}

      {/* 外部容器：与 ProfileWidget 保持一致的尺寸和动效 */}
      <div className="relative h-full w-full group/card transition-transform duration-500 ease-out hover:scale-[1.015]">
        
        {/* 流光边缘 */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover/card:opacity-100 blur-[2px] transition-opacity duration-500"></div>

        {/* 主体容器：改为 relative overflow-hidden 以容纳背景图 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516] flex flex-col">
          
          {/* ================= 背景图层 ================= */}
          <div className="absolute inset-0 z-0">
             {/* 图片切换时的淡入淡出 */}
             <div className={`absolute inset-0 transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                {currentPost.page_cover ? (
                  <img 
                    src={currentPost.page_cover} 
                    alt="cover" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // 如果没有封面图，显示一个默认的渐变背景
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black"></div>
                )}
             </div>
             {/* 黑色渐变遮罩：确保文字可读，底部更黑 */}
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          </div>

          {/* ================= 内容层 ================= */}
          <div className="relative z-10 flex flex-col h-full justify-between p-6">
            
            {/* 上半部分：公告内容 (可点击) */}
            <Link href={`/article/${currentPost.slug}`} className="flex-1 flex flex-col justify-center group/text cursor-pointer">
               {/* 装饰标签 */}
               <div className="mb-2 flex items-center gap-2">
                 <span className="px-2 py-0.5 rounded-full bg-red-600/90 text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
                   公告
                 </span>
                 {/* 轮播指示点 */}
                 {announcements.length > 1 && (
                   <div className="flex gap-1">
                     {announcements.map((_, idx) => (
                       <div key={idx} className={`w-1 h-1 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-3' : 'bg-white/30'}`}></div>
                     ))}
                   </div>
                 )}
               </div>

               {/* 标题 */}
               <h2 className={`text-xl font-extrabold text-white leading-tight tracking-tight mb-2 drop-shadow-md transition-opacity duration-500 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'} group-hover/text:text-blue-300 transition-colors`}>
                 {currentPost.title}
               </h2>
               
               {/* 摘要 (限制行数) */}
               <p className={`text-xs text-gray-300 font-medium line-clamp-2 leading-relaxed transition-opacity duration-500 delay-75 ${isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
                 {currentPost.summary || '点击查看详情...'}
               </p>
            </Link>

            {/* 下半部分：PRO ID 按钮 */}
            <div className="w-full mt-4 border-t border-white/10 pt-4">
              <button 
                onClick={() => setShowModal(true)} 
                className="group/btn relative w-full h-10 rounded-xl overflow-hidden
                  bg-white/10 backdrop-blur-md border border-white/10
                  text-xs font-bold text-white tracking-wide
                  transition-all duration-300
                  hover:bg-white/20 hover:border-white/30 active:scale-95"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span>🆔</span>
                  <span>我的 PRO ID</span>
                </div>
                {/* 扫光特效 */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0"></div>
              </button>
            </div>

          </div>
        </div>
      </div>
      
      {/* 注入扫光动画 CSS */}
      <style jsx global>{`
        @keyframes shimmer { 0% { transform: translateX(-150%) skewX(-20deg); } 100% { transform: translateX(150%) skewX(-20deg); } }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
      `}</style>
    </React.StrictMode>
  )
}
