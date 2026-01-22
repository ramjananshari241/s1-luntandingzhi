import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 1. 严格拦截 /admin
  if (pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization')

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1]
      const [user, pwd] = atob(authValue).split(':')

      // 验证 Vercel 环境变量
      const validUser = process.env.AUTH_USER || 'admin'
      const validPass = process.env.AUTH_PASS || '123456'

      if (user === validUser && pwd === validPass) {
        return NextResponse.next()
      }
    }

    // 2. 验证失败：返回 401 (Body 为空，防止报错)
    return new NextResponse(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  // 3. 首页和其他页面直接放行，不进行任何 Auth 检查
  return NextResponse.next()
}

export const config = {
  // 仅匹配 admin 路径，绝不匹配首页
  matcher: ['/admin/:path*', '/admin'],
}