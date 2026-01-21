import { NextResponse } from 'next/server'

export function middleware(req) {
  // 调试日志：去 Vercel 的 Logs 只要看到这行字，就说明文件位置对了
  console.log('🔒 Middleware active on:', req.nextUrl.pathname);

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

  // 验证失败或未登录
  return new NextResponse('Auth Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

// 这里的 matcher 决定了哪些路径会被拦截
export const config = {
  matcher: ['/admin/:path*', '/admin'],
}