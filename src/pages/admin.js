import React from 'react'
import dynamic from 'next/dynamic'

// ✅ 恢复为原来的大写路径 AdminSystem
const AdminComponent = dynamic(
  () => import('../components/AdminSystem/AdminDashboard'),
  { ssr: false }
)

const AdminPage = () => {
  return (
    <div suppressHydrationWarning>
      <AdminComponent />
    </div>
  )
}

export default AdminPage