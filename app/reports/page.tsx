"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, BarChart3, PieChartIcon, TrendingUp, FileText } from "lucide-react"
import { LineChart, BarChart, OrderLineChart, DriverLineChart, DriverPieChart } from "@/components/charts"

const baseUrl = "http://ec2-65-0-21-246.ap-south-1.compute.amazonaws.com/admins"
// const baseUrl = "http://localhost:5000"
export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("daily")
  const [revenue, setRevenue] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [average, setAverage] = useState(0)
  const [serviceRevenue, setServiceRevenue] = useState([])
  const [revenueData, setRevenueData] = useState([])

  useEffect(() => {
    fetch(`${baseUrl}/admin/regions/revenue?timeRange=${timeRange.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setRevenueData(data.data)
        }
      })
  }, [timeRange])

  useEffect(() => {
    fetch(`${baseUrl}/admin/services/revenue?timeRange=${timeRange.toLowerCase()}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setServiceRevenue(result.data)
        else console.warn("Failed to load service revenue")
      })
      .catch((err) => console.error("Error loading revenue:", err))
  }, [timeRange])

  useEffect(() => {
    const fetchAverageOrderValue = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/orders/average-order-value?timeRange=${timeRange.toLowerCase()}`)
        const data = await res.json()
        console.log("average " + data)
        if (data.success) {
          setAverage(data.averageOrderValue)
        }
      } catch (error) {
        console.error("Error fetching average order value:", error)
      }
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/orders?timeRange=${timeRange.toLowerCase()}`)
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
        const res = await fetch(`${baseUrl}/admin/total-users?timeRange=${timeRange.toLowerCase()}`)
        const data = await res.json()
        console.log(data)

        if (data.success) {
          setTotalUsers(data.total_users)
        }
      } catch (error) {
        console.error("Error fetching total users:", error)
      }
    }

    const fetchRevenue = async () => {
      try {
        const res = await fetch(`${baseUrl}/admin/orders-total-revenue?timeRange=${timeRange.toLowerCase()}`)
        const data = await res.json()
        console.log(data)
        if (data.success) {
          setRevenue(data.totalRevenue)
        }
      } catch (error) {
        console.error("Error fetching revenue:", error)
      }
    }

    fetchRevenue()
    fetchOrders()
    fetchTotalUsers()
    fetchAverageOrderValue()
  }, [timeRange])

  // @ts-ignore
  // @ts-ignore
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Reports & Analytics</h1>
            <p className="text-text-muted mt-2">View detailed reports and analytics for your business</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select
              defaultValue={timeRange.toLowerCase()}
              onValueChange={(value) => setTimeRange(value.charAt(0).toUpperCase() + value.slice(1))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Total Revenue</p>
                  <h3 className="text-2xl font-bold text-text-dark mt-1">AED {revenue}</h3>
                  {/* <p className="text-status-success text-sm mt-1">+18.3% from last period</p> */}
                </div>
                <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Total Orders</p>
                  <h3 className="text-2xl font-bold text-text-dark mt-1">{totalOrders}</h3>
                  {/* <p className="text-status-success text-sm mt-1">+12.5% from last period</p> */}
                </div>
                <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                  <FileText className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Average Order Value</p>
                  <h3 className="text-2xl font-bold text-text-dark mt-1">AED {average}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Total Customers</p>
                  <h3 className="text-2xl font-bold text-text-dark mt-1">{totalUsers}</h3>
                </div>
                <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                  <PieChartIcon className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="drivers">Drivers</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    {timeRange === "daily" && "Daily revenue for the current week"}
                    {timeRange === "monthly" && "Monthly revenue for the current year"}
                    {timeRange === "yearly" && "Yearly revenue for the past 5 years"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart timeRange={timeRange} />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Revenue by Service</CardTitle>
                  <CardDescription>Breakdown of revenue by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart timeRange={timeRange} />
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Revenue Details</CardTitle>
                <CardDescription>Detailed breakdown of revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-lg font-medium mb-4">Revenue by Service Type</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {serviceRevenue.map((service) => (
                        <Card key={service.name} className="border-none shadow-none">
                          <CardContent className="p-4">
                            <p className="text-text-muted text-sm">{service.name}</p>
                            <h4 className="text-xl font-bold text-text-dark mt-1">AED {service.amount.toFixed(2)}</h4>
                            <div className="mt-2">
                              <div className="h-2 w-full bg-bg-light rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-brand-primary rounded-full"
                                  style={{ width: `${service.percentage}%` }}
                                />
                              </div>
                              <p className="text-xs text-text-muted mt-1">{service.percentage}% of total</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-4">Revenue by Region</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="border-b border-line-light">
                            <th className="text-left py-3 px-4 font-medium text-text-dark">Region</th>
                            <th className="text-left py-3 px-4 font-medium text-text-dark">Revenue</th>
                            <th className="text-left py-3 px-4 font-medium text-text-dark">% of Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {revenueData.map((row, index) => (
                            <tr key={index} className="border-b border-line-light">
                              <td className="py-3 px-4">{row.region}</td>
                              <td className="py-3 px-4 font-medium">AED {row.revenue.toFixed(2)}</td>
                              <td className="py-3 px-4">{row.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Analytics</CardTitle>
                <CardDescription>Detailed analysis of order patterns and trends</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <div className="h-[400px] flex items-center justify-center border border-dashed border-line-medium rounded-md">
                  <p className="text-text-muted">Order analytics content coming soon</p>
                </div> */}
                <div className="h-[300px] w-full relative">
                  <OrderLineChart timeRange={timeRange} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Analytics</CardTitle>
                  <CardDescription>Detailed analysis of order patterns and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <DriverLineChart timeRange={timeRange} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Drivers by Region</CardTitle>
                  <CardDescription>Pie chart of drivers per region</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <DriverPieChart />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
