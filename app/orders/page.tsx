"use client"

import {useEffect, useState} from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreVertical, Eye, Edit, XCircle, Truck, Search, Calendar, MapPin, Package, User } from "lucide-react"
import {Property} from "csstype";
import Order = Property.Order;


export default function OrdersPage() {
  interface OrderItem {
    name: string
    quantity: number
  }

  interface Order {
    id: string
    customer: string
    service: string
    amount: number
    status: string
    date: string
    time: string
    address: string
    phone: string
    driver: string
    items: OrderItem[]
  }
  // const initialOrders : [Order]   = [
  //   {
  //     "id": "ORD-00010",
  //     "customer": "Mitesh Paliwal",
  //     "service": "Wash & Iron",
  //     "amount": 72,
  //     "status": "delivered",
  //     "date": "2025-04-25",
  //     "time": "10:00 AM",
  //     "address": "12 Mall Area, Opposite To Mall, Jayamahal Road,Begaluru",
  //     "phone": "7000320733",
  //     "driver": "KA 07 AB 1234",
  //     "items": [
  //       {
  //         "name": "Jeans (Wash & Iron)",
  //         "quantity": 1
  //       },
  //       {
  //         "name": "Pants (Iron)",
  //         "quantity": 2
  //       },
  //       {
  //         "name": "Pyjama Top (Wash)",
  //         "quantity": 4
  //       }
  //     ]
  //   }
  // ]
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<any>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/orders/detail")
        const data = await res.json()
        if (data.success) {
          setOrders(data.data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }
    fetchOrders()
  }, []);


  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  )



  const getStatusBadge = (status: string) => {
    // console.log(status)
    switch (status) {
      case "orderplaced":
        return (
          <Badge variant="outline" className="bg-chart-yellow/20 text-chart-yellow border-chart-yellow">
            Placed
          </Badge>
        )
      case "orderpickedup":
        return (
          <Badge variant="outline" className="bg-chart-blue/20 text-chart-teal border-chart-teal">
            Picked Up
          </Badge>
        )
      case "outfordelivery":
        return (
          <Badge variant="outline" className="bg-chart-green/20 text-status-success border-status-success">
            Out For Delivery
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-chart-purple/20 text-chart-purple border-chart-purple">
            Delivered
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Orders</h1>
            <p className="text-text-muted mt-2">Manage customer orders</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Search orders..."
              className="pl-10 w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="orderplaced">Order Placed</TabsTrigger>
            <TabsTrigger value="orderpickedup">Picked Up</TabsTrigger>
            <TabsTrigger value="outfordelivery">Out For Delivery</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
          </TabsList>

          {["all", "orderplaced", "orderpickedup", "outfordelivery", "delivered"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{tab === "all" ? "All Orders" : `${tab} Orders`}</CardTitle>
                  <CardDescription>
                    {tab === "all" ? "View and manage all customer orders" : `View and manage ${tab} orders`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Van Num</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders
                        .filter((order) => tab === "all" || order.status === tab)
                        .map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.id}</TableCell>
                            <TableCell>{order.customer}</TableCell>
                            <TableCell>{order.service}</TableCell>
                            <TableCell>AED {order.amount.toFixed(2)}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>{order.driver || "Not assigned"}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setCurrentOrder(order)
                                      setIsViewDialogOpen(true)
                                    }}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* View Order Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>View complete information about this order</DialogDescription>
            </DialogHeader>
            {currentOrder && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{currentOrder.id}</h3>
                  {getStatusBadge(currentOrder.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{currentOrder.customer}</p>
                      <p className="text-sm text-text-muted">{currentOrder.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Package className="h-5 w-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{currentOrder.service}</p>
                      <p className="text-sm text-text-muted">AED {currentOrder.amount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{currentOrder.date}</p>
                      <p className="text-sm text-text-muted">{currentOrder.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-brand-primary mt-0.5" />
                    <p className="text-sm">{currentOrder.address}</p>
                  </div>

                  {currentOrder.driver && (
                    <div className="flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-brand-primary mt-0.5" />
                      <p className="font-medium">{currentOrder.driver}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-2">Items</h4>
                  <ul className="space-y-1">
                    {currentOrder.items.map((item: any, index: number) => (
                      <li key={index} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>x{item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
