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
        {/* 全屏遮罩 */}
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
      {showModal && <Modal />}

      {/* 外部容器：iOS 风格 3D 毛玻璃 */}
      <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl group">
        {/* 背景层 */}
        <div className="absolute inset-0 bg-[#151516]/60 backdrop-blur-2xl z-0"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-[40px] pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-600/20 rounded-full blur-[40px] pointer-events-none"></div>

        {/* 内容层 */}
        <div className="relative z-10 flex flex-col h-full justify-between p-6">
          
          {/* 上半部分：标题 */}
          <div className="flex-1 flex flex-col items-center justify-center">
             {/* 
                修复字体：改用 font-extrabold 而不是 black，防止笔画粘连。
                加大字号，去除多余特效，保持纯净。
             */}
             <h2 className="text-2xl font-extrabold text-white tracking-wide drop-shadow-md">
               查看商家编号
             </h2>
          </div>

          {/* 下半部分：3D 立体按钮组 */}
          <div className="flex flex-col gap-3 w-full mt-2"> 
              
              {/* 按钮 1：白色立体按键 */}
              <button 
                onClick={() => setShowModal(true)} 
                type="button" 
                // 细节调整：h-9 (36px高度更细长)，text-xs (字体防溢出)，tracking-wider (防压扁)
                // 3D效果：border-b-[3px] 底部加厚，active时下沉
                className="w-full h-9 rounded-lg flex items-center justify-center
                  bg-gradient-to-b from-white to-gray-200 
                  text-black text-xs font-extrabold tracking-wider
                  border border-gray-300 border-b-[3px] border-b-gray-400
                  active:border-b-0 active:translate-y-[3px] active:shadow-inner
                  shadow-lg transition-all duration-75 ease-out shrink-0"
              >
                查看商家编号
              </button>

              {/* 按钮 2：红色立体按键 */}
              <button 
                onClick={() => window.location.href = 'https://login.1zs.top/'} 
                type="button" 
                className="w-full h-9 rounded-lg flex items-center justify-center
                  bg-gradient-to-b from-red-500 to-red-600 
                  text-white text-xs font-extrabold tracking-wider
                  border border-red-700 border-b-[3px] border-b-red-800
                  active:border-b-0 active:translate-y-[3px] active:shadow-inner
                  shadow-lg transition-all duration-75 ease-out shrink-0"
              >
                前往一站式
              </button>

          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
