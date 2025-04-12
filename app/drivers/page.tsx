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
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { MoreVertical, Plus, Edit, MapPin, Truck, User, Phone, Mail, Calendar, Clock } from "lucide-react"

// Sample driver data
const initialDrivers = [
  {
    id: 1,
    name: "David Miller",
    email: "david.miller@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    serviceArea: "Manhattan - Upper East Side",
    joinDate: "2022-06-15",
    completedOrders: 128,
    rating: 4.8,
    availability: "full-time",
    vehicleType: "Car",
    vehicleNumber: "NY-12345",
  },
  {
    id: 2,
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    serviceArea: "Manhattan - Midtown",
    joinDate: "2022-08-22",
    completedOrders: 95,
    rating: 4.7,
    availability: "part-time",
    vehicleType: "Scooter",
    vehicleNumber: "NY-67890",
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    serviceArea: "Brooklyn - Williamsburg",
    joinDate: "2022-09-10",
    completedOrders: 72,
    rating: 4.5,
    availability: "full-time",
    vehicleType: "Car",
    vehicleNumber: "NY-54321",
  },
  {
    id: 4,
    name: "Jessica Thompson",
    email: "jessica.thompson@example.com",
    phone: "+1 (555) 789-0123",
    status: "inactive",
    serviceArea: "Queens - Astoria",
    joinDate: "2022-11-05",
    completedOrders: 45,
    rating: 4.3,
    availability: "part-time",
    vehicleType: "Scooter",
    vehicleNumber: "NY-13579",
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    phone: "+1 (555) 234-5678",
    status: "inactive",
    serviceArea: "Bronx - Riverdale",
    joinDate: "2023-01-20",
    completedOrders: 18,
    rating: 4.2,
    availability: "weekends",
    vehicleType: "Car",
    vehicleNumber: "NY-24680",
  },
]

