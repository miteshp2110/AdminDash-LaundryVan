"use client"

import { useState } from "react"
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
import { MoreVertical, Plus, Edit, Trash } from "lucide-react"

// Sample hierarchical data
const initialServices = [
  {
    id: 1,
    name: "Wash",
    description: "Regular washing service for all types of clothes",
    isActive: true,
    categories: [
      {
        id: 101,
        name: "Tops",
        items: [
          { id: 1001, name: "T-Shirt", price: 5.99 },
          { id: 1002, name: "Shirt", price: 7.99 },
          { id: 1003, name: "Blouse", price: 8.99 },
        ],
      },
      {
        id: 102,
        name: "Bottoms",
        items: [
          { id: 1004, name: "Trousers", price: 9.99 },
          { id: 1005, name: "Jeans", price: 10.99 },
          { id: 1006, name: "Skirt", price: 8.99 },
        ],
      },
      {
        id: 103,
        name: "Formal",
        items: [
          { id: 1007, name: "Suit Jacket", price: 15.99 },
          { id: 1008, name: "Dress Shirt", price: 9.99 },
          { id: 1009, name: "Tie", price: 4.99 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Wash & Iron",
    description: "Professional dry cleaning for delicate fabrics and special garments",
    isActive: true,
    categories: [
      {
        id: 201,
        name: "Formal Wear",
        items: [
          { id: 2001, name: "Suit (2 piece)", price: 24.99 },
          { id: 2002, name: "Dress", price: 19.99 },
          { id: 2003, name: "Blazer", price: 14.99 },
        ],
      },
      {
        id: 202,
        name: "Delicates",
        items: [
          { id: 2004, name: "Silk Shirt", price: 12.99 },
          { id: 2005, name: "Cashmere Sweater", price: 16.99 },
          { id: 2006, name: "Wool Coat", price: 29.99 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Iron & Press",
    description: "Professional ironing and pressing service for wrinkle-free clothes",
    isActive: true,
    categories: [
      {
        id: 301,
        name: "Regular Items",
        items: [
          { id: 3001, name: "Shirt", price: 3.99 },
          { id: 3002, name: "Trousers", price: 4.99 },
          { id: 3003, name: "Dress", price: 6.99 },
        ],
      },
      {
        id: 302,
        name: "Formal Items",
        items: [
          { id: 3004, name: "Suit Jacket", price: 7.99 },
          { id: 3005, name: "Dress Shirt", price: 4.99 },
          { id: 3006, name: "Pleated Skirt", price: 6.99 },
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
  
  // New item states
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    isActive: true,
  })
  
  const [newCategory, setNewCategory] = useState({
    name: "",
  })
  
  const [newItem, setNewItem] = useState({
    name: "",
    price: 0,
  })

  // Service handlers
  const handleAddService = () => {
    const id = Math.max(...services.map((s) => s.id), 0) + 1
    setServices([...services, { ...newService, id, categories: [] }])
    setNewService({
      name: "",
      description: "",
      isActive: true,
    })
    setIsAddServiceDialogOpen(false)
  }

  const handleEditService = () => {
    setServices(services.map((service) => (service.id === activeService.id ? activeService : service)))
    setIsEditServiceDialogOpen(false)
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
    const categoryId = Math.max(...services.flatMap(s => s.categories.map(c => c.id)), 0) + 1
    const updatedServices = services.map(service => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: [...service.categories, { ...newCategory, id: categoryId, items: [] }]
        }
      }
      return service
    })
    
    setServices(updatedServices)
    setNewCategory({ name: "" })
    setIsAddCategoryDialogOpen(false)
  }

  const handleEditCategory = () => {
    const updatedServices = services.map(service => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: service.categories.map(category => 
            category.id === activeCategory.id ? activeCategory : category
          )
        }
      }
      return service
    })
    
    setServices(updatedServices)
    setIsEditCategoryDialogOpen(false)
  }

  const handleDeleteCategory = () => {
    const updatedServices = services.map(service => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: service.categories.filter(category => category.id !== activeCategory.id)
        }
      }
      return service
    })
    
    setServices(updatedServices)
    setIsDeleteCategoryDialogOpen(false)
  }

  // Item handlers
  const handleAddItem = () => {
    const itemId = Math.max(...services.flatMap(s => s.categories.flatMap(c => c.items.map(i => i.id))), 0) + 1
    
    const updatedServices = services.map(service => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: service.categories.map(category => {
            if (category.id === activeCategory.id) {
              return {
                ...category,
                items: [...category.items, { ...newItem, id: itemId }]
              }
            }
            return category
          })
        }
      }
      return service
    })
    
    setServices(updatedServices)
    setNewItem({ name: "", price: 0 })
    setIsAddItemDialogOpen(false)
  }

  const handleEditItem = () => {
    const updatedServices = services.map(service => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: service.categories.map(category => {
            if (category.id === activeCategory.id) {
              return {
                ...category,
                items: category.items.map(item => 
                  item.id === activeItem.id ? activeItem : item
                )
              }
            }
            return category
          })
        }
      }
      return service
    })
    
    setServices(updatedServices)
    setIsEditItemDialogOpen(false)
  }

  const handleDeleteItem = () => {
    const updatedServices = services.map(service => {
      if (service.id === activeService.id) {
        return {
          ...service,
          categories: service.categories.map(category => {
            if (category.id === activeCategory.id) {
              return {
                ...category,
                items: category.items.filter(item => item.id !== activeItem.id)
              }
            }
            return category
          })
        }
      }
      return service
    })
    
    setServices(updatedServices)
    setIsDeleteItemDialogOpen(false)
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
              <Button className="bg-[#01015B] hover:bg-[#0040FF]">
                <Plus className="h-4 w-4 mr-2" />
                Add New Service
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogDescription>Create a new service for your customers</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
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
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddServiceDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddService} className="bg-[#CE7A58] hover:bg-[#903938]">Add Service</Button>
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
                            <span className="font-medium">{service.name}</span>
                            <span className={`ml-4 text-sm px-2 py-1 rounded-full ${service.isActive ? 'bg-[#219653]/10 text-[#219653]' : 'bg-[#ED5050]/10 text-[#ED5050]'}`}>
                              {service.isActive ? 'Active' : 'Inactive'}
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
                              e.stopPropagation();
                              setActiveService(service);
                              setIsAddCategoryDialogOpen(true);
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
                                  e.stopPropagation();
                                  setActiveService(service);
                                  setIsEditServiceDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-[#ED5050]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveService(service);
                                  setIsDeleteServiceDialogOpen(true);
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
                          <p className="text-[#82858A] mb-4">{service.description}</p>
                          
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
                                          e.stopPropagation();
                                          setActiveService(service);
                                          setActiveCategory(category);
                                          setIsAddItemDialogOpen(true);
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
                                              e.stopPropagation();
                                              setActiveService(service);
                                              setActiveCategory(category);
                                              setIsEditCategoryDialogOpen(true);
                                            }}
                                          >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            className="text-[#ED5050]"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setActiveService(service);
                                              setActiveCategory(category);
                                              setIsDeleteCategoryDialogOpen(true);
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
                                              <TableHead>Item Name</TableHead>
                                              <TableHead>Price</TableHead>
                                              <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {category.items.map((item) => (
                                              <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>AED {item.price.toFixed(2)}</TableCell>
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
                                                          setActiveService(service);
                                                          setActiveCategory(category);
                                                          setActiveItem(item);
                                                          setIsEditItemDialogOpen(true);
                                                        }}
                                                      >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                      </DropdownMenuItem>
                                                      <DropdownMenuItem
                                                        className="text-[#ED5050]"
                                                        onClick={() => {
                                                          setActiveService(service);
                                                          setActiveCategory(category);
                                                          setActiveItem(item);
                                                          setIsDeleteItemDialogOpen(true);
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>Update the details of this service</DialogDescription>
            </DialogHeader>
            {activeService && (
              <div className="space-y-4 py-4">
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
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditServiceDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditService} className="bg-[#CE7A58] hover:bg-[#903938]">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Service Dialog */}
        <Dialog open={isDeleteServiceDialogOpen} onOpenChange={setIsDeleteServiceDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this service? This action cannot be undone and will delete all categories and items within this service.
              </DialogDescription>
            </DialogHeader>
            {activeService && (
              <div className="py-4">
                <p className="font-medium">{activeService.name}</p>
                <p className="text-[#82858A]">{activeService.description}</p>
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
              <DialogDescription>
                {activeService && `Add a new category to ${activeService.name}`}
              </DialogDescription>
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
              <Button onClick={handleAddCategory} className="bg-[#CE7A58] hover:bg-[#903938]">Add Category</Button>
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
              <Button onClick={handleEditCategory} className="bg-[#CE7A58] hover:bg-[#903938]">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Category Dialog */}
        <Dialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Category</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this category? This action cannot be undone and will delete all items within this category.
              </DialogDescription>
            </DialogHeader>
            {activeCategory && (
              <div className="py-4">
                <p className="font-medium">{activeCategory.name}</p>
                <p className="text-[#82858A]">
                  {activeCategory.items?.length || 0} items will be deleted
                </p>
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
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price">Price (AED)</Label>
                <Input
                  id="item-price"
                  type="number"
                  step="0.01"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number.parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem} className="bg-[#CE7A58] hover:bg-[#903938]">Add Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Item Dialog */}
        <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                {activeService && activeCategory && activeItem && 
                  `Edit item in ${activeCategory.name} under ${activeService.name}`}
              </DialogDescription>
            </DialogHeader>
            {activeItem && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-item-name">Item Name</Label>
                  <Input
                    id="edit-item-name"
                    value={activeItem.name}
                    onChange={(e) => setActiveItem({ ...activeItem, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-item-price">Price (AED)</Label>
                  <Input
                    id="edit-item-price"
                    type="number"
                    step="0.01"
                    value={activeItem.price}
                    onChange={(e) => setActiveItem({ ...activeItem, price: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditItemDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditItem} className="bg-[#CE7A58] hover:bg-[#903938]">Save Changes</Button>
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
                <p className="font-medium">{activeItem.name}</p>
                <p className="text-[#82858A]">Price: AED {activeItem.price.toFixed(2)}</p>
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
  );
}
