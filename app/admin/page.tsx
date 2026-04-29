import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/auth-option'
import AdminPage from './component/AdminPage'

const page = async () => {
 const session = await getServerSession(authOptions)
  if (!session || session?.user?.role !== "admin") {
    redirect("/admin/login")
  }
    return (
    <AdminPage />
  )
}

export default page