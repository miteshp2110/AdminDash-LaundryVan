"use client"

import type React from "react"

import { useState, useRef } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MoreVertical, Plus, Edit, Trash, ImageIcon, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Sample hierarchical data
const initialServices = [
  {
    id: 1,
    name: "Wash",
    description: "Regular washing service for all types of clothes",
    isActive: true,
    largeImage: "/placeholder.svg?height=124&width=147",
    smallImage: "/placeholder.svg?height=44&width=110",
    categories: [
      {
        id: 101,
        name: "Tops",
        items: [
          { id: 1001, name: "T-Shirt", price: 5.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 1002, name: "Shirt", price: 7.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 1003, name: "Blouse", price: 8.99, image: "/placeholder.svg?height=33&width=40" },
        ],
      },
      {
        id: 102,
        name: "Bottoms",
        items: [
          { id: 1004, name: "Trousers", price: 9.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 1005, name: "Jeans", price: 10.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 1006, name: "Skirt", price: 8.99, image: "/placeholder.svg?height=33&width=40" },
        ],
      },
      {
        id: 103,
        name: "Formal",
        items: [
          { id: 1007, name: "Suit Jacket", price: 15.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 1008, name: "Dress Shirt", price: 9.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 1009, name: "Tie", price: 4.99, image: "/placeholder.svg?height=33&width=40" },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Dry Clean",
    description: "Professional dry cleaning for delicate fabrics and special garments",
    isActive: true,
    largeImage: "/placeholder.svg?height=124&width=147",
    smallImage: "/placeholder.svg?height=44&width=110",
    categories: [
      {
        id: 201,
        name: "Formal Wear",
        items: [
          { id: 2001, name: "Suit (2 piece)", price: 24.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 2002, name: "Dress", price: 19.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 2003, name: "Blazer", price: 14.99, image: "/placeholder.svg?height=33&width=40" },
        ],
      },
      {
        id: 202,
        name: "Delicates",
        items: [
          { id: 2004, name: "Silk Shirt", price: 12.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 2005, name: "Cashmere Sweater", price: 16.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 2006, name: "Wool Coat", price: 29.99, image: "/placeholder.svg?height=33&width=40" },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Iron & Press",
    description: "Professional ironing and pressing service for wrinkle-free clothes",
    isActive: true,
    largeImage: "/placeholder.svg?height=124&width=147",
    smallImage: "/placeholder.svg?height=44&width=110",
    categories: [
      {
        id: 301,
        name: "Regular Items",
        items: [
          { id: 3001, name: "Shirt", price: 3.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 3002, name: "Trousers", price: 4.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 3003, name: "Dress", price: 6.99, image: "/placeholder.svg?height=33&width=40" },
        ],
      },
      {
        id: 302,
        name: "Formal Items",
        items: [
          { id: 3004, name: "Suit Jacket", price: 7.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 3005, name: "Dress Shirt", price: 4.99, image: "/placeholder.svg?height=33&width=40" },
          { id: 3006, name: "Pleated Skirt", price: 6.99, image: "/placeholder.svg?height=33&width=40" },
        ],
      },
    ],
  },
]

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices)
  const [activeService, setActiveService] = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState<any>(null)
  const [activeItem, setActiveItem] = useState<any>(null)

  // Dialog states
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false)
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false)
  const [isDeleteServiceDialogOpen, setIsDeleteServiceDialogOpen] = useState(false)

  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false)
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false)
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)

  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false)
  const [isDeleteItemDialogOpen, setIsDeleteItemDialogOpen] = useState(false)

  // Image error states
  const [largeImageError, setLargeImageError] = useState("")
  const [smallImageError, setSmallImageError] = useState("")
  const [itemImageError, setItemImageError] = useState("")

  // File input refs
  const largeImageInputRef = useRef<HTMLInputElement>(null)
  const smallImageInputRef = useRef<HTMLInputElement>(null)
  const editLargeImageInputRef = useRef<HTMLInputElement>(null)
  const editSmallImageInputRef = useRef<HTMLInputElement>(null)
  const itemImageInputRef = useRef<HTMLInputElement>(null)
  const editItemImageInputRef = useRef<HTMLInputElement>(null)

  // New item states
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    isActive: true,
    largeImage: "/placeholder.svg?height=124&width=147",
    smallImage: "/placeholder.svg?height=44&width=110",
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
  })

  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
    image: "/placeholder.svg?height=33&width=40",
  })

  // Service handlers
  const handleAddService = () => {
    const id = Math.max(...services.map((s) => s.id), 0) + 1
    setServices([...services, { ...newService, id, categories: [] }])
    setNewService({
      name: "",
      description: "",
      isActive: true,
      largeImage: "/placeholder.svg?height=124&width=147",
      smallImage: "/placeholder.svg?height=44&width=110",
    })
    setIsAddServiceDialogOpen(false)
    setLargeImageError("")
    setSmallImageError("")
  }

  const handleEditService = () => {
    setServices(services.map((service) => (service.id === activeService.id ? activeService : service)))
    setIsEditServiceDialogOpen(false)
    setLargeImageError("")
    setSmallImageError("")
  }

  const handleDeleteService = () => {
    setServices(services.filter((service) => service.id !== activeService.id))
    setIsDeleteServiceDialogOpen(false)
  }

  const handleToggleServiceActive = (id: number) => {
    setServices(services.map((service) => (service.id === id ? { ...service, isActive: !service.isActive } : service)))
  }

  // Category handlers
  const handleAddCategory = () => {
    const categoryId = Math.max(...services.flatMap((s) => s.categories.map((c) => c.id)), 0) + 1
    const updatedServices = services.map((service) => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: [...service.categories, { ...newCategory, id: categoryId, items: [] }],
        }
      }
      return service
    })

    setServices(updatedServices)
    setNewCategory({ name: "" })
    setIsAddCategoryDialogOpen(false)
  }

  const handleEditCategory = () => {
    const updatedServices = services.map((service) => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: service.categories.map((category) =>
            category.id === activeCategory.id ? activeCategory : category,
          ),
        }
      }
      return service
    })

    setServices(updatedServices)
    setIsEditCategoryDialogOpen(false)
  }

  const handleDeleteCategory = () => {
    const updatedServices = services.map((service) => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: service.categories.filter((category) => category.id !== activeCategory.id),
        }
      }
      return service
    })

    setServices(updatedServices)
    setIsDeleteCategoryDialogOpen(false)
  }

  // Item handlers
  const handleAddItem = () => {
    const itemId = Math.max(...services.flatMap((s) => s.categories.flatMap((c) => c.items.map((i) => i.id))), 0) + 1

    const updatedServices = services.map((service) => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: service.categories.map((category) => {
            if (category.id === activeCategory.id) {
              return {
                ...category,
                items: [...category.items, { ...newItem, id: itemId }],
              }
            }
            return category
          }),
        }
      }
      return service
    })

    setServices(updatedServices)
    setNewItem({
      name: "",
      price: 0,
      image: "/placeholder.svg?height=33&width=40",
    })
    setIsAddItemDialogOpen(false)
    setItemImageError("")
  }

  const handleEditItem = () => {
    const updatedServices = services.map((service) => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: service.categories.map((category) => {
            if (category.id === activeCategory.id) {
              return {
                ...category,
                items: category.items.map((item) => (item.id === activeItem.id ? activeItem : item)),
              }
            }
            return category
          }),
        }
      }
      return service
    })

    setServices(updatedServices)
    setIsEditItemDialogOpen(false)
    setItemImageError("")
  }

  const handleDeleteItem = () => {
    const updatedServices = services.map((service) => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: service.categories.map((category) => {
            if (category.id === activeCategory.id) {
              return {
                ...category,
                items: category.items.filter((item) => item.id !== activeItem.id),
              }
            }
            return category
          }),
        }
      }
      return service
    })

    setServices(updatedServices)
    setIsDeleteItemDialogOpen(false)
  }

  // Image handlers
  const handleLargeImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      if (img.width !== 147 || img.height !== 124) {
        setLargeImageError("Large image must be exactly 147x124 pixels")
        return
      }

      setLargeImageError("")
      const imageUrl = URL.createObjectURL(file)

      if (isEdit) {
        setActiveService({ ...activeService, largeImage: imageUrl })
      } else {
        setNewService({ ...newService, largeImage: imageUrl })
      }
    }

    img.onerror = () => {
      setLargeImageError("Invalid image file")
    }

    img.src = URL.createObjectURL(file)
  }

  const handleSmallImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      if (img.width !== 110 || img.height !== 44) {
        setSmallImageError("Small image must be exactly 110x44 pixels")
        return
      }

      setSmallImageError("")
      const imageUrl = URL.createObjectURL(file)

      if (isEdit) {
        setActiveService({ ...activeService, smallImage: imageUrl })
      } else {
        setNewService({ ...newService, smallImage: imageUrl })
      }
    }

    img.onerror = () => {
      setSmallImageError("Invalid image file")
    }

    img.src = URL.createObjectURL(file)
  }

  const handleItemImageChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(img.src)
      if (img.width !== 40 || img.height !== 33) {
        setItemImageError("Item image must be exactly 40x33 pixels")
        return
      }

      setItemImageError("")
      const imageUrl = URL.createObjectURL(file)

      if (isEdit) {
        setActiveItem({ ...activeItem, image: imageUrl })
      } else {
        setNewItem({ ...newItem, image: imageUrl })
      }
    }

    img.onerror = () => {
      setItemImageError("Invalid image file")
    }

    img.src = URL.createObjectURL(file)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#292D34]">Services</h1>
            <p className="text-[#82858A] mt-2">Manage your laundry services, categories, and items</p>
          </div>
          <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-primary hover:bg-brand-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>Create a new service for your customers</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Service Name</Label>
                      <Input
                        id="name"
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={newService.isActive}
                        onCheckedChange={(checked) => setNewService({ ...newService, isActive: checked })}
                      />
                      <Label htmlFor="active">Active</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="largeImage">Large Image (147x124 pixels)</Label>
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="h-[124px] w-[147px] mx-auto relative bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={newService.largeImage || "/placeholder.svg"}
                            alt="Large preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          ref={largeImageInputRef}
                          type="file"
                          id="largeImage"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLargeImageChange(e)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => largeImageInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Upload Large Image
                        </Button>
                        {largeImageError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{largeImageError}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smallImage">Small Image (110x44 pixels)</Label>
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="h-[44px] w-[110px] mx-auto relative bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={newService.smallImage || "/placeholder.svg"}
                            alt="Small preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          ref={smallImageInputRef}
                          type="file"
                          id="smallImage"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSmallImageChange(e)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => smallImageInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Upload Small Image
                        </Button>
                        {smallImageError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{smallImageError}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddServiceDialogOpen(false)
                    setLargeImageError("")
                    setSmallImageError("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddService}
                  disabled={!!largeImageError || !!smallImageError}
                  className="bg-brand-primary hover:bg-brand-secondary"
                >
                  Add Service
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Services</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Services</CardTitle>
                <CardDescription>View and manage all your laundry services, categories, and items</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {services.map((service) => (
                    <AccordionItem key={service.id} value={`service-${service.id}`}>
                      <div className="flex items-center justify-between">
                        <AccordionTrigger className="py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 mr-3 rounded overflow-hidden">
                              <img
                                src={service.smallImage || "/placeholder.svg"}
                                alt={service.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-medium">{service.name}</span>
                            <span
                              className={`ml-4 text-sm px-2 py-1 rounded-full ${service.isActive ? "bg-[#219653]/10 text-[#219653]" : "bg-[#ED5050]/10 text-[#ED5050]"}`}
                            >
                              {service.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <div className="flex items-center space-x-2 mr-4">
                          <Switch
                            checked={service.isActive}
                            onCheckedChange={() => handleToggleServiceActive(service.id)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveService(service)
                              setIsAddCategoryDialogOpen(true)
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Category
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveService(service)
                                  setIsEditServiceDialogOpen(true)
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-[#ED5050]"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setActiveService(service)
                                  setIsDeleteServiceDialogOpen(true)
                                }}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <AccordionContent>
                        <div className="pl-4 pr-2 pb-2">
                          <div className="flex items-start mb-4">
                            <div className="h-[124px] w-[147px] mr-4 rounded overflow-hidden">
                              <img
                                src={service.largeImage || "/placeholder.svg"}
                                alt={service.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-[#82858A]">{service.description}</p>
                          </div>

                          {service.categories.length === 0 ? (
                            <div className="text-center py-4 text-[#82858A]">
                              No categories found. Add a category to this service.
                            </div>
                          ) : (
                            <Accordion type="multiple" className="w-full">
                              {service.categories.map((category) => (
                                <AccordionItem key={category.id} value={`category-${category.id}`}>
                                  <div className="flex items-center justify-between">
                                    <AccordionTrigger className="py-2">
                                      <span className="font-medium">{category.name}</span>
                                    </AccordionTrigger>
                                    <div className="flex items-center space-x-2 mr-4">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setActiveService(service)
                                          setActiveCategory(category)
                                          setIsAddItemDialogOpen(true)
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Item
                                      </Button>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                          <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setActiveService(service)
                                              setActiveCategory(category)
                                              setIsEditCategoryDialogOpen(true)
                                            }}
                                          >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            className="text-[#ED5050]"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              setActiveService(service)
                                              setActiveCategory(category)
                                              setIsDeleteCategoryDialogOpen(true)
                                            }}
                                          >
                                            <Trash className="h-4 w-4 mr-2" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                  <AccordionContent>
                                    <div className="pl-4 pr-2">
                                      {category.items.length === 0 ? (
                                        <div className="text-center py-4 text-[#82858A]">
                                          No items found. Add an item to this category.
                                        </div>
                                      ) : (
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Image</TableHead>
                                              <TableHead>Item Name</TableHead>
                                              <TableHead>Price</TableHead>
                                              <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {category.items.map((item) => (
                                              <TableRow key={item.id}>
                                                <TableCell>
                                                  <div className="h-[33px] w-[40px] rounded overflow-hidden">
                                                    <img
                                                      src={item.image || "/placeholder.svg"}
                                                      alt={item.name}
                                                      className="w-full h-full object-cover"
                                                    />
                                                  </div>
                                                </TableCell>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>${item.price.toFixed(2)}</TableCell>
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
                                                          setActiveService(service)
                                                          setActiveCategory(category)
                                                          setActiveItem(item)
                                                          setIsEditItemDialogOpen(true)
                                                        }}
                                                      >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                      </DropdownMenuItem>
                                                      <DropdownMenuItem
                                                        className="text-[#ED5050]"
                                                        onClick={() => {
                                                          setActiveService(service)
                                                          setActiveCategory(category)
                                                          setActiveItem(item)
                                                          setIsDeleteItemDialogOpen(true)
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
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Service Dialog */}
        <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>Update the details of this service</DialogDescription>
            </DialogHeader>
            {activeService && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Service Name</Label>
                      <Input
                        id="edit-name"
                        value={activeService.name}
                        onChange={(e) => setActiveService({ ...activeService, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={activeService.description}
                        onChange={(e) => setActiveService({ ...activeService, description: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="edit-active"
                        checked={activeService.isActive}
                        onCheckedChange={(checked) => setActiveService({ ...activeService, isActive: checked })}
                      />
                      <Label htmlFor="edit-active">Active</Label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-largeImage">Large Image (147x124 pixels)</Label>
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="h-[124px] w-[147px] mx-auto relative bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={activeService.largeImage || "/placeholder.svg"}
                            alt="Large preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          ref={editLargeImageInputRef}
                          type="file"
                          id="edit-largeImage"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLargeImageChange(e, true)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => editLargeImageInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Update Large Image
                        </Button>
                        {largeImageError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{largeImageError}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-smallImage">Small Image (110x44 pixels)</Label>
                      <div className="border rounded-md p-4 space-y-4">
                        <div className="h-[44px] w-[110px] mx-auto relative bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={activeService.smallImage || "/placeholder.svg"}
                            alt="Small preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          ref={editSmallImageInputRef}
                          type="file"
                          id="edit-smallImage"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSmallImageChange(e, true)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => editSmallImageInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Update Small Image
                        </Button>
                        {smallImageError && (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{smallImageError}</AlertDescription>
                          </Alert>
                        )}
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
                  setIsEditServiceDialogOpen(false)
                  setLargeImageError("")
                  setSmallImageError("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditService}
                disabled={!!largeImageError || !!smallImageError}
                className="bg-brand-primary hover:bg-brand-secondary"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Service Dialog */}
        <Dialog open={isDeleteServiceDialogOpen} onOpenChange={setIsDeleteServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this service? This action cannot be undone and will delete all
                categories and items within this service.
              </DialogDescription>
            </DialogHeader>
            {activeService && (
              <div className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded overflow-hidden">
                    <img
                      src={activeService.smallImage || "/placeholder.svg"}
                      alt={activeService.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{activeService.name}</p>
                    <p className="text-[#82858A]">{activeService.description}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteService}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Category Dialog */}
        <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>{activeService && `Add a new category to ${activeService.name}`}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory} className="bg-brand-primary hover:bg-brand-secondary">
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                {activeService && activeCategory && `Edit category in ${activeService.name}`}
              </DialogDescription>
            </DialogHeader>
            {activeCategory && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category-name">Category Name</Label>
                  <Input
                    id="edit-category-name"
                    value={activeCategory.name}
                    onChange={(e) => setActiveCategory({ ...activeCategory, name: e.target.value })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditCategory} className="bg-brand-primary hover:bg-brand-secondary">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Category Dialog */}
        <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? This action cannot be undone and will delete all items
                within this category.
              </DialogDescription>
            </DialogHeader>
            {activeCategory && (
              <div className="py-4">
                <p className="font-medium">{activeCategory.name}</p>
                <p className="text-[#82858A]">{activeCategory.items?.length || 0} items will be deleted</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteCategory}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Item Dialog */}
        <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
              <DialogDescription>
                {activeService && activeCategory && `Add a new item to ${activeCategory.name} in ${activeService.name}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      id="item-name"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="item-price">Price ($)</Label>
                    <Input
                      id="item-price"
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item-image">Item Image (40x33 pixels)</Label>
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="h-[33px] w-[40px] mx-auto relative bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={newItem.image || "/placeholder.svg"}
                        alt="Item preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <input
                      ref={itemImageInputRef}
                      type="file"
                      id="item-image"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleItemImageChange(e)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => itemImageInputRef.current?.click()}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    {itemImageError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{itemImageError}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddItemDialogOpen(false)
                  setItemImageError("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddItem}
                disabled={!!itemImageError}
                className="bg-brand-primary hover:bg-brand-secondary"
              >
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                {activeService &&
                  activeCategory &&
                  activeItem &&
                  `Edit item in ${activeCategory.name} under ${activeService.name}`}
              </DialogDescription>
            </DialogHeader>
            {activeItem && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-item-name">Item Name</Label>
                      <Input
                        id="edit-item-name"
                        value={activeItem.name}
                        onChange={(e) => setActiveItem({ ...activeItem, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-item-price">Price ($)</Label>
                      <Input
                        id="edit-item-price"
                        type="number"
                        step="0.01"
                        value={activeItem.price}
                        onChange={(e) => setActiveItem({ ...activeItem, price: Number.parseFloat(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-item-image">Item Image (40x33 pixels)</Label>
                    <div className="border rounded-md p-4 space-y-4">
                      <div className="h-[33px] w-[40px] mx-auto relative bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={activeItem.image || "/placeholder.svg"}
                          alt="Item preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <input
                        ref={editItemImageInputRef}
                        type="file"
                        id="edit-item-image"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleItemImageChange(e, true)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => editItemImageInputRef.current?.click()}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Update Image
                      </Button>
                      {itemImageError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{itemImageError}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditItemDialogOpen(false)
                  setItemImageError("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditItem}
                disabled={!!itemImageError}
                className="bg-brand-primary hover:bg-brand-secondary"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Item Dialog */}
        <Dialog open={isDeleteItemDialogOpen} onOpenChange={setIsDeleteItemDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Item</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this item? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {activeItem && (
              <div className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="h-[33px] w-[40px] rounded overflow-hidden">
                    <img
                      src={activeItem.image || "/placeholder.svg"}
                      alt={activeItem.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{activeItem.name}</p>
                    <p className="text-[#82858A]">Price: ${activeItem.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteItemDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteItem}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
