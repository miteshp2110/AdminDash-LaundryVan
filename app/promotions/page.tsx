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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { MoreVertical, Plus, Edit, Trash } from "lucide-react"

// Sample promotion data
const initialPromotions = [
  {
    id: 1,
    name: "Welcome Discount",
    code: "WELCOME20",
    type: "percentage",
    value: 20,
    description: "20% off your first order",
    startDate: "2023-04-01",
    endDate: "2023-06-30",
    isActive: true,
    usageLimit: 1,
    usageCount: 45,
    minOrderValue: 0,
  },
  {
    id: 2,
    name: "Summer Special",
    code: "SUMMER15",
    type: "percentage",
    value: 15,
    description: "15% off all summer services",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    isActive: true,
    usageLimit: 0,
    usageCount: 28,
    minOrderValue: 0,
  },
  {
    id: 3,
    name: "Free Delivery",
    code: "FREEDEL",
    type: "fixed",
    value: 5,
    description: "Free delivery on all orders",
    startDate: "2023-04-15",
    endDate: "2023-05-15",
    isActive: false,
    usageLimit: 0,
    usageCount: 67,
    minOrderValue: 25,
  },
  {
    id: 4,
    name: "Weekend Special",
    code: "WEEKEND10",
    type: "percentage",
    value: 10,
    description: "10% off on weekend orders",
    startDate: "2023-04-01",
    endDate: "2023-12-31",
    isActive: true,
    usageLimit: 0,
    usageCount: 32,
    minOrderValue: 0,
  },
  {
    id: 5,
    name: "Bulk Order Discount",
    code: "BULK25",
    type: "percentage",
    value: 25,
    description: "25% off on orders above AED 100",
    startDate: "2023-03-01",
    endDate: "2023-12-31",
    isActive: true,
    usageLimit: 0,
    usageCount: 15,
    minOrderValue: 100,
  },
]

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState(initialPromotions)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPromotion, setCurrentPromotion] = useState<any>(null)
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    code: "",
    type: "percentage",
    value: 0,
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    isActive: true,
    usageLimit: 0,
    usageCount: 0,
    minOrderValue: 0,
  })

  const handleAddPromotion = () => {
    const id = Math.max(...promotions.map((p) => p.id)) + 1
    setPromotions([...promotions, { ...newPromotion, id }])
    setNewPromotion({
      name: "",
      code: "",
      type: "percentage",
      value: 0,
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isActive: true,
      usageLimit: 0,
      usageCount: 0,
      minOrderValue: 0,
    })
    setIsAddDialogOpen(false)
  }

  const handleEditPromotion = () => {
    setPromotions(promotions.map((promotion) => (promotion.id === currentPromotion.id ? currentPromotion : promotion)))
    setIsEditDialogOpen(false)
  }

  const handleDeletePromotion = () => {
    setPromotions(promotions.filter((promotion) => promotion.id !== currentPromotion.id))
    setIsDeleteDialogOpen(false)
  }

  const handleToggleActive = (id: number) => {
    setPromotions(
      promotions.map((promotion) =>
        promotion.id === id ? { ...promotion, isActive: !promotion.isActive } : promotion,
      ),
    )
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
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
            <h1 className="text-3xl font-bold text-text-dark">Promotions</h1>
            <p className="text-text-muted mt-2">Manage your discounts and offers</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-primary hover:bg-brand-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add New Promotion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Promotion</DialogTitle>
                <DialogDescription>Create a new discount or offer for your customers</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Promotion Name</Label>
                    <Input
                      id="name"
                      value={newPromotion.name}
                      onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">Promo Code</Label>
                    <Input
                      id="code"
                      value={newPromotion.code}
                      onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Discount Type</Label>
                    <select
                      id="type"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newPromotion.type}
                      onChange={(e) => setNewPromotion({ ...newPromotion, type: e.target.value })}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (AED)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="value">Discount Value</Label>
                    <Input
                      id="value"
                      type="number"
                      value={newPromotion.value}
                      onChange={(e) => setNewPromotion({ ...newPromotion, value: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newPromotion.startDate}
                      onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newPromotion.endDate}
                      onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="usageLimit">Usage Limit (0 for unlimited)</Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      value={newPromotion.usageLimit}
                      onChange={(e) =>
                        setNewPromotion({ ...newPromotion, usageLimit: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minOrderValue">Minimum Order Value (AED)</Label>
                    <Input
                      id="minOrderValue"
                      type="number"
                      value={newPromotion.minOrderValue}
                      onChange={(e) =>
                        setNewPromotion({ ...newPromotion, minOrderValue: Number.parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newPromotion.isActive}
                    onCheckedChange={(checked) => setNewPromotion({ ...newPromotion, isActive: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPromotion}>Add Promotion</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Promotions</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          {["all", "active", "inactive"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{tab === "all" ? "All Promotions" : `${tab} Promotions`}</CardTitle>
                  <CardDescription>
                    {tab === "all"
                      ? "View and manage all your promotions and discounts"
                      : `View and manage ${tab} promotions and discounts`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Validity</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {promotions
                        .filter(
                          (promotion) => tab === "all" || (tab === "active" ? promotion.isActive : !promotion.isActive),
                        )
                        .map((promotion) => (
                          <TableRow key={promotion.id}>
                            <TableCell className="font-medium">{promotion.name}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-bg-accent-light text-brand-primary border-brand-primary"
                              >
                                {promotion.code}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {promotion.type === "percentage"
                                ? `${promotion.value}%`
                                : `AED ${promotion.value.toFixed(2)}`}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{promotion.startDate}</div>
                                <div className="text-text-muted">to {promotion.endDate}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {promotion.usageCount}
                              {promotion.usageLimit > 0 && ` / ${promotion.usageLimit}`}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={promotion.isActive}
                                  onCheckedChange={() => handleToggleActive(promotion.id)}
                                />
                                {getStatusBadge(promotion.isActive)}
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
                                      setCurrentPromotion(promotion)
                                      setIsEditDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-status-danger"
                                    onClick={() => {
                                      setCurrentPromotion(promotion)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
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

        {/* Edit Promotion Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Promotion</DialogTitle>
              <DialogDescription>Update the details of this promotion</DialogDescription>
            </DialogHeader>
            {currentPromotion && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Promotion Name</Label>
                    <Input
                      id="edit-name"
                      value={currentPromotion.name}
                      onChange={(e) => setCurrentPromotion({ ...currentPromotion, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-code">Promo Code</Label>
                    <Input
                      id="edit-code"
                      value={currentPromotion.code}
                      onChange={(e) => setCurrentPromotion({ ...currentPromotion, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Discount Type</Label>
                    <select
                      id="edit-type"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={currentPromotion.type}
                      onChange={(e) => setCurrentPromotion({ ...currentPromotion, type: e.target.value })}
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (AED)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-value">Discount Value</Label>
                    <Input
                      id="edit-value"
                      type="number"
                      value={currentPromotion.value}
                      onChange={(e) =>
                        setCurrentPromotion({ ...currentPromotion, value: Number.parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={currentPromotion.description}
                    onChange={(e) => setCurrentPromotion({ ...currentPromotion, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={currentPromotion.startDate}
                      onChange={(e) => setCurrentPromotion({ ...currentPromotion, startDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={currentPromotion.endDate}
                      onChange={(e) => setCurrentPromotion({ ...currentPromotion, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-usageLimit">Usage Limit (0 for unlimited)</Label>
                    <Input
                      id="edit-usageLimit"
                      type="number"
                      value={currentPromotion.usageLimit}
                      onChange={(e) =>
                        setCurrentPromotion({ ...currentPromotion, usageLimit: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-minOrderValue">Minimum Order Value (AED)</Label>
                    <Input
                      id="edit-minOrderValue"
                      type="number"
                      value={currentPromotion.minOrderValue}
                      onChange={(e) =>
                        setCurrentPromotion({ ...currentPromotion, minOrderValue: Number.parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-active"
                    checked={currentPromotion.isActive}
                    onCheckedChange={(checked) => setCurrentPromotion({ ...currentPromotion, isActive: checked })}
                  />
                  <Label htmlFor="edit-active">Active</Label>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditPromotion}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Promotion Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Promotion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this promotion? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {currentPromotion && (
              <div className="py-4">
                <p className="font-medium">{currentPromotion.name}</p>
                <p className="text-text-muted">Code: {currentPromotion.code}</p>
                <p className="text-text-muted">
                  {currentPromotion.type === "percentage"
                    ? `${currentPromotion.value}% off`
                    : `AED ${currentPromotion.value.toFixed(2)} off`}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePromotion}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