export default function DriversPage() {
  const [drivers, setDrivers] = useState(initialDrivers)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isAssignAreaDialogOpen, setIsAssignAreaDialogOpen] = useState(false)
  const [currentDriver, setCurrentDriver] = useState<any>(null)
  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active",
    serviceArea: "",
    availability: "full-time",
    vehicleType: "Car",
    vehicleNumber: "",
  })

  const handleAddDriver = () => {
    const id = Math.max(...drivers.map((d) => d.id)) + 1
    const joinDate = new Date().toISOString().split("T")[0]
    setDrivers([
      ...drivers,
      {
        ...newDriver,
        id,
        joinDate,
        completedOrders: 0,
        rating: 0,
      },
    ])
    setNewDriver({
      name: "",
      email: "",
      phone: "",
      status: "active",
      serviceArea: "",
      availability: "full-time",
      vehicleType: "Car",
      vehicleNumber: "",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditDriver = () => {
    setDrivers(drivers.map((driver) => (driver.id === currentDriver.id ? currentDriver : driver)))
    setIsEditDialogOpen(false)
  }

  const handleAssignArea = () => {
    setDrivers(drivers.map((driver) => (driver.id === currentDriver.id ? currentDriver : driver)))
    setIsAssignAreaDialogOpen(false)
  }

  const handleToggleStatus = (id: number) => {
    setDrivers(
      drivers.map((driver) =>
        driver.id === id
          ? {
              ...driver,
              status: driver.status === "active" ? "inactive" : "active",
            }
          : driver,
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Drivers</h1>
            <p className="text-text-muted mt-2">Manage your delivery drivers</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-primary hover:bg-brand-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add New Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>Register a new driver for your laundry service</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newDriver.name}
                      onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newDriver.email}
                      onChange={(e) => setNewDriver({ ...newDriver, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newDriver.phone}
                      onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceArea">Service Area</Label>
                    <Input
                      id="serviceArea"
                      value={newDriver.serviceArea}
                      onChange={(e) => setNewDriver({ ...newDriver, serviceArea: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <select
                      id="availability"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newDriver.availability}
                      onChange={(e) => setNewDriver({ ...newDriver, availability: e.target.value })}
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="weekends">Weekends Only</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <select
                      id="vehicleType"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newDriver.vehicleType}
                      onChange={(e) => setNewDriver({ ...newDriver, vehicleType: e.target.value })}
                    >
                      <option value="Car">Car</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Bike">Bike</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                  <Input
                    id="vehicleNumber"
                    value={newDriver.vehicleNumber}
                    onChange={(e) => setNewDriver({ ...newDriver, vehicleNumber: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newDriver.status === "active"}
                    onCheckedChange={(checked) =>
                      setNewDriver({ ...newDriver, status: checked ? "active" : "inactive" })
                    }
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDriver}>Add Driver</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Drivers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          {["all", "active", "inactive"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{tab === "all" ? "All Drivers" : `${tab} Drivers`}</CardTitle>
                  <CardDescription>
                    {tab === "all" ? "View and manage all your drivers" : `View and manage ${tab} drivers`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Service Area</TableHead>
                        <TableHead>Completed Orders</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {drivers
                        .filter((driver) => tab === "all" || driver.status === tab)
                        .map((driver) => (
                          <TableRow key={driver.id}>
                            <TableCell className="font-medium">{driver.name}</TableCell>
                            <TableCell>{driver.phone}</TableCell>
                            <TableCell>{driver.serviceArea}</TableCell>
                            <TableCell>{driver.completedOrders}</TableCell>
                            <TableCell>{driver.rating > 0 ? driver.rating.toFixed(1) : "N/A"}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={driver.status === "active"}
                                  onCheckedChange={() => handleToggleStatus(driver.id)}
                                />
                                {getStatusBadge(driver.status)}
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
                                      setCurrentDriver(driver)
                                      setIsViewDialogOpen(true)
                                    }}
                                  >
                                    <User className="h-4 w-4 mr-2" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setCurrentDriver(driver)
                                      setIsEditDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Driver
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setCurrentDriver(driver)
                                      setIsAssignAreaDialogOpen(true)
                                    }}
                                  >
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Assign Service Area
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

        {/* View Driver Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Driver Profile</DialogTitle>
              <DialogDescription>View complete information about this driver</DialogDescription>
            </DialogHeader>
            {currentDriver && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-lg">{currentDriver.name}</h3>
                  {getStatusBadge(currentDriver.status)}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-brand-primary mt-0.5" />
                    <p>{currentDriver.email}</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-brand-primary mt-0.5" />
                    <p>{currentDriver.phone}</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-brand-primary mt-0.5" />
                    <p>{currentDriver.serviceArea}</p>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Joined on</p>
                      <p className="text-sm text-text-muted">{currentDriver.joinDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Availability</p>
                      <p className="text-sm text-text-muted capitalize">{currentDriver.availability}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Truck className="h-5 w-5 text-brand-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{currentDriver.vehicleType}</p>
                      <p className="text-sm text-text-muted">{currentDriver.vehicleNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-line-light">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-text-muted">Completed Orders</p>
                      <p className="font-semibold text-lg">{currentDriver.completedOrders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-text-muted">Rating</p>
                      <p className="font-semibold text-lg">
                        {currentDriver.rating > 0 ? currentDriver.rating.toFixed(1) : "N/A"}
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

        {/* Edit Driver Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Driver</DialogTitle>
              <DialogDescription>Update the details of this driver</DialogDescription>
            </DialogHeader>
            {currentDriver && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={currentDriver.name}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={currentDriver.email}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={currentDriver.phone}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-availability">Availability</Label>
                    <select
                      id="edit-availability"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={currentDriver.availability}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, availability: e.target.value })}
                    >
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="weekends">Weekends Only</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-vehicleType">Vehicle Type</Label>
                    <select
                      id="edit-vehicleType"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={currentDriver.vehicleType}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, vehicleType: e.target.value })}
                    >
                      <option value="Car">Car</option>
                      <option value="Scooter">Scooter</option>
                      <option value="Bike">Bike</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-vehicleNumber">Vehicle Number</Label>
                    <Input
                      id="edit-vehicleNumber"
                      value={currentDriver.vehicleNumber}
                      onChange={(e) => setCurrentDriver({ ...currentDriver, vehicleNumber: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-active"
                    checked={currentDriver.status === "active"}
                    onCheckedChange={(checked) =>
                      setCurrentDriver({ ...currentDriver, status: checked ? "active" : "inactive" })
                    }
                  />
                  <Label htmlFor="edit-active">Active</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditDriver}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Service Area Dialog */}
        <Dialog open={isAssignAreaDialogOpen} onOpenChange={setIsAssignAreaDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Service Area</DialogTitle>
              <DialogDescription>Update the service area for this driver</DialogDescription>
            </DialogHeader>
            {currentDriver && (
              <div className="space-y-4 py-4">
                <div className="mb-4">
                  <p className="font-medium">{currentDriver.name}</p>
                  <p className="text-text-muted">{currentDriver.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceArea">Service Area</Label>
                  <Input
                    id="serviceArea"
                    value={currentDriver.serviceArea}
                    onChange={(e) => setCurrentDriver({ ...currentDriver, serviceArea: e.target.value })}
                    placeholder="e.g., Manhattan - Upper East Side"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Suggested Areas</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Manhattan - Upper East Side",
                      "Manhattan - Midtown",
                      "Brooklyn - Williamsburg",
                      "Queens - Astoria",
                      "Bronx - Riverdale",
                    ].map((area) => (
                      <Button
                        key={area}
                        variant="outline"
                        className="justify-start"
                        onClick={() => setCurrentDriver({ ...currentDriver, serviceArea: area })}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        {area}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignAreaDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignArea}>Save Area</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
