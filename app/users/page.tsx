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
import { Switch } from "@/components/ui/switch"
import {
  MoreVertical,
  Search,
  User,
  ShoppingBag,
  MessageSquare,
  Ban,
  Mail,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react"

// Sample user data
const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    joinDate: "2023-01-15",
    totalOrders: 12,
    totalSpent: 349.88,
    address: "123 Main St, Apt 4B, New York, NY 10001",
    complaints: [],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    joinDate: "2023-02-22",
    totalOrders: 8,
    totalSpent: 245.92,
    address: "456 Park Ave, Suite 7C, New York, NY 10022",
    complaints: [{ id: 1, date: "2023-03-15", message: "Clothes were not properly ironed", status: "resolved" }],
  },
  {
    id: 3,
    name: "Robert Brown",
    email: "robert.brown@example.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    joinDate: "2023-03-10",
    totalOrders: 5,
    totalSpent: 189.95,
    address: "789 Broadway, Apt 12D, New York, NY 10003",
    complaints: [],
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 789-0123",
    status: "inactive",
    joinDate: "2023-02-05",
    totalOrders: 3,
    totalSpent: 104.97,
    address: "321 5th Ave, Apt 15F, New York, NY 10016",
    complaints: [{ id: 2, date: "2023-02-28", message: "Order was delivered late", status: "pending" }],
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "+1 (555) 234-5678",
    status: "inactive",
    joinDate: "2023-01-30",
    totalOrders: 1,
    totalSpent: 34.99,
    address: "654 Madison Ave, Apt 8B, New York, NY 10021",
    complaints: [],
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isOrderHistoryDialogOpen, setIsOrderHistoryDialogOpen] = useState(false)
  const [isComplaintsDialogOpen, setIsComplaintsDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  )

  const handleToggleStatus = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user,
      ),
    )
  }

  const handleResolveComplaint = (userId: number, complaintId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              complaints: user.complaints.map((complaint: any) =>
                complaint.id === complaintId ? { ...complaint, status: "resolved" } : complaint,
              ),
            }
          : user,
      ),
    )
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge variant="outline" className="bg-chart-green/20 text-status-success border-status-success">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-status-danger/20 text-status-danger border-status-danger">
        Inactive
      </Badge>
    )
  }

  // Sample order history for the selected user
  const sampleOrders = [
    { id: "ORD-10045", date: "2023-04-05", service: "Wash & Fold", amount: 24.99, status: "delivered" },
    { id: "ORD-10032", date: "2023-03-22", service: "Dry Cleaning", amount: 39.99, status: "delivered" },
    { id: "ORD-10018", date: "2023-03-10", service: "Ironing", amount: 19.99, status: "delivered" },
    { id: "ORD-10005", date: "2023-02-28", service: "Express Service", amount: 34.99, status: "delivered" },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Users</h1>
            <p className="text-text-muted mt-2">Manage your customers</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              placeholder="Search users..."
              className="pl-10 w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          {["all", "active", "inactive"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{tab === "all" ? "All Users" : `${tab} Users`}</CardTitle>
                  <CardDescription>
                    {tab === "all" ? "View and manage all your customers" : `View and manage ${tab} customers`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Total Orders</TableHead>
                        <TableHead>Total Spent</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers
                        .filter((user) => tab === "all" || user.status === tab)
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell>{user.totalOrders}</TableCell>
                            <TableCell>${user.totalSpent.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={user.status === "active"}
                                  onCheckedChange={() => handleToggleStatus(user.id)}
                                />
                                {getStatusBadge(user.status)}
                              </div>
                            </TableCell>
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
                                      setCurrentUser(user)
                                      setIsViewDialogOpen(true)
                                    }}
                                  >
                                    <User className="h-4 w-4 mr-2" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setCurrentUser(user)
                                      setIsOrderHistoryDialogOpen(true)
                                    }}
                                  >
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Order History
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setCurrentUser(user)
                                      setIsComplaintsDialogOpen(true)
                                    }}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    {user.complaints.some((c: any) => c.status === "pending")
                                      ? "Complaints (New)"
                                      : "Complaints"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className={user.status === "active" ? "text-status-danger" : "text-status-success"}
                                    onClick={() => handleToggleStatus(user.id)}
                                  >
                                    <Ban className="h-4 w-4 mr-2" />
                                    {user.status === "active" ? "Deactivate User" : "Activate User"}
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

        {/* View User Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>View complete information about this user</DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{currentUser.name}</h3>
                  {getStatusBadge(currentUser.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-brand-primary mt-0.5" />
                    <p>{currentUser.email}</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-brand-primary mt-0.5" />
                    <p>{currentUser.phone}</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-brand-primary mt-0.5" />
                    <p className="text-sm">{currentUser.address}</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Joined on</p>
                      <p className="text-sm text-text-muted">{currentUser.joinDate}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-line-light">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-text-muted">Total Orders</p>
                      <p className="font-semibold text-lg">{currentUser.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Total Spent</p>
                      <p className="font-semibold text-lg">${currentUser.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Order History Dialog */}
        <Dialog open={isOrderHistoryDialogOpen} onOpenChange={setIsOrderHistoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order History</DialogTitle>
              <DialogDescription>View all orders placed by this user</DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="space-y-4 py-2">
                <div className="mb-4">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-text-muted">{currentUser.email}</p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{order.service}</TableCell>
                        <TableCell>${order.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-chart-green/20 text-status-success border-status-success capitalize"
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsOrderHistoryDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Complaints Dialog */}
        <Dialog open={isComplaintsDialogOpen} onOpenChange={setIsComplaintsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Complaints</DialogTitle>
              <DialogDescription>View and resolve complaints from this user</DialogDescription>
            </DialogHeader>
            {currentUser && (
              <div className="space-y-4 py-2">
                <div className="mb-4">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-text-muted">{currentUser.email}</p>
                </div>

                {currentUser.complaints.length > 0 ? (
                  <div className="space-y-4">
                    {currentUser.complaints.map((complaint: any) => (
                      <Card key={complaint.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm text-text-muted">{complaint.date}</p>
                            <Badge
                              variant="outline"
                              className={
                                complaint.status === "resolved"
                                  ? "bg-chart-green/20 text-status-success border-status-success"
                                  : "bg-chart-yellow/20 text-chart-yellow border-chart-yellow"
                              }
                            >
                              {complaint.status}
                            </Badge>
                          </div>
                          <p className="mb-4">{complaint.message}</p>
                          {complaint.status === "pending" && (
                            <Button size="sm" onClick={() => handleResolveComplaint(currentUser.id, complaint.id)}>
                              Mark as Resolved
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-text-muted">No complaints from this user</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsComplaintsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
