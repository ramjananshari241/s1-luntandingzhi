import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 🔐 核心修复：Body 设为 null，符合 Next.js 13 Edge Runtime 规范
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. 拦截逻辑
  if (pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization')

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      // 建议去 Vercel 后台设置 AUTH_USER 和 AUTH_PASS
      const validUser = process.env.AUTH_USER || 'admin'
      const validPass = process.env.AUTH_PASS || '123456'

      if (user === validUser && pwd === validPass) {
        return NextResponse.next()
      }
    }

    // 2. 验证失败：Body 必须是 null！
    return new NextResponse(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  // 3. 放行其他页面
  return NextResponse.next()
}

export const config = {
  // 匹配所有 /admin 开头的路径
  matcher: ['/admin/:path*', '/admin'],
}