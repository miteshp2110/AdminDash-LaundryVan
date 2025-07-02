"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/charts"
import { ShoppingCart, Users, Truck, Package, ArrowUp, ArrowDown, DollarSign, Calendar } from "lucide-react"

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (() => { throw new Error('NEXT_PUBLIC_BACKEND_URL is not set'); })();

export default function DashboardPage() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers]= useState(0);
  const [activeDrivers, setActiveDrivers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  interface Order {
    order_id: string;
    categories: string;
    amount: number;
    timestamp: string;
  }
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  interface Pickup {
    id: string;
    customer_name: string;
    pickup_date: string;
    status: string;
  }
  const [pickups, setPickups] = useState<Pickup[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/orders`)
        const data = await res.json()
        if (data.success) {
          setTotalOrders(data.data.length)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }
    const fetchTotalUsers = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/total-users`);
        const data = await res.json();
        console.log(data); // Verify the response
    
        // Use 'total_users' instead of 'totalUsers'
        if (data.success) {
          setTotalUsers(data.total_users);
        }
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    const fetchActiveDrivers = async () => {
      try {
        const res= await fetch(`${baseUrl}/admin/active-drivers`)
        const data = await res.json()
        if (data.success) {
          setActiveDrivers(data.data.length)
        }
      } catch (error) {
        console.error("Error fetching active drivers:", error)
      }
    }

    const fetchRevenue = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/orders-total-revenue`)
        const data = await res.json()
        console.log(data); // Verify the response
        if (data.success) {
          setRevenue(data.totalRevenue)
        }
      } catch (error) {
        console.error("Error fetching revenue:", error)
      }
    }
    const fetchRecentOrders = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/orders-recent`);
        const data = await res.json();
        if (data.success) {
          setRecentOrders(data.recentOrders);
          console.log(data.recentOrders); // Verify the response
          setLoading(false); // Set loading to false after fetching data
        } else {
          console.error("Failed to fetch recent orders");
        }
      } catch (err) {
        console.error("Error fetching recent orders:", err);
      }
    };
    const fetchPickups = async () => {
      try {

        const response = await fetch(`${baseUrl}/admin/todays-pickups`); // Replace with your actual API path
        const data = await response.json();
        if (data.success) {
          setPickups(data.todaysPickups);
        } else {
          console.error("Failed to fetch pickups:", data.message);
        }
      } catch (error) {
        console.error("Error fetching today's pickups:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPickups();
    fetchRecentOrders();
    fetchOrders()
    fetchTotalUsers()
    fetchActiveDrivers()
    fetchRevenue()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-text-dark">Dashboard</h1>
          <p className="text-text-muted mt-2">Welcome to your Laundry-Van admin dashboard</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Total Orders</p>
                  <h3 className="text-2xl font-bold text-text-dark mt-1">{totalOrders}</h3>

                </div>
                <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Static Cards: You can make them dynamic later too */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Total Users</p>
                  <h3 className="text-2xl font-bold text-text-dark mt-1">
                    {totalUsers !== 0 ? totalUsers : 'Loading...'}
                  </h3>

                </div>
                <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                  <Users className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Active Drivers</p>
                  <h3 className="text-2xl font-bold text-text-dark mt-1">{activeDrivers}</h3>

                </div>
                <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                  <Truck className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Revenue</p>
                  <h3 className="text-2xl font-bold text-text-dark mt-1">AED {revenue}</h3>

                </div>
                <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>Monthly revenue for the current year</CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Service Distribution</CardTitle>
                  <CardDescription>Breakdown of services by popularity</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.order_id}
                        className="flex items-center justify-between border-b border-line-light pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-bg-light flex items-center justify-center mr-3">
                            <Package className="h-5 w-5 text-brand-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-text-dark">Order #{order.order_id}</p>
                            <p className="text-sm text-text-muted">{order.categories}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-text-dark">AED {order.amount}</p>
                          <p className="text-sm text-text-muted">{order.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

    {/*          <Card>*/}
    {/*  <CardHeader>*/}
    {/*    <CardTitle>Upcoming Pickups</CardTitle>*/}
    {/*    <CardDescription>Scheduled for today</CardDescription>*/}
    {/*  </CardHeader>*/}
    {/*  <CardContent>*/}
    {/*    <div className="space-y-4">*/}
    {/*      {loading ? (*/}
    {/*        <p>Loading...</p>*/}
    {/*      ) : pickups.length === 0 ? (*/}
    {/*        <p className="text-text-muted">No pickups scheduled for today.</p>*/}
    {/*      ) : (*/}
    {/*        pickups.map((order) => (*/}
    {/*          <div*/}
    {/*            key={order.id}*/}
    {/*            className="flex items-center justify-between border-b border-line-light pb-4 last:border-0 last:pb-0"*/}
    {/*          >*/}
    {/*            <div className="flex items-center">*/}
    {/*              <div className="h-10 w-10 rounded-full bg-bg-light flex items-center justify-center mr-3">*/}
    {/*                <Calendar className="h-5 w-5 text-brand-primary" />*/}
    {/*              </div>*/}
    {/*              <div>*/}
    {/*                <p className="font-medium text-text-dark">*/}
    {/*                  {order.customer_name || "Unknown"}*/}
    {/*                </p>*/}
    {/*                <p className="text-sm text-text-muted">*/}
    {/*                  {new Date(order.pickup_date).toLocaleTimeString([], {*/}
    {/*                    hour: "2-digit",*/}
    {/*                    minute: "2-digit",*/}
    {/*                  })}*/}
    {/*                </p>*/}
    {/*              </div>*/}
    {/*            </div>*/}
    {/*            <div className="text-right">*/}
    {/*              <p className="text-sm font-medium text-status-success">*/}
    {/*                {order.status || "Confirmed"}*/}
    {/*              </p>*/}
    {/*            </div>*/}
    {/*          </div>*/}
    {/*        ))*/}
    {/*      )}*/}
    {/*    </div>*/}
    {/*  </CardContent>*/}
    {/*</Card>*/}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed analytics will be displayed here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border border-dashed border-line-medium rounded-md">
                  <p className="text-text-muted">Analytics content coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Detailed reports will be displayed here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border border-dashed border-line-medium rounded-md">
                  <p className="text-text-muted">Reports content coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
