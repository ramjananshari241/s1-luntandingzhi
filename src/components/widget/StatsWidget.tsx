import { BlogStats } from '@/src/types/blog'
import React, { useState, useEffect } from 'react'
// @ts-ignore
import { createPortal } from 'react-dom'
import { WidgetContainer } from './WidgetContainer'

// 硬编码商家编号
const SHOP_CODE = "PRO-001A"

export const StatsWidget = ({ data }: { data: BlogStats }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
        {/* 遮罩 */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
          onClick={() => setShowModal(false)}
        ></div>
        
        {/* 弹窗主体 */}
        <div className="relative z-10 w-full max-w-[280px] transform overflow-hidden rounded-2xl bg-[#1c1c1e] p-6 text-center shadow-2xl transition-all border border-white/10 animate-fade-in-up">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-80"></div>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 border border-white/10">
            <span className="text-xl">🏷️</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1 tracking-wide">商家编号</h3>
          <p className="text-xs text-gray-400 mb-5">点击下方卡片复制编号</p>
          <div 
            onClick={handleCopy}
            className="group relative cursor-pointer mb-5 p-3 bg-black/40 rounded-xl border border-white/5 shadow-inner hover:border-blue-500/50 transition-colors"
          >
            <span className="text-xl font-mono font-bold text-white tracking-widest">{SHOP_CODE}</span>
            <div className={`absolute inset-0 flex items-center justify-center rounded-xl bg-blue-600 transition-all duration-200 ${isCopied ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
              <span className="text-xs font-bold text-white">已复制 ✅</span>
            </div>
          </div>
          <button
            type="button"
            className="w-full py-2.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors"
            onClick={() => setShowModal(false)}
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
      {/* 注入流光和呼吸动画 CSS */}
      <style jsx global>{`
        /* 按钮扫光动画 */
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
        /* 边框流光背景移动 */
        @keyframes borderFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s infinite; /* 加快速度，更明显 */
        }
        .animate-border-flow {
          background-size: 200% 200%;
          animation: borderFlow 3s ease infinite;
        }
      `}</style>

      {showModal && <Modal />}

      {/* 
         外部容器 Wrapper：负责处理 hover 缩放 
         group/card 用于控制内部的流光显示
      */}
      <div className="relative h-full w-full group/card transition-transform duration-300 ease-out hover:scale-[1.02]">
        
        {/* ✨ 核心特效：科幻流光边缘 ✨
            原理：在卡片后面放一个略大的渐变层，平时透明，hover时显示，形成发光边框效果
        */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity duration-500 animate-border-flow"></div>

        {/* 真实的毛玻璃卡片本体 */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516]/80 backdrop-blur-2xl">
          
          {/* 背景装饰：深邃的极光 */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-[40px] pointer-events-none group-hover/card:bg-blue-600/20 transition-colors duration-500"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/10 rounded-full blur-[40px] pointer-events-none group-hover/card:bg-purple-600/20 transition-colors duration-500"></div>

          {/* 内容层 */}
          <div className="relative z-10 flex flex-col h-full justify-between p-6">
            
            {/* 上半部分：标题 */}
            <div className="flex-1 flex flex-col items-center justify-center">
               <h2 className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg antialiased group-hover/card:text-blue-50 transition-colors">
                 查看商家编号
               </h2>
            </div>

            {/* 下半部分：动效按钮组 */}
            <div className="flex flex-col gap-3 w-full mt-2"> 
                
                {/* 按钮 1：白色 + 黑色流光扫过 */}
                <button 
                  onClick={() => setShowModal(true)} 
                  type="button" 
                  className="group/btn relative w-full h-9 rounded-lg overflow-hidden
                    bg-white text-black 
                    text-xs font-bold tracking-wide antialiased
                    shadow-lg shadow-white/5
                    transition-all duration-300
                    hover:shadow-white/20"
                >
                  {/* 文字层 */}
                  <span className="relative z-10">查看商家编号</span>
                  
                  {/* ✨ 扫光层 (黑色半透明，在白色背景上显眼) */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </button>

                {/* 按钮 2：红色 + 白色流光扫过 */}
                <button 
                  onClick={() => window.location.href = 'https://login.1zs.top/'} 
                  type="button" 
                  className="group/btn relative w-full h-9 rounded-lg overflow-hidden
                    bg-red-600 text-white 
                    text-xs font-bold tracking-wide antialiased
                    border border-white/5
                    shadow-lg shadow-red-600/20
                    transition-all duration-300
                    hover:bg-red-500 hover:shadow-red-600/40" 
                >
                  <span className="relative z-10">前往一站式</span>
                  
                  {/* ✨ 扫光层 (亮白色，在红色背景上显眼) */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:animate-shimmer z-0 pointer-events-none"></div>
                </button>

            </div>
          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
