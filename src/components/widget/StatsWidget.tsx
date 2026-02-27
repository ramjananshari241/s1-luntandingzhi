/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
// @ts-ignore
import { createPortal } from 'react-dom'

// 🟢 你的自定义购买地址（请在这里修改为你真实的贩售机链接）
const BUY_LINK = "https://your-custom-buy-link.com"

export const StatsWidget = ({ data }: { data: any }) => {
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 1. 数据解析 (保持原样不动)
  const post = data || {};
  
  // 🚫 彻底移除图片逻辑，只使用纯色背景 (保持原样不动)
  
  const title = post.title || '暂无公告';
  const summary = post.summary || post.excerpt || '暂无详细内容...';
  const slug = post.slug ? `/post/${post.slug}` : null;

  useEffect(() => {
    setMounted(true)
  },[])

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [showModal])

  // --- 弹窗组件 (🟢 极简、物理3D按键、高级日式贩售机风格) ---
  const Modal = () => {
    if (!mounted) return null
    // @ts-ignore
    return createPortal(
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <style jsx>{`
          @keyframes modalFade {
            0% { opacity: 0; backdrop-filter: blur(0px); }
            100% { opacity: 1; backdrop-filter: blur(8px); }
          }
          @keyframes cardPop {
            0% { opacity: 0; transform: scale(0.9) translateY(10px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-modal-bg { animation: modalFade 0.3s ease forwards; }
          .animate-card-pop { animation: cardPop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          
          /* 🟢 纯正的物理 3D 按钮样式 */
          .btn-3d {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 18px 24px;
            font-size: 16px;
            font-weight: 900;
            letter-spacing: 4px;
            color: #ffffff;
            background-color: #007aff;
            border-radius: 14px;
            /* 使用纯色硬阴影制造物理厚度感 */
            box-shadow: 0 6px 0 #004d9e, 0 15px 25px rgba(0, 122, 255, 0.25);
            transition: transform 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.1s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            text-decoration: none;
          }
          /* 按下时的物理回弹反馈 */
          .btn-3d:active {
            transform: translateY(6px);
            box-shadow: 0 0 0 #004d9e, 0 5px 10px rgba(0, 122, 255, 0.2);
          }
        `}</style>

        {/* 遮罩：点击空白处依然可以关闭 */}
        <div 
          className="absolute inset-0 bg-black/70 animate-modal-bg cursor-pointer"
          onClick={() => setShowModal(false)}
        ></div>
        
        {/* 弹窗主体：纯粹、无多余元素的深色磨砂卡片 */}
        <div className="relative z-10 w-full max-w-[260px] rounded-3xl animate-card-pop bg-[#1a1a1c] shadow-2xl border border-white/5 p-8 flex flex-col items-center">
          
          {/* 极简提示 */}
          <h3 className="text-xs font-bold text-white/50 mb-8 tracking-[0.3em] uppercase">
            Official Vending
          </h3>

          {/* 唯一的入口：3D 立体蓝色按钮 */}
          <a
            href={BUY_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d"
            onClick={() => setShowModal(false)}
          >
            立即前往
          </a>

        </div>
      </div>,
      document.body
    )
  }

  // --- 动态渲染标签 (保持原样不动) ---
  // @ts-ignore
  const Wrapper = slug ? Link : 'div';
  // @ts-ignore
  const wrapperProps = slug 
    ? { href: slug, className: "flex-1 flex flex-col justify-center group/text cursor-pointer relative z-20" } 
    : { className: "flex-1 flex flex-col justify-center relative z-20 opacity-80" };

  return (
    <React.StrictMode>
      <style jsx global>{`
        @keyframes borderFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-border-flow { background-size: 200% 200%; animation: borderFlow 3s ease infinite; }
      `}</style>

      {showModal && <Modal />}

      <div className="relative h-full w-full group/card transition-transform duration-500 ease-out hover:scale-[1.015]">
        
        {/* 流光边缘 (保留原样不动) */}
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-0 group-hover/card:opacity-70 blur-sm transition-opacity duration-500 animate-border-flow"></div>

        {/* 主体容器 (保留原样不动) */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#151516] flex flex-col">
          
          {/* ================= 背景图层 (保留原样不动) ================= */}
          <div className="absolute inset-0 z-0">
             <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-purple-900">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px]"></div>
             </div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent"></div>
          </div>

          {/* ================= 内容层 (保留原样不动) ================= */}
          <div className="relative z-10 flex flex-col h-full justify-between p-5 md:p-6">
            
            {/* 上半部分：公告内容 */}
            {/* @ts-ignore */}
            <Wrapper {...wrapperProps}>
               <div className="mb-2 flex items-center gap-1.5 opacity-90">
                 <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                 <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">公告</span>
               </div>

               <h2 className="text-xl md:text-2xl font-extrabold text-white leading-tight tracking-tight mb-2 group-hover/text:text-purple-300 transition-colors line-clamp-2">
                 {title}
               </h2>

               <p className="text-xs text-gray-300/90 font-medium line-clamp-2 leading-relaxed">
                 {summary}
               </p>
            </Wrapper>

            {/* 下半部分：触发弹窗的入口按钮 */}
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
                <span className="text-sm">🛒</span>
                <span>前往贩售机</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </React.StrictMode>
  )
}
