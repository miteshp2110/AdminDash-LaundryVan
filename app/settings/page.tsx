"use client"

import React, {useEffect} from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Save, UserPlus, Lock } from "lucide-react"

const baseUrl = 'http://localhost:5000'

export default function SettingsPage() {
  interface BusinessInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    description: string;
  }

  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: ""
  })

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${baseUrl}/settings`)
      const data = await res.json()
      if (data.success) {
        setBusinessInfo(data.data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, []);


  const [paymentSettings, setPaymentSettings] = useState({
    enableCreditCard: true,
    enablePaypal: true,
    enableCashOnDelivery: true,
    taxRate: 8.5,
    deliveryFee: 5,
    freeDeliveryThreshold: 50,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    orderStatusUpdate: true,
    deliveryReminder: true,
    promotionalEmails: false,
    smsNotifications: true,
    pushNotifications: true,
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [newAdminForm, setNewAdminForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [mockAdmins, setMockAdmins] = useState([
    { id: 1, name: "John Doe", email: "john@laundryvan.com", role: "Super Admin" },
    { id: 2, name: "Jane Smith", email: "jane@laundryvan.com", role: "Admin" },
    { id: 3, name: "Mike Johnson", email: "mike@laundryvan.com", role: "Admin" },
  ])

  const handleBusinessInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBusinessInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    const val = type === "number" ? Number.parseFloat(value) : value
    setPaymentSettings((prev) => ({ ...prev, [name]: val }))
  }

  const handleToggleChange = (setting: string, value: boolean, settingType: "payment" | "notification") => {
    if (settingType === "payment") {
      setPaymentSettings((prev) => ({ ...prev, [setting]: value }))
    } else {
      setNotificationSettings((prev) => ({ ...prev, [setting]: value }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNewAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAdminForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully",
        variant: "default",
      })
    }, 1000)
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate passwords match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
        variant: "default",
      })
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }, 1000)
  }

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate passwords match
    if (newAdminForm.password !== newAdminForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Admin added",
        description: `New admin ${newAdminForm.name} has been added successfully`,
        variant: "default",
      })
      setNewAdminForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
    }, 1000)
  }

  const handleDeleteAdmin = (id: number) => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setMockAdmins(mockAdmins.filter((admin) => admin.id !== id))
      setIsLoading(false)
      toast({
        title: "Admin deleted",
        description: "The admin has been removed successfully",
        variant: "default",
      })
    }, 1000)
  }

  return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Settings</h1>
            <p className="text-text-muted mt-2">Manage your application settings</p>
          </div>

          <Tabs defaultValue="business" className="space-y-4">
            <TabsList>
              <TabsTrigger value="business">Business Information</TabsTrigger>
              {/*<TabsTrigger value="payment">Payment Settings</TabsTrigger>*/}
              {/*<TabsTrigger value="notification">Notification Settings</TabsTrigger>*/}
              <TabsTrigger value="admin">Admin Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Update your business details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Business Name</Label>
                      <Input id="name" name="name" value={businessInfo.name} onChange={handleBusinessInfoChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                          id="email"
                          name="email"
                          type="email"
                          value={businessInfo.email}
                          onChange={handleBusinessInfoChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={businessInfo.phone} onChange={handleBusinessInfoChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                          id="website"
                          name="website"
                          value={businessInfo.website}
                          onChange={handleBusinessInfoChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input id="address" name="address" value={businessInfo.address} onChange={handleBusinessInfoChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={businessInfo.description}
                        onChange={handleBusinessInfoChange}
                        rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                      onClick={handleSaveSettings}
                      disabled={isLoading}
                      className="bg-brand-primary hover:bg-brand-secondary"
                  >
                    {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                    ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Settings</CardTitle>
                  <CardDescription>Configure payment methods and pricing options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enableCreditCard">Credit Card</Label>
                          <p className="text-sm text-text-muted">Accept credit card payments</p>
                        </div>
                        <Switch
                            id="enableCreditCard"
                            checked={paymentSettings.enableCreditCard}
                            onCheckedChange={(checked) => handleToggleChange("enableCreditCard", checked, "payment")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enablePaypal">PayPal</Label>
                          <p className="text-sm text-text-muted">Accept PayPal payments</p>
                        </div>
                        <Switch
                            id="enablePaypal"
                            checked={paymentSettings.enablePaypal}
                            onCheckedChange={(checked) => handleToggleChange("enablePaypal", checked, "payment")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="enableCashOnDelivery">Cash on Delivery</Label>
                          <p className="text-sm text-text-muted">Allow cash payments on delivery</p>
                        </div>
                        <Switch
                            id="enableCashOnDelivery"
                            checked={paymentSettings.enableCashOnDelivery}
                            onCheckedChange={(checked) => handleToggleChange("enableCashOnDelivery", checked, "payment")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-line-light pt-6">
                    <h3 className="text-lg font-medium mb-4">Pricing & Fees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="taxRate">Tax Rate (%)</Label>
                        <Input
                            id="taxRate"
                            name="taxRate"
                            type="number"
                            value={paymentSettings.taxRate}
                            onChange={handlePaymentSettingChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryFee">Delivery Fee ($)</Label>
                        <Input
                            id="deliveryFee"
                            name="deliveryFee"
                            type="number"
                            value={paymentSettings.deliveryFee}
                            onChange={handlePaymentSettingChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold ($)</Label>
                        <Input
                            id="freeDeliveryThreshold"
                            name="freeDeliveryThreshold"
                            type="number"
                            value={paymentSettings.freeDeliveryThreshold}
                            onChange={handlePaymentSettingChange}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                      onClick={handleSaveSettings}
                      disabled={isLoading}
                      className="bg-brand-primary hover:bg-brand-secondary"
                  >
                    {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                    ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notification">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how and when notifications are sent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="orderConfirmation">Order Confirmation</Label>
                          <p className="text-sm text-text-muted">Send email when an order is placed</p>
                        </div>
                        <Switch
                            id="orderConfirmation"
                            checked={notificationSettings.orderConfirmation}
                            onCheckedChange={(checked) => handleToggleChange("orderConfirmation", checked, "notification")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="orderStatusUpdate">Order Status Updates</Label>
                          <p className="text-sm text-text-muted">Send email when order status changes</p>
                        </div>
                        <Switch
                            id="orderStatusUpdate"
                            checked={notificationSettings.orderStatusUpdate}
                            onCheckedChange={(checked) => handleToggleChange("orderStatusUpdate", checked, "notification")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="promotionalEmails">Promotional Emails</Label>
                          <p className="text-sm text-text-muted">Send promotional offers and discounts</p>
                        </div>
                        <Switch
                            id="promotionalEmails"
                            checked={notificationSettings.promotionalEmails}
                            onCheckedChange={(checked) => handleToggleChange("promotionalEmails", checked, "notification")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-line-light pt-6">
                    <h3 className="text-lg font-medium mb-4">Other Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="deliveryReminder">Delivery Reminders</Label>
                          <p className="text-sm text-text-muted">Send reminders before scheduled delivery</p>
                        </div>
                        <Switch
                            id="deliveryReminder"
                            checked={notificationSettings.deliveryReminder}
                            onCheckedChange={(checked) => handleToggleChange("deliveryReminder", checked, "notification")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="smsNotifications">SMS Notifications</Label>
                          <p className="text-sm text-text-muted">Send text messages for important updates</p>
                        </div>
                        <Switch
                            id="smsNotifications"
                            checked={notificationSettings.smsNotifications}
                            onCheckedChange={(checked) => handleToggleChange("smsNotifications", checked, "notification")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="pushNotifications">Push Notifications</Label>
                          <p className="text-sm text-text-muted">Send mobile app push notifications</p>
                        </div>
                        <Switch
                            id="pushNotifications"
                            checked={notificationSettings.pushNotifications}
                            onCheckedChange={(checked) => handleToggleChange("pushNotifications", checked, "notification")}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button
                      onClick={handleSaveSettings}
                      disabled={isLoading}
                      className="bg-brand-primary hover:bg-brand-secondary"
                  >
                    {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                    ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="admin">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Update Password</CardTitle>
                    <CardDescription>Change your admin account password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                      </div>
                      <Button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-secondary">
                        {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                        ) : (
                            <>
                              <Lock className="mr-2 h-4 w-4" />
                              Update Password
                            </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Admin Management</CardTitle>
                    <CardDescription>Manage admin users and add new administrators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Current Administrators</h3>
                      <div className="border rounded-md">
                        <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 font-medium">
                          <div className="col-span-4">Name</div>
                          <div className="col-span-5">Email</div>
                          <div className="col-span-2">Role</div>
                          <div className="col-span-1">Actions</div>
                        </div>
                        <div className="divide-y">
                          {mockAdmins.map((admin) => (
                              <div key={admin.id} className="grid grid-cols-12 gap-4 p-4 items-center">
                                <div className="col-span-4">{admin.name}</div>
                                <div className="col-span-5 text-text-muted">{admin.email}</div>
                                <div className="col-span-2">{admin.role}</div>
                                <div className="col-span-1">
                                  <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                      onClick={() => handleDeleteAdmin(admin.id)}
                                      disabled={admin.role === "Super Admin" || isLoading}
                                  >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-trash-2"
                                    >
                                      <path d="M3 6h18" />
                                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                      <line x1="10" x2="10" y1="11" y2="17" />
                                      <line x1="14" x2="14" y1="11" y2="17" />
                                    </svg>
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium mb-4">Add New Administrator</h3>
                      <form onSubmit={handleAddAdmin} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="adminName">Name</Label>
                            <Input
                                id="adminName"
                                name="name"
                                value={newAdminForm.name}
                                onChange={handleNewAdminChange}
                                required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="adminEmail">Email</Label>
                            <Input
                                id="adminEmail"
                                name="email"
                                type="email"
                                value={newAdminForm.email}
                                onChange={handleNewAdminChange}
                                required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="adminPassword">Password</Label>
                            <Input
                                id="adminPassword"
                                name="password"
                                type="password"
                                value={newAdminForm.password}
                                onChange={handleNewAdminChange}
                                required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="adminConfirmPassword">Confirm Password</Label>
                            <Input
                                id="adminConfirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={newAdminForm.confirmPassword}
                                onChange={handleNewAdminChange}
                                required
                            />
                          </div>
                        </div>
                        <Button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-secondary">
                          {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding Admin...
                              </>
                          ) : (
                              <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Add Admin
                              </>
                          )}
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
  )
}
