import { classNames } from '@/src/lib/util'
import { BlogStats } from '@/src/types/blog'
import React, { useState, useEffect } from 'react'
import { WidgetContainer } from './WidgetContainer'

// 硬编码的商家编号
const SHOP_CODE = "PRO-001A"

export const StatsWidget = ({ data }: { data: BlogStats }) => {
  const [showModal, setShowModal] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  
  // 确保客户端渲染，避免水合错误
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

  return (
    <React.StrictMode>
      <WidgetContainer>
        
        {/* ================= 纯 CSS 实现的全屏弹窗 (无需 Portal) ================= */}
        {showModal && mounted && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* 1. 全屏遮罩：黑色半透明 + 强毛玻璃 */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
              onClick={() => setShowModal(false)}
            ></div>
            
            {/* 2. 弹窗主体：悬浮卡片 */}
            <div className="relative z-10 w-full max-w-[260px] transform overflow-hidden rounded-xl bg-white/95 dark:bg-[#1a1a1a]/95 p-5 text-center shadow-2xl transition-all border border-white/20 dark:border-white/10 backdrop-blur-xl animate-fade-in-up">
              
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
                <span className="text-lg">🏷️</span>
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                当前商家编号
              </h3>
              
              {/* 编号显示区域 */}
              <div 
                onClick={handleCopy}
                className="group relative cursor-pointer my-4 p-2 bg-gray-50 dark:bg-black/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 transition-colors"
              >
                <span className="text-xl font-mono font-black text-gray-800 dark:text-gray-100 tracking-wider">
                  {SHOP_CODE}
                </span>
                <div className="absolute -top-2 right-0 left-0 mx-auto w-fit bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {isCopied ? '已复制!' : '点击复制'}
                </div>
              </div>

              <button
                type="button"
                className="w-full justify-center rounded-md bg-neutral-900 dark:bg-white px-3 py-1.5 text-xs font-bold text-white dark:text-black hover:opacity-90 transition-opacity"
                onClick={() => setShowModal(false)}
              >
                关闭
              </button>
            </div>
          </div>
        )}

        {/* ================= 组件主界面 ================= */}
        <div className="flex flex-col h-full justify-center items-center px-4 py-3 gap-3">
          
          {/* 1. 标题 + 手指 */}
          <div className="flex items-center justify-center gap-2 mb-1">
             <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-100">
               查看商家编号
             </h2>
             <span className="text-lg animate-bounce cursor-default select-none">
               👇
             </span>
          </div>

          {/* 2. 按钮组 */}
          <div className="flex flex-col gap-2.5 w-full max-w-[180px]"> 
              
              {/* 按钮 1：查看编号 */}
              <button 
                onClick={() => setShowModal(true)} 
                type="button" 
                className="w-full justify-center rounded-md bg-white border border-gray-200 dark:border-transparent px-3 py-1.5 text-xs font-bold text-black shadow-sm hover:bg-gray-50 transition-all"
              >
                查看商家编号
              </button>

              {/* 按钮 2：前往一站式 */}
              <button 
                onClick={() => window.open('https://login.1zs.top/')} 
                type="button" 
                className="w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-red-700 transition-all" 
              >
                前往一站式
              </button>

          </div>
        </div>
      </WidgetContainer>
    </React.StrictMode>
  )
}
