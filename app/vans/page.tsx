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
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { MoreVertical, Plus, Edit, Trash, Search } from "lucide-react"

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (() => { throw new Error('NEXT_PUBLIC_BACKEND_URL is not set'); })();

// Sample regions for dropdown

export default function VansPage() {
  interface Region{
    id: number,
    name : string
  }
  interface Van{
    id: number,
    regionId: number,
    regionName: string,
    regNo: string,
    status: string,
    phone : string

  }
  const [vans, setVans] = useState<Van[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentVan, setCurrentVan] = useState<any>(null)
  const [newVan, setNewVan] = useState({
    vanId: "",
    regionId: 0,
    regNo: "",
    status: "active",
    phone : ""
  })



  useEffect(() => {
    const fetchRegions = async()=>{
      try {
        const res = await fetch(`${baseUrl}/admin/regions`)
        const data = await res.json()
        if (data.success) {
          setRegions(data.data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }
    const fetchVans = async()=>{
      try {
        const res = await fetch(`${baseUrl}/admin/drivers`)
        const data = await res.json()
        if (data.success) {
          setVans(data.data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }
    fetchRegions()
    fetchVans()
  }, []);

  const filteredVans = vans.filter(
    (van) =>
      van.regNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      van.regionName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  async function  addVan(){
    try{
      const res = await fetch(`${baseUrl}/admin/addDriver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers here if needed
        },
        body: JSON.stringify({
          region_id : newVan.regionId,
          van_number : newVan.regNo,
          phone : newVan.vanId,
          status : newVan.status,
        })
      })
      const data = await res.json()
      return !!data.success;
    }
    catch(error){
      console.log(error)
      return false
    }
  }

  async function toggleStatus(id: number,status : string) {
    const newStatus = status !== "active"
    try{
      const res = await fetch(`${baseUrl}/admin/drivers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers here if needed
        },
        body: JSON.stringify({
          status: newStatus
        })
      })
      const data = await res.json()
      return !!data.success;
    }
    catch (error) {
      console.log(error)
      return false
    }

  }

  async function updateVan() {
    console.log(currentVan.id,currentVan.phone,currentVan.regionId)
    try{
      const res = await fetch(`${baseUrl}/admin/updateDriver/${currentVan.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers here if needed
        },
        body: JSON.stringify({
          status : currentVan.status === "active"?1:0,
          phone : currentVan.phone,
          regNo : currentVan.regNo,
          regionId : currentVan.regionId
        })
      })
      const data = await res.json()
      return !!data.success;
    }
    catch (error) {
      console.log(error)
      return false
    }

  }

  const handleAddVan = async () => {
    if(newVan.regNo === "" || newVan.vanId === "" || newVan.regionId === 0){
      alert("Please enter all Details")
      return
    }
    if(await addVan()){
      const id = Math.max(...vans.map((d) => d.id)) + 1
      const selectedRegion = regions.find((r) => r.id === Number(newVan.regionId))
      setVans([
        ...vans,
        {
          ...newVan,
          id,
          regionId: Number(newVan.regionId),
          regionName: selectedRegion ? selectedRegion.name : "Unknown",
          phone: newVan.vanId
        },
      ])
      setNewVan({
        vanId: "",
        regionId: 0,
        regNo: "",
        status: "active",
        phone: ""
      })
    }
    else{
      alert("Failed to Add Van")
    }
    setIsAddDialogOpen(false)
  }

  const handleEditVan = async() => {
    if(!currentVan.phone || !currentVan.regionId || !currentVan.regNo){
      alert("Please enter all Details")
      return
    }
    if(await updateVan()){
      const selectedRegion = regions.find((r) => r.id === Number(currentVan.regionId))
      const updatedVan = {
        ...currentVan,
        regionId: Number(currentVan.regionId),
        regionName: selectedRegion ? selectedRegion.name : "Unknown",
      }
      setVans(vans.map((van) => (van.id === currentVan.id ? updatedVan : van)))

    }
    else{
      alert("Failed to update Van")
    }
    setIsEditDialogOpen(false)
  }



  const handleToggleStatus = async (id: number,status:string) => {
    if(await toggleStatus(id,status)){
      setVans(
          vans.map((van) =>
              van.id === id
                  ? {
                    ...van,
                    status: van.status === "active" ? "inactive" : "active",
                  }
                  : van,
          ),
      )
    }
    else{
      alert("Failed to Update Status")
    }

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
            <h1 className="text-3xl font-bold text-text-dark">Vans</h1>
            <p className="text-text-muted mt-2">Manage your delivery vans</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="Search vans..."
                className="pl-10 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-primary hover:bg-brand-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Van
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Van</DialogTitle>
                  <DialogDescription>Register a new van for your laundry service</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vanId">Phone</Label>
                      <Input
                        id="vanId"
                        value={newVan.vanId}
                        onChange={(e) => setNewVan({ ...newVan, vanId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regNo">Registration Number</Label>
                      <Input
                        id="regNo"
                        value={newVan.regNo}
                        onChange={(e) => setNewVan({ ...newVan, regNo: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regionId">Region</Label>
                    <select
                      id="regionId"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={newVan.regionId}
                      onChange={(e) => setNewVan({ ...newVan, regionId: Number(e.target.value) })}
                    >
                      <option value="0">Select a region</option>
                      {regions.map((region) => (
                        <option key={region.id} value={region.id}>
                          {region.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newVan.status === "active"}
                      onCheckedChange={(checked) => setNewVan({ ...newVan, status: checked ? "active" : "inactive" })}
                    />
                    <Label htmlFor="active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddVan} className="bg-brand-primary hover:bg-brand-secondary">
                    Add Van
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Vans</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          {["all", "active", "inactive"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{tab === "all" ? "All Vans" : `${tab} Vans`}</CardTitle>
                  <CardDescription>
                    {tab === "all" ? "View and manage all your vans" : `View and manage ${tab} vans`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Van ID</TableHead>
                        <TableHead>Registration No</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVans
                        .filter((van) => tab === "all" || van.status === tab)
                        .map((van) => (
                          <TableRow key={van.id}>
                            <TableCell className="font-medium">{van.id}</TableCell>
                            <TableCell>{van.regNo}</TableCell>
                            <TableCell>{van.regionName}</TableCell>
                            <TableCell>{van.phone}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={van.status === "active"}
                                  onCheckedChange={() => handleToggleStatus(van.id,van.status)}
                                />
                                {getStatusBadge(van.status)}
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
                                      setCurrentVan(van)
                                      setIsEditDialogOpen(true)
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Van
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

        {/* Edit Van Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Van</DialogTitle>
              <DialogDescription>Update the details of this van</DialogDescription>
            </DialogHeader>
            {currentVan && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={currentVan.phone}
                      onChange={(e) => setCurrentVan({ ...currentVan, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-regNo">Registration Number</Label>
                    <Input
                      id="edit-regNo"
                      value={currentVan.regNo}
                      onChange={(e) => setCurrentVan({ ...currentVan, regNo: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-regionId">Region</Label>
                  <select
                    id="edit-regionId"
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    value={currentVan.regionId}
                    onChange={(e) => setCurrentVan({ ...currentVan, regionId: Number(e.target.value) })}
                  >
                    {regions.map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-active"
                    checked={currentVan.status === "active"}
                    onCheckedChange={(checked) =>
                      setCurrentVan({ ...currentVan, status: checked ? "active" : "inactive" })
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
              <Button onClick={handleEditVan} className="bg-brand-primary hover:bg-brand-secondary">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
