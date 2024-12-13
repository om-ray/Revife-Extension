import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import DashboardView from './DashboardView'

export default async function DashboardPage() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  return <DashboardView userId={userId} />
}
