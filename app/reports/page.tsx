
"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart } from "@/components/charts"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Download, Calendar, BarChart3, PieChart, TrendingUp, FileText } from 'lucide-react'

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("monthly")
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Reports & Analytics</h1>
            <p className="text-text-muted mt-2">View detailed reports and analytics for your business</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
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
                  <h3 className="text-2xl font-bold text-text-dark mt-1">AED 24,389</h3>
                  <p className="text-status-success text-sm mt-1">+18.3% from last period</p>
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
                  <h3 className="text-2xl font-bold text-text-dark mt-1">1,284</h3>
                  <p className="text-status-success text-sm mt-1">+12.5% from last period</p>
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
                  <h3 className="text-2xl font-bold text-text-dark mt-1">AED 19.85</h3>
                  <p className="text-status-success text-sm mt-1">+5.2% from last period</p>
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
                  <p className="text-text-muted text-sm">Active Customers</p>
                  <h3 className="text-2xl font-bold text-text-dark mt-1">843</h3>
                  <p className="text-status-success text-sm mt-1">+8.2% from last period</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-brand-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    {timeRange === "daily" && "Daily revenue for the current week"}
                    {timeRange === "weekly" && "Weekly revenue for the current month"}
                    {timeRange === "monthly" && "Monthly revenue for the current year"}
                    {timeRange === "yearly" && "Yearly revenue for the past 5 years"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LineChart />
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Revenue by Service</CardTitle>
                  <CardDescription>Breakdown of revenue by service type</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart />
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
                      {[
                        { name: "Wash", amount: 10245.50, percentage: 42 },
                        { name: "Wash & Iron", amount: 7890.25, percentage: 32 },
                        { name: "Iron", amount: 3560.75, percentage: 15 },
                        { name: "Dry Wash", amount: 1480.50, percentage: 6 }
                      ].map((service) => (
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
                    <h4 className="text-lg font-medium mb-4">Revenue by Time Period</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="border-b border-line-light">
                            <th className="text-left py-3 px-4 font-medium text-text-dark">Period</th>
                            <th className="text-left py-3 px-4 font-medium text-text-dark">Revenue</th>
                            <th className="text-left py-3 px-4 font-medium text-text-dark">Orders</th>
                            <th className="text-left py-3 px-4 font-medium text-text-dark">Avg. Order Value</th>
                            <th className="text-left py-3 px-4 font-medium text-text-dark">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { period: "April 2023", revenue: 24389.00, orders: 1284, avg: 19.85, change: "+18.3%" },
                            { period: "March 2023", revenue: 20615.75, orders: 1156, avg: 17.83, change: "+12.1%" },
                            { period: "February 2023", revenue: 18390.50, orders: 1042, avg: 17.65, change: "+8.5%" },
                            { period: "January 2023", revenue: 16950.25, orders: 978, avg: 17.33, change: "+5.2%" },
                            { period: "December 2022", revenue: 16112.00, orders: 945, avg: 17.05, change: "-" },
                          ].map((row, index) => (
                            <tr key={index} className="border-b border-line-light">
                              <td className="py-3 px-4">{row.period}</td>
                              <td className="py-3 px-4 font-medium">AED {row.revenue.toFixed(2)}</td>
                              <td className="py-3 px-4">{row.orders}</td>
                              <td className="py-3 px-4">AED {row.avg.toFixed(2)}</td>
                              <td className={`py-3 px-4 ${row.change !== "-" ? "text-status-success" : ""}`}>{row.change}</td>
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
                <div className="h-[400px] flex items-center justify-center border border-dashed border-line-medium rounded-md">
                  <p className="text-text-muted">Order analytics content coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Service Analytics</CardTitle>
                <CardDescription>Detailed analysis of service performance and popularity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border border-dashed border-line-medium rounded-md">
                  <p className="text-text-muted">Service analytics content coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
                <CardDescription>Detailed analysis of customer behavior and demographics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border border-dashed border-line-medium rounded-md">
                  <p className="text-text-muted">Customer analytics content coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
