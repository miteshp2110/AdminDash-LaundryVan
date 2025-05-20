"use client"

import { useState, useRef, useEffect } from "react"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MoreVertical, Plus, Edit, Trash, MapPin, Search } from "lucide-react"
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: 'weekly',
});

const baseurl = "http://ec2-65-0-21-246.ap-south-1.compute.amazonaws.com/admins"
declare global {
  interface Window {
    google: typeof google
  }
}

export default function RegionsPage() {
  interface Region{
    id: number,
    name: string,
    description: string,
    threshold: number,
    latitude: number,
    longitude: number
  }
  const [regions, setRegions] = useState<Region[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewMapDialogOpen, setIsViewMapDialogOpen] = useState(false)
  const [currentRegion, setCurrentRegion] = useState<any>(null)
  const [newRegion, setNewRegion] = useState({
    name: "",
    description: "",
    threshold: 5,
    latitude: 25.2048,
    longitude: 55.2708,
  })

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch(`${baseurl}/admin/regions`)
        const data = await res.json()
        if (data.success) {
          setRegions(data.data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }
    fetchRegions()
  }, []);

  // Refs for map containers
  const addMapRef = useRef<HTMLDivElement>(null)
  const editMapRef = useRef<HTMLDivElement>(null)
  const viewMapRef = useRef<HTMLDivElement>(null)

  // Map instances & overlays
  const [addMap, setAddMap] = useState<google.maps.Map | null>(null)
  const [addMarker, setAddMarker] = useState<google.maps.Marker | null>(null)
  const [addCircle, setAddCircle] = useState<google.maps.Circle | null>(null)
  const [editMap, setEditMap] = useState<google.maps.Map | null>(null)
  const [editMarker, setEditMarker] = useState<google.maps.Marker | null>(null)
  const [editCircle, setEditCircle] = useState<google.maps.Circle | null>(null)
  const [viewMap, setViewMap] = useState<google.maps.Map | null>(null)

  async function addRegion(){
    try{
      const res = await fetch(`${baseurl}/admin/regions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers here if needed
        },
        body: JSON.stringify({
          name:newRegion.name,
          description:newRegion.description,
          latitude:newRegion.latitude,
          longitude:newRegion.longitude,
          thresholdDistance:newRegion.threshold
        })
      })
      const data = await res.json()
      return !!data.success;

    }catch (e) {
      console.log(e)
      return false
    }
  }

  async function updateRegion(){
    try{
      const res = await fetch(`${baseurl}/admin/regions/${currentRegion.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers here if needed
        },
        body: JSON.stringify({
          name:currentRegion.name,
          description:currentRegion.description,
          latitude:currentRegion.latitude,
          longitude:currentRegion.longitude,
          thresholdDistance:currentRegion.threshold
        })
      })
      const data = await res.json()
      return !!data.success;

    }catch (e) {
      console.log(e)
      return false
    }
  }

  async function deleteRegion(){
    try{
      const res = await fetch(`${baseurl}/admin/regions/${currentRegion.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers here if needed
        }
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

  // Filtered list
  const filteredRegions = regions.filter(
    (region) =>
      region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Initialize Google Maps when dialogs open
  useEffect(() => {
    let map: google.maps.Map
    let marker: google.maps.Marker
    let circle: google.maps.Circle

    loader.load().then(() => {
      // ADD DIALOG
      if (isAddDialogOpen && addMapRef.current && !addMap) {
        map = new google.maps.Map(addMapRef.current, {
          center: { lat: newRegion.latitude, lng: newRegion.longitude },
          zoom: 12,
        })
        setAddMap(map)

        marker = new google.maps.Marker({
          position: { lat: newRegion.latitude, lng: newRegion.longitude },
          map,
          draggable: true,
        })
        setAddMarker(marker)

        circle = new google.maps.Circle({
          map,
          center: { lat: newRegion.latitude, lng: newRegion.longitude },
          radius: newRegion.threshold * 1000,
          fillColor: '#0040FF',
          fillOpacity: 0.2,
          strokeColor: '#0040FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
        })
        setAddCircle(circle)

        map.addListener('click', (e:any) => {
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          marker.setPosition({ lat, lng })
          circle.setCenter({ lat, lng })
          setNewRegion(prev => ({ ...prev, latitude: lat, longitude: lng }))
        })
      }

      // EDIT DIALOG
      if (isEditDialogOpen && editMapRef.current && currentRegion && !editMap) {
        map = new google.maps.Map(editMapRef.current, {
          center: { lat: currentRegion.latitude, lng: currentRegion.longitude },
          zoom: 12,
        })
        setEditMap(map)

        marker = new google.maps.Marker({
          position: { lat: currentRegion.latitude, lng: currentRegion.longitude },
          map,
          draggable: true,
        })
        setEditMarker(marker)

        circle = new google.maps.Circle({
          map,
          center: { lat: currentRegion.latitude, lng: currentRegion.longitude },
          radius: currentRegion.threshold * 1000,
          fillColor: '#0040FF',
          fillOpacity: 0.2,
          strokeColor: '#0040FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
        })
        setEditCircle(circle)

        map.addListener('click', (e:any) => {
          const lat = e.latLng.lat()
          const lng = e.latLng.lng()
          marker.setPosition({ lat, lng })
          circle.setCenter({ lat, lng })
          setCurrentRegion((prev: typeof currentRegion) => prev && ({ ...prev, latitude: lat, longitude: lng }))
        })
      }

      // VIEW DIALOG
      if (isViewMapDialogOpen && viewMapRef.current && currentRegion && !viewMap) {
        map = new google.maps.Map(viewMapRef.current, {
          center: { lat: currentRegion.latitude, lng: currentRegion.longitude },
          zoom: 12,
        })
        setViewMap(map)

        new google.maps.Marker({
          position: { lat: currentRegion.latitude, lng: currentRegion.longitude },
          map,
        })

        new google.maps.Circle({
          map,
          center: { lat: currentRegion.latitude, lng: currentRegion.longitude },
          radius: currentRegion.threshold * 1000,
          fillColor: '#0040FF',
          fillOpacity: 0.2,
          strokeColor: '#0040FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
        })
      }
    })

    return () => {
      if (!isAddDialogOpen)     { setAddMap(null); setAddMarker(null); setAddCircle(null) }
      if (!isEditDialogOpen)    { setEditMap(null); setEditMarker(null); setEditCircle(null) }
      if (!isViewMapDialogOpen) { setViewMap(null) }
    }
  }, [isAddDialogOpen, isEditDialogOpen, isViewMapDialogOpen, currentRegion, newRegion])

  // Update circle radius on threshold change
  useEffect(() => {
    if (addCircle) addCircle.setRadius(newRegion.threshold * 1000)
  }, [newRegion.threshold, addCircle])

  useEffect(() => {
    if (editCircle) editCircle.setRadius(currentRegion?.threshold * 1000)
  }, [currentRegion?.threshold, editCircle])

  // Reset maps on dialog close
  useEffect(() => {
    if (!isAddDialogOpen)  { setAddMap(null); setAddMarker(null); setAddCircle(null) }
    if (!isEditDialogOpen) { setEditMap(null); setEditMarker(null); setEditCircle(null) }
    if (!isViewMapDialogOpen) { setViewMap(null); }
  }, [isAddDialogOpen, isEditDialogOpen, isViewMapDialogOpen])

  const handleAddRegion =async () => {
    if(!newRegion.name || !newRegion.latitude || !newRegion.longitude || !newRegion.threshold || !newRegion.description){
      alert("All Fields Required")
      return
    }
    if(await addRegion()){
      const id = Math.max(...regions.map((r) => r.id), 0) + 1
      setRegions([...regions, { ...newRegion, id }])
      setNewRegion({
        name: "",
        description: "",
        threshold: 5,
        latitude: 25.2048,
        longitude: 55.2708,
      })
    }
    else{
      alert("Failed to add region")
    }
    setIsAddDialogOpen(false)
  }

  const handleEditRegion = async() => {
    if(!currentRegion.name || !currentRegion.latitude || !currentRegion.longitude || !currentRegion.threshold || !currentRegion.description){
      alert("All Fields Required")
      return
    }
    if(await updateRegion()){
      setRegions(regions.map((region) => (region.id === currentRegion.id ? currentRegion : region)))
    }
    else{
      alert("Failed to update region")
    }
    setIsEditDialogOpen(false)
  }

  const handleDeleteRegion = async() => {
    if(await deleteRegion()){
      setRegions(regions.filter((region) => region.id !== currentRegion.id))
    }
    else{
      alert("Failed to Delete Region")
    }
    setIsDeleteDialogOpen(false)
  }

  const handleThresholdChange = (value: number, isEdit = false) => {
    if (isEdit) {
      setCurrentRegion({ ...currentRegion, threshold: value })
    } else {
      setNewRegion({ ...newRegion, threshold: value })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Regions</h1>
            <p className="text-text-muted mt-2">Manage your service regions and coverage areas</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="Search regions..."
                className="pl-10 w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-brand-primary hover:bg-brand-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Region
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Add New Region</DialogTitle>
                  <DialogDescription>Create a new service region with coverage area</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Region Name</Label>
                      <Input
                        id="name"
                        value={newRegion.name}
                        onChange={(e) => setNewRegion({ ...newRegion, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newRegion.description}
                        onChange={(e) => setNewRegion({ ...newRegion, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="threshold">Coverage Radius (km): {newRegion.threshold}</Label>
                      <Input
                        id="threshold"
                        type="range"
                        min="1"
                        max="20"
                        value={newRegion.threshold}
                        onChange={(e) => handleThresholdChange(Number(e.target.value))}
                      />
                      <div className="flex justify-between text-xs text-text-muted">
                        <span>1 km</span>
                        <span>20 km</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          type="number"
                          step="0.0001"
                          value={newRegion.latitude}
                          onChange={(e) => setNewRegion({ ...newRegion, latitude: Number(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          type="number"
                          step="0.0001"
                          value={newRegion.longitude}
                          onChange={(e) => setNewRegion({ ...newRegion, longitude: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="block mb-2">Set Location on Map</Label>
                    <div
                      ref={addMapRef}
                      className="w-full h-[300px] bg-gray-100 rounded-md border"
                      style={{ background: "url('/placeholder.svg?height=300&width=400')" }}
                    ></div>
                    <p className="text-xs text-text-muted mt-2">
                      Click on the map to set the region center point. The circle shows the coverage area based on the
                      radius.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRegion} className="bg-brand-primary hover:bg-brand-secondary">
                    Add Region
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Regions</CardTitle>
            <CardDescription>View and manage your service regions and coverage areas</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Region Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Coverage Radius</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegions.map((region) => (
                  <TableRow key={region.id}>
                    <TableCell className="font-medium">{region.name}</TableCell>
                    <TableCell>{region.description}</TableCell>
                    <TableCell>{region.threshold} km</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-brand-primary" />
                        <span>
                          {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
                        </span>
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
                              setCurrentRegion(region)
                              setIsViewMapDialogOpen(true)
                            }}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            View on Map
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setCurrentRegion(region)
                              setIsEditDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Region
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-status-danger"
                            onClick={() => {
                              setCurrentRegion(region)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Region
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

        {/* Edit Region Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Region</DialogTitle>
              <DialogDescription>Update the details of this region</DialogDescription>
            </DialogHeader>
            {currentRegion && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Region Name</Label>
                    <Input
                      id="edit-name"
                      value={currentRegion.name}
                      onChange={(e) => setCurrentRegion({ ...currentRegion, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={currentRegion.description}
                      onChange={(e) => setCurrentRegion({ ...currentRegion, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-threshold">Coverage Radius (km): {currentRegion.threshold}</Label>
                    <Input
                      id="edit-threshold"
                      type="range"
                      min="1"
                      max="20"
                      value={currentRegion.threshold}
                      onChange={(e) => handleThresholdChange(Number(e.target.value), true)}
                    />
                    <div className="flex justify-between text-xs text-text-muted">
                      <span>1 km</span>
                      <span>20 km</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-latitude">Latitude</Label>
                      <Input
                        id="edit-latitude"
                        type="number"
                        step="0.0001"
                        value={currentRegion.latitude}
                        onChange={(e) => setCurrentRegion({ ...currentRegion, latitude: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-longitude">Longitude</Label>
                      <Input
                        id="edit-longitude"
                        type="number"
                        step="0.0001"
                        value={currentRegion.longitude}
                        onChange={(e) => setCurrentRegion({ ...currentRegion, longitude: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="block mb-2">Set Location on Map</Label>
                  <div
                    ref={editMapRef}
                    className="w-full h-[300px] bg-gray-100 rounded-md border"
                    style={{ background: "url('/placeholder.svg?height=300&width=400')" }}
                  ></div>
                  <p className="text-xs text-text-muted mt-2">
                    Click on the map to set the region center point. The circle shows the coverage area based on the
                    radius.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditRegion} className="bg-brand-primary hover:bg-brand-secondary">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Map Dialog */}
        <Dialog open={isViewMapDialogOpen} onOpenChange={setIsViewMapDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>View Region Map</DialogTitle>
              <DialogDescription>
                {currentRegion && `Viewing ${currentRegion.name} with ${currentRegion.threshold}km coverage radius`}
              </DialogDescription>
            </DialogHeader>
            {currentRegion && (
              <div className="py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-lg">{currentRegion.name}</h3>
                      <p className="text-text-muted">{currentRegion.description}</p>
                    </div>
                    <div className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full">
                      {currentRegion.threshold} km radius
                    </div>
                  </div>
                  <div
                    ref={viewMapRef}
                    className="w-full h-[400px] bg-gray-100 rounded-md border"
                    style={{ background: "url('/placeholder.svg?height=400&width=600')" }}
                  ></div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-text-muted">Center Coordinates:</p>
                      <p className="font-medium">
                        {currentRegion.latitude.toFixed(6)}, {currentRegion.longitude.toFixed(6)}
                      </p>
                    </div>
                    <div>
                      <p className="text-text-muted">Coverage Area:</p>
                      <p className="font-medium">~{(Math.PI * Math.pow(currentRegion.threshold, 2)).toFixed(2)} km²</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewMapDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Region Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Region</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this region? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {currentRegion && (
              <div className="py-4">
                <p className="font-medium">{currentRegion.name}</p>
                <p className="text-text-muted">{currentRegion.description}</p>
                <p className="text-text-muted">Coverage radius: {currentRegion.threshold} km</p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteRegion}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}