"use client"

import type React from "react"

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
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [businessInfo, setBusinessInfo] = useState({
    name: "Laundry-Van",
    email: "contact@laundryvan.com",
    phone: "+1 (555) 123-4567",
    address: "Address 123-4567",
    website: "https://laundryvan.com",
    description: "Premium laundry services delivered to your doorstep.",
  })

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
            <TabsTrigger value="payment">Payment Settings</TabsTrigger>
            <TabsTrigger value="notification">Notification Settings</TabsTrigger>
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
                      <Label htmlFor="deliveryFee">Delivery Fee (AED)</Label>
                      <Input
                        id="deliveryFee"
                        name="deliveryFee"
                        type="number"
                        value={paymentSettings.deliveryFee}
                        onChange={handlePaymentSettingChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold (AED)</Label>
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
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
