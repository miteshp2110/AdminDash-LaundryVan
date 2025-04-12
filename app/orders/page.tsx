"use client"

import { useState } from "react"
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

// Sample order data
const initialOrders = [
  {
    id: "ORD-10001",
    customer: "John Doe",
    service: "Wash & Fold",
    amount: 24.99,
    status: "pending",
    date: "2023-04-10",
    time: "10:30 AM",
    address: "123 Main St, Apt 4B, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    items: [
      { name: "T-shirts", quantity: 5 },
      { name: "Pants", quantity: 3 },
      { name: "Bed sheets", quantity: 2 },
    ],
    driver: null,
  },
  {
    id: "ORD-10002",
    customer: "Jane Smith",
    service: "Dry Cleaning",
    amount: 39.99,
    status: "processing",
    date: "2023-04-10",
    time: "11:45 AM",
    address: "456 Park Ave, Suite 7C, New York, NY 10022",
    phone: "+1 (555) 987-6543",
    items: [
      { name: "Suits", quantity: 2 },
      { name: "Dresses", quantity: 1 },
    ],
    driver: "Michael Johnson",
  },
  {
    id: "ORD-10003",
    customer: "Robert Brown",
    service: "Ironing",
    amount: 19.99,
    status: "completed",
    date: "2023-04-09",
    time: "2:15 PM",
    address: "789 Broadway, Apt 12D, New York, NY 10003",
    phone: "+1 (555) 456-7890",
    items: [
      { name: "Shirts", quantity: 8 },
      { name: "Pants", quantity: 4 },
    ],
    driver: "Sarah Williams",
  },
  {
    id: "ORD-10004",
    customer: "Emily Davis",
    service: "Express Service",
    amount: 34.99,
    status: "delivered",
    date: "2023-04-09",
    time: "9:00 AM",
    address: "321 5th Ave, Apt 15F, New York, NY 10016",
    phone: "+1 (555) 789-0123",
    items: [
      { name: "T-shirts", quantity: 3 },
      { name: "Jeans", quantity: 2 },
      { name: "Towels", quantity: 4 },
    ],
    driver: "David Miller",
  },
  {
    id: "ORD-10005",
    customer: "Michael Wilson",
    service: "Stain Removal",
    amount: 14.99,
    status: "cancelled",
    date: "2023-04-08",
    time: "3:30 PM",
    address: "654 Madison Ave, Apt 8B, New York, NY 10021",
    phone: "+1 (555) 234-5678",
    items: [
      { name: "Tablecloth", quantity: 1 },
      { name: "Shirts", quantity: 2 },
    ],
    driver: null,
  },
]

// Sample drivers
const drivers = [
  { id: 1, name: "David Miller", status: "available" },
  { id: 2, name: "Sarah Williams", status: "busy" },
  { id: 3, name: "Michael Johnson", status: "available" },
  { id: 4, name: "Jessica Thompson", status: "available" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isAssignDriverDialogOpen, setIsAssignDriverDialogOpen] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<any>(null)
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null)

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCancelOrder = () => {
    setOrders(orders.map((order) => (order.id === currentOrder.id ? { ...order, status: "cancelled" } : order)))
    setIsCancelDialogOpen(false)
  }

  const handleAssignDriver = () => {
    setOrders(
      orders.map((order) =>
        order.id === currentOrder.id ? { ...order, driver: selectedDriver, status: "processing" } : order,
      ),
    )
    setIsAssignDriverDialogOpen(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-chart-yellow/20 text-chart-yellow border-chart-yellow">
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-chart-blue/20 text-chart-teal border-chart-teal">
            Processing
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-chart-green/20 text-status-success border-status-success">
            Completed
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-chart-purple/20 text-chart-purple border-chart-purple">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-status-danger/20 text-status-danger border-status-danger">
            Cancelled
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
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          {["all", "pending", "processing", "completed", "delivered", "cancelled"].map((tab) => (
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
                        <TableHead>Driver</TableHead>
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
                                  {order.status !== "cancelled" && order.status !== "delivered" && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setCurrentOrder(order)
                                        setIsEditDialogOpen(true)
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit Order
                                    </DropdownMenuItem>
                                  )}
                                  {(order.status === "pending" || order.status === "processing") && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setCurrentOrder(order)
                                        setIsCancelDialogOpen(true)
                                      }}
                                      className="text-status-danger"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Order
                                    </DropdownMenuItem>
                                  )}
                                  {order.status === "pending" && (
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setCurrentOrder(order)
                                        setSelectedDriver(null)
                                        setIsAssignDriverDialogOpen(true)
                                      }}
                                    >
                                      <Truck className="h-4 w-4 mr-2" />
                                      Assign Driver
                                    </DropdownMenuItem>
                                  )}
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
                      <p className="text-sm text-text-muted">${currentOrder.amount.toFixed(2)}</p>
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

        {/* Edit Order Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Order</DialogTitle>
              <DialogDescription>Update the details of this order</DialogDescription>
            </DialogHeader>
            {currentOrder && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Pickup Date</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={currentOrder.date}
                      onChange={(e) => setCurrentOrder({ ...currentOrder, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-time">Pickup Time</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={currentOrder.time.split(" ")[0]}
                      onChange={(e) => {
                        const time = e.target.value
                        const hours = Number.parseInt(time.split(":")[0])
                        const minutes = time.split(":")[1]
                        const ampm = hours >= 12 ? "PM" : "AM"
                        const formattedHours = hours % 12 || 12
                        const formattedTime = `${formattedHours}:${minutes} ${ampm}`
                        setCurrentOrder({ ...currentOrder, time: formattedTime })
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input
                    id="edit-address"
                    value={currentOrder.address}
                    onChange={(e) => setCurrentOrder({ ...currentOrder, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={currentOrder.phone}
                    onChange={(e) => setCurrentOrder({ ...currentOrder, phone: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setOrders(orders.map((order) => (order.id === currentOrder.id ? currentOrder : order)))
                  setIsEditDialogOpen(false)
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Cancel Order Dialog */}
        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {currentOrder && (
              <div className="py-4">
                <p className="font-medium">
                  {currentOrder.id} - {currentOrder.customer}
                </p>
                <p className="text-text-muted">
                  {currentOrder.service} - ${currentOrder.amount.toFixed(2)}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                No, Keep Order
              </Button>
              <Button variant="destructive" onClick={handleCancelOrder}>
                Yes, Cancel Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Driver Dialog */}
        <Dialog open={isAssignDriverDialogOpen} onOpenChange={setIsAssignDriverDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Driver</DialogTitle>
              <DialogDescription>Select a driver to assign to this order</DialogDescription>
            </DialogHeader>
            {currentOrder && (
              <div className="space-y-4 py-4">
                <div className="mb-4">
                  <p className="font-medium">
                    {currentOrder.id} - {currentOrder.customer}
                  </p>
                  <p className="text-text-muted">
                    {currentOrder.service} - ${currentOrder.amount.toFixed(2)}
                  </p>
                  <p className="text-text-muted mt-1">{currentOrder.address}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver">Select Driver</Label>
                  <select
                    id="driver"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={selectedDriver || ""}
                    onChange={(e) => setSelectedDriver(e.target.value)}
                  >
                    <option value="">Select a driver</option>
                    {drivers
                      .filter((driver) => driver.status === "available")
                      .map((driver) => (
                        <option key={driver.id} value={driver.name}>
                          {driver.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignDriverDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignDriver} disabled={!selectedDriver}>
                Assign Driver
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
