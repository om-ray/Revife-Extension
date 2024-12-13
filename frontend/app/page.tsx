import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default async function Home() {
  const { userId } = auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Check if the user has completed the survey
  // You can add this logic later when you have the survey data in Firebase
  // For now, redirect to dashboard
  redirect('/dashboard')
}
