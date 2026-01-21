import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 🔒 核心修复：如果不包含 /admin，直接放行，绝不弹窗
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // --- 只有进入 /admin 才会执行下面的验证 ---
  const basicAuth = req.headers.get('authorization')

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    const [user, pwd] = atob(authValue).split(':')

    const validUser = process.env.AUTH_USER || 'admin'
    const validPass = process.env.AUTH_PASS || '123456'

    if (user === validUser && pwd === validPass) {
      return NextResponse.next()
    }
  }

  // 验证失败：返回 401，Body 为 null (防止报错)
  return new NextResponse(null, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Admin Area"',
    },
  })
}

// ⚠️ 范围限制：只针对 admin 路径生效
export const config = {
  matcher: ['/admin/:path*', '/admin'],
}