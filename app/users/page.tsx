"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { MoreVertical, Search, User, ShoppingBag, Mail, Phone, Calendar } from "lucide-react"


const baseUrl = 'http://ec2-65-0-21-246.ap-south-1.compute.amazonaws.com/admins'
// Define the user type based on the API response
interface UserType {
  id: number
  fullName: string
  email: string
  phone: string
  createdAt: string
  total_orders: number
  total_spent: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isOrderHistoryDialogOpen, setIsOrderHistoryDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await fetch(`${baseUrl}/admin/users`)
        const data = await res.json()
        if (data.success) {
          setUsers(data.data)
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  )

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

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage all your customers</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4">Loading users...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Total Spent</TableHead>
                    {/*<TableHead className="text-right">Actions</TableHead>*/}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{user.total_orders}</TableCell>
                      <TableCell>AED {Number.parseFloat(user.total_spent.toString()).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        {/*<DropdownMenu>*/}
                        {/*  <DropdownMenuTrigger asChild>*/}
                        {/*    <Button variant="ghost" size="icon">*/}
                        {/*      <MoreVertical className="h-4 w-4" />*/}
                        {/*    </Button>*/}
                        {/*  </DropdownMenuTrigger>*/}
                        {/*  <DropdownMenuContent align="end">*/}
                        {/*    <DropdownMenuItem*/}
                        {/*      onClick={() => {*/}
                        {/*        setCurrentUser(user)*/}
                        {/*        setIsViewDialogOpen(true)*/}
                        {/*      }}*/}
                        {/*    >*/}
                        {/*      <User className="h-4 w-4 mr-2" />*/}
                        {/*      View Profile*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*    <DropdownMenuItem*/}
                        {/*      onClick={() => {*/}
                        {/*        setCurrentUser(user)*/}
                        {/*        setIsOrderHistoryDialogOpen(true)*/}
                        {/*      }}*/}
                        {/*    >*/}
                        {/*      <ShoppingBag className="h-4 w-4 mr-2" />*/}
                        {/*      Order History*/}
                        {/*    </DropdownMenuItem>*/}
                        {/*  </DropdownMenuContent>*/}
                        {/*</DropdownMenu>*/}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

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
                  <h3 className="font-semibold text-lg">{currentUser.fullName}</h3>
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
                    <Calendar className="h-5 w-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Joined on</p>
                      <p className="text-sm text-text-muted">{new Date(currentUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-line-light">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-text-muted">Total Orders</p>
                      <p className="font-semibold text-lg">{currentUser.total_orders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Total Spent</p>
                      <p className="font-semibold text-lg">
                        AED {Number.parseFloat(currentUser.total_spent.toString()).toFixed(2)}
                      </p>
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
                  <p className="font-medium">{currentUser.fullName}</p>
                  <p className="text-text-muted">{currentUser.email}</p>
                </div>
                <div className="text-center py-4">
                  <p>Total Orders: {currentUser.total_orders}</p>
                  <p>Total Spent: AED {Number.parseFloat(currentUser.total_spent.toString()).toFixed(2)}</p>
                  <p className="text-sm text-text-muted mt-2">Detailed order history is not available in this view.</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsOrderHistoryDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
