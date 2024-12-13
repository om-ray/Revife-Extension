'use client'

import { UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { userService } from '@/firebase/userService'
import { orderService } from '@/firebase/orderService'

interface DashboardViewProps {
  userId: string
}

export default function DashboardView({ userId }: DashboardViewProps) {
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const userProfile = await userService.getUserById(userId)
        const userOrders = await orderService.getUserOrders(userId)
        setProfile(userProfile)
        setOrders(userOrders)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [userId])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Revife</h1>
              </div>
            </div>
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/"/>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Your Profile</h2>
          {profile ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p>{profile.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{profile.email}</p>
              </div>
              {/* Add more profile fields as needed */}
            </div>
          ) : (
            <p>No profile data available</p>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Your Orders</h2>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded p-4">
                  <p className="font-medium">Order #{order.orderId}</p>
                  <p className="text-sm text-gray-500">
                    Status: {order.status}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No orders yet</p>
          )}
        </div>
      </main>
    </div>
  )
}
