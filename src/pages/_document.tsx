import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="zh-CN">
      <Head>
        {/* 🟢 全局图标设置：这里设置后，所有页面都会有图标 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon.ico" />
        <meta name="theme-color" content="#303030" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
