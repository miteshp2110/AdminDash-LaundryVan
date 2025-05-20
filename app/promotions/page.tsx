"use client"

import React, {useEffect} from "react"

import { useState, useRef } from "react"
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
import { MoreVertical, Plus, Edit, Trash, ImageIcon, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const baseurl = "http://ec2-65-0-21-246.ap-south-1.compute.amazonaws.com/admins"
// const baseurl = "http://localhost:5000"


export default function PromotionsPage() {
  interface Promotion {
    id: number;
    name: string;
    code: string;
    type: string; // assuming these are the only types
    value: number;
    description: string;
    startDate: string; // ISO date string, or use Date if you're parsing it
    endDate: string;
    isActive: boolean;
    minOrderValue: number;
    image: string;
  }
  const [promotions, setPromotions] = useState<Promotion[]>([])
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
    minOrderValue: 0,
    image: "/placeholder.svg?height=350&width=660",
  })

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch(`${baseurl}/admin/promotions`)
        const data = await res.json()
        if (data.success) {
          setPromotions(data.data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }
    fetchPromotions()
  }, []);

  async function updatePromotion(){

    try{
      const formData = new FormData()
      if(currentPromotion.image.split(":")[0] === 'blob'){
        await fetch(currentPromotion.image).then(res=>res.blob()).then((blob)=>{
          formData.append("image",blob,'upload.png')
        })
      }
      formData.append("title", currentPromotion.name)
      formData.append("description",currentPromotion.description)
      if(currentPromotion.type === "percentage"){
        formData.append("discount_percentage", currentPromotion.value)
      }
      else{
        formData.append("fixed_discount",currentPromotion.value)
      }
      formData.append("threshHold", currentPromotion.minOrderValue)
      formData.append("valid_from",currentPromotion.startDate)
      formData.append("valid_to", currentPromotion.endDate)
      formData.append("is_active",currentPromotion.isActive?"1":"0")
      formData.append("coupon_code",currentPromotion.code)
      const res = await fetch(`${baseurl}/admin/promotions/${currentPromotion.id}`, {
        method: 'PUT',
        headers: {

          // Add any auth headers here if needed
        },
        body: formData
      })
      const data = await res.json()
      return !!data.success;

    }catch (e) {
      console.log(e)
      return false
    }
  }

  async function addPromotion(){
    try{
      const formData = new FormData()
      await fetch(newPromotion.image).then(res=>res.blob()).then((blob)=>{
        formData.append("image",blob,'upload.png')
      })
      formData.append("title", newPromotion.name)
      formData.append("description",newPromotion.description)
      if(newPromotion.type === "percentage"){
        formData.append("discount_percentage", newPromotion.value.toString())
      }
      else{
        formData.append("fixed_discount",newPromotion.value.toString())
      }
      formData.append("threshHold", newPromotion.minOrderValue.toString())
      formData.append("valid_from",newPromotion.startDate)
      formData.append("valid_to", newPromotion.endDate)
      formData.append("is_active",newPromotion.isActive?"1":"0")
      formData.append("coupon_code",newPromotion.code)
      const res = await fetch(`${baseurl}/admin/promotions`, {
        method: 'POST',
        // headers: {
        //
        //   // Add any auth headers here if needed
        // },
        body: formData
      })
      const data = await res.json()
      return !!data.success;

    }catch (e) {
      console.log(e)
      return false
    }
  }

  async function deletePromotion(){
    try{

      const res = await fetch(`${baseurl}/admin/promotions/${currentPromotion.id}`, {
        method: 'DELETE',
        // headers: {
        //
        //   // Add any auth headers here if needed
        // },
      })
      const data = await res.json()
      if(!data.success){
        alert(data.message)
      }
      return !!data.success;

    }catch (e) {
      console.log(e)
      return false
    }
  }


  const [imageError, setImageError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const handleAddPromotion = async() => {
    if(newPromotion.image === '/placeholder.svg?height=350&width=660' || !newPromotion.value || ! newPromotion.type || ! newPromotion.minOrderValue
       || ! newPromotion.startDate || ! newPromotion.endDate || !newPromotion.name || !newPromotion.description
    ){
      alert("All Fields are required")
      return
    }
    if(await addPromotion()){
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
        minOrderValue: 0,
        image: "/placeholder.svg?height=350&width=660",
      })
    }
    else{
      alert("Failed to add promotion")
    }
    setIsAddDialogOpen(false)
    setImageError("")
  }

  const handleEditPromotion = async() => {

    if(currentPromotion.image === '/placeholder.svg?height=350&width=660' || !currentPromotion.value || ! currentPromotion.type || ! currentPromotion.minOrderValue
        || ! currentPromotion.startDate || ! currentPromotion.endDate || !currentPromotion.name || !currentPromotion.description
    ){
      alert("All Fields are required")
      return
    }
    if(await updatePromotion()){
      setPromotions(promotions.map((promotion) => (promotion.id === currentPromotion.id ? currentPromotion : promotion)))
    }
    else{
      alert("Failed to update")
    }
    setIsEditDialogOpen(false)
    setImageError("")
  }

  const handleDeletePromotion = async() => {
    if(await deletePromotion()){
      setPromotions(promotions.filter((promotion) => promotion.id !== currentPromotion.id))
    }
    setIsDeleteDialogOpen(false)
  }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      if (img.width > 660 || img.height > 350) {
        setImageError("Image must be less then 660x350 pixels")
        return
      }

      setImageError("")
      const imageUrl = URL.createObjectURL(file)

      if (isEdit) {
        setCurrentPromotion({ ...currentPromotion, image: imageUrl })
      } else {
        setNewPromotion({ ...newPromotion, image: imageUrl })
      }
    }

    img.onerror = () => {
      setImageError("Invalid image file")
    }

    img.src = URL.createObjectURL(file)
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
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Promotion</DialogTitle>
                <DialogDescription>Create a new discount or offer for your customers</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
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
                          onChange={(e) =>
                            setNewPromotion({ ...newPromotion, value: Number.parseFloat(e.target.value) })
                          }
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

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image">Promotion Image (660x350 pixels)</Label>
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="aspect-[2/1] relative bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={newPromotion.image || "/placeholder.svg"}
                            alt="Promotion preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="image"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Upload Image
                        </Button>
                        {imageError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{imageError}</AlertDescription>
                          </Alert>
                        )}
                        <p className="text-xs text-text-muted">
                          Image must be exactly 660x350 pixels. This image will be displayed in the app.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setImageError("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPromotion}
                  disabled={!!imageError}
                  className="bg-brand-primary hover:bg-brand-secondary"
                >
                  Add Promotion
                </Button>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    {promotions
                      .filter(
                        (promotion) => tab === "all" || (tab === "active" ? promotion.isActive : !promotion.isActive),
                      )
                      .map((promotion) => (
                        <Card key={promotion.id} className="overflow-hidden">
                          <div className="relative">
                            <img
                              src={promotion.image || "/placeholder.svg"}
                              alt={promotion.name}
                              className="w-full h-[155px] object-cover"
                            />
                            <Badge
                              className={`absolute top-2 right-2 ${
                                promotion.isActive ? "bg-status-success text-white" : "bg-status-danger text-white"
                              }`}
                            >
                              {promotion.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-semibold text-lg">{promotion.name}</h3>
                                <Badge
                                  variant="outline"
                                  className="bg-bg-accent-light text-brand-primary border-brand-primary mt-1"
                                >
                                  {promotion.code}
                                </Badge>
                              </div>
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
                            </div>
                            <p className="text-sm text-text-muted mb-3">{promotion.description}</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-text-muted">Discount:</p>
                                <p className="font-medium">
                                  {promotion.type === "percentage"
                                    ? `${promotion.value}%`
                                    : `AED ${promotion.value.toFixed(2)}`}
                                </p>
                              </div>
                              <div>
                                <p className="text-text-muted">Valid until:</p>
                                <p className="font-medium">{promotion.endDate}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Validity</TableHead>
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
                            <TableCell>
                              <div className="w-16 h-8 rounded overflow-hidden">
                                <img
                                  src={promotion.image || "/placeholder.svg"}
                                  alt={promotion.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TableCell>
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
                              <div className="flex items-center space-x-2">
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Promotion</DialogTitle>
              <DialogDescription>Update the details of this promotion</DialogDescription>
            </DialogHeader>
            {currentPromotion && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
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
                          onChange={(e) =>
                            setCurrentPromotion({ ...currentPromotion, code: e.target.value.toUpperCase() })
                          }
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
                        <Label htmlFor="edit-minOrderValue">Minimum Order Value (AED)</Label>
                        <Input
                          id="edit-minOrderValue"
                          type="number"
                          value={currentPromotion.minOrderValue}
                          onChange={(e) =>
                            setCurrentPromotion({
                              ...currentPromotion,
                              minOrderValue: Number.parseFloat(e.target.value),
                            })
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

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-image">Promotion Image (660x350 pixels)</Label>
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="aspect-[2/1] relative bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={currentPromotion.image || "/placeholder.svg"}
                            alt="Promotion preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          ref={editFileInputRef}
                          type="file"
                          id="edit-image"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, true)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => editFileInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Update Image
                        </Button>
                        {imageError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{imageError}</AlertDescription>
                          </Alert>
                        )}
                        <p className="text-xs text-text-muted">
                          Image must be exactly 660x350 pixels. This image will be displayed in the app.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setImageError("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditPromotion}
                disabled={!!imageError}
                className="bg-brand-primary hover:bg-brand-secondary"
              >
                Save Changes
              </Button>
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
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-8 rounded overflow-hidden">
                    <img
                      src={currentPromotion.image || "/placeholder.svg"}
                      alt={currentPromotion.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{currentPromotion.name}</p>
                    <p className="text-text-muted">Code: {currentPromotion.code}</p>
                    <p className="text-text-muted">
                      {currentPromotion.type === "percentage"
                        ? `${currentPromotion.value}% off`
                        : `AED ${currentPromotion.value.toFixed(2)} off`}
                    </p>
                  </div>
                </div>
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
