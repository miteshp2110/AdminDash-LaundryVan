
"use client"

import { useEffect, useState, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Download, BarChart3, PieChartIcon, TrendingUp, FileText, CalendarIcon, Loader2 } from "lucide-react"
import { LineChart, BarChart, OrderLineChart, DriverLineChart, DriverPieChart } from "@/components/charts"
import { format, isSameDay, isSameMonth, isSameYear, getMonth, getYear, startOfYear, endOfYear } from "date-fns"

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Order {
  id: number;
  user_id: number;
  address: number;
  van_id: number;
  order_status: number;
  pickup_time: string;
  pickup_date: string;
  delivery_date: string;
  delivery_time: string;
  promotion_id?: number;
  payment_mode: string;
  payment_status: number;
  order_total: string;
  createdAt: string;
  created_at:string;
  quick_order: number;
  region_name: string;
  service_names: string;
  service_name: string;
}

export default function ReportsPage() {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Raw data from API (fetched only once)
  const [rawOrders, setRawOrders] = useState<Order[]>([]);

  // Filter controls state
  const [filterType, setFilterType] = useState("daily"); // daily, monthly, yearly
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState(getMonth(new Date()));
  const [selectedYear, setSelectedYear] = useState(getYear(new Date()));

  // --- DATA FETCHING (ONCE ON MOUNT) ---
  useEffect(() => {
    const fetchAllData = async () => {
      if (!baseUrl) {
        setError("Backend URL is not configured.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const ordersRes = await fetch(`${baseUrl}/admin/orders`);
        const ordersData = await ordersRes.json();
        
        // Set raw data
        // if (ordersData.success) {
        //   setRawOrders(ordersData.data || []);
        // }
        if (ordersData.success) {
          setRawOrders(
            (ordersData.data || []).map((o: any) => ({
              ...o,
              service_name: o.service_name ?? o.service_names ?? "", // ✅ never "Unknown Service" here
            }))
          );
        }
        

      } catch (err: any) {
        console.error("Error fetching initial data:", err);
        setError(err.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // --- FRONTEND FILTERING LOGIC ---
  const filteredOrders = useMemo(() => {
    if (!rawOrders.length) return [];

    switch (filterType) {
      case "daily":
        return rawOrders.filter(order => 
          selectedDate && order.createdAt && isSameDay(new Date(order.createdAt), selectedDate)
        );
      case "monthly":
        return rawOrders.filter(order =>
          order.createdAt && 
          isSameMonth(new Date(order.createdAt), new Date(selectedYear, selectedMonth))
        );
      case "yearly":
        return rawOrders.filter(order =>
          order.createdAt && isSameYear(new Date(order.createdAt), new Date(selectedYear, 0))
        );
      default:
        return rawOrders;
    }
  }, [rawOrders, filterType, selectedDate, selectedMonth, selectedYear]);

  // --- DERIVED STATE & CALCULATIONS ---
  const totalRevenue = useMemo(() => 
    filteredOrders.reduce((sum, order) => sum + parseFloat(order.order_total || "0"), 0), 
    [filteredOrders]
  );
  
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalCustomers = useMemo(() => 
    new Set(filteredOrders.map(order => order.user_id)).size, 
    [filteredOrders]
  );

  // Derive service revenue data from orders (assuming quick_order is a service type)
  // const serviceRevenueData = useMemo(() => {
  //   const serviceRevenueMap: { [key: string]: number } = {};
    
  //   filteredOrders.forEach(order => {
  //     // Categorize services based on order properties
  //     const serviceName = order.quick_order === 1 ? 'Quick Order' : 'Regular Order';
  //     const revenue = parseFloat(order.order_total || "0");
  //     serviceRevenueMap[serviceName] = (serviceRevenueMap[serviceName] || 0) + revenue;
  //   });

  //   const totalServiceRevenue = Object.values(serviceRevenueMap).reduce((sum: number, amount: number) => sum + amount, 0);
    
  //   return Object.entries(serviceRevenueMap).map(([name, amount]) => ({
  //     name,
  //     amount: amount as number,
  //     percentage: totalServiceRevenue > 0 ? (((amount as number) / totalServiceRevenue) * 100).toFixed(1) : "0"
  //   }));
  // }, [filteredOrders]);

  const serviceRevenueData = useMemo(() => {
    const serviceRevenueMap: { [key: string]: number } = {};
  
    filteredOrders.forEach(order => {
      const revenue = parseFloat(order.order_total || "0");
      const services = (order.service_name || order.service_names || "")
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0); // ✅ remove empty values
  
      if (services.length > 0) {
        const splitRevenue = revenue / services.length; // ✅ split evenly
        services.forEach(service => {
          serviceRevenueMap[service] = (serviceRevenueMap[service] || 0) + splitRevenue;
        });
      }
    });
  
    const totalServiceRevenue = Object.values(serviceRevenueMap).reduce(
      (sum, amount) => sum + amount,
      0
    );
  
    return Object.entries(serviceRevenueMap).map(([name, amount]) => ({
      name,
      amount,
      percentage:
        totalServiceRevenue > 0
          ? ((amount / totalServiceRevenue) * 100).toFixed(1)
          : "0",
    }));
  }, [filteredOrders]);
  
  
  


  // Process revenue by region data from orders
  const revenueByRegionData = useMemo(() => {
    const regionRevenueMap: { [key: string]: number } = {};
    
    filteredOrders.forEach(order => {
      const regionName = order.region_name || 'Unknown Region';
      const revenue = parseFloat(order.order_total || "0");
      regionRevenueMap[regionName] = (regionRevenueMap[regionName] || 0) + revenue;
    });

    const totalRegionRevenue = Object.values(regionRevenueMap).reduce((sum: number, amount: number) => sum + amount, 0);
    
    return Object.entries(regionRevenueMap).map(([region, revenue]) => ({
      region,
      revenue: revenue as number,
      percentage: totalRegionRevenue > 0 ? (((revenue as number) / totalRegionRevenue) * 100).toFixed(1) : "0"
    }));
  }, [filteredOrders]);

  // Driver analytics from orders (using van_id as driver proxy)
  const driverAnalytics = useMemo(() => {
    const driverMap: { [key: number]: { orders: number; revenue: number; regions: Set<string> } } = {};
    
    filteredOrders.forEach(order => {
      const vanId = order.van_id;
      if (!driverMap[vanId]) {
        driverMap[vanId] = { orders: 0, revenue: 0, regions: new Set() };
      }
      driverMap[vanId].orders += 1;
      driverMap[vanId].revenue += parseFloat(order.order_total || "0");
      driverMap[vanId].regions.add(order.region_name || 'Unknown');
    });

    return {
      totalDrivers: Object.keys(driverMap).length,
      driverPerformance: Object.entries(driverMap).map(([vanId, data]) => ({
        driverId: vanId,
        orders: data.orders,
        revenue: data.revenue,
        regions: Array.from(data.regions)
      }))
    };
  }, [filteredOrders]);

  // Driver by region data
  const driversByRegionData = useMemo(() => {
    const regionDriverMap: { [key: string]: Set<number> } = {};
    
    filteredOrders.forEach(order => {
      const regionName = order.region_name || 'Unknown Region';
      if (!regionDriverMap[regionName]) {
        regionDriverMap[regionName] = new Set();
      }
      regionDriverMap[regionName].add(order.van_id);
    });

    return Object.entries(regionDriverMap).map(([region, drivers]) => ({
      region,
      driverCount: drivers.size
    }));
  }, [filteredOrders]);

  // Generate year options from data
  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    rawOrders.forEach(order => {
      if (order.createdAt) {
        years.add(getYear(new Date(order.createdAt)));
      }
    });
    return Array.from(years).sort((a: number, b: number) => b - a);
  }, [rawOrders]);

  const monthOptions = [
    {label: 'January', value: 0}, {label: 'February', value: 1}, {label: 'March', value: 2},
    {label: 'April', value: 3}, {label: 'May', value: 4}, {label: 'June', value: 5},
    {label: 'July', value: 6}, {label: 'August', value: 7}, {label: 'September', value: 8},
    {label: 'October', value: 9}, {label: 'November', value: 10}, {label: 'December', value: 11},
  ];

  // Helper function to format numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-AE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Reports & Analytics</h1>
            <p className="text-text-muted mt-2">View detailed reports and analytics for your business</p>
          </div>
          
          {/* --- FILTER CONTROLS UI --- */}
          <div className="flex items-center space-x-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            {filterType === 'daily' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-[240px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            )}

            {filterType === 'monthly' && (
              <>
                <Select value={String(selectedMonth)} onValueChange={(val) => setSelectedMonth(Number(val))}>
                   <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                   <SelectContent>
                     {monthOptions.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}
                   </SelectContent>
                </Select>
                 <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
                    <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((y: number) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                    </SelectContent>
                 </Select>
              </>
            )}
            
             {filterType === 'yearly' && (
                <Select value={String(selectedYear)} onValueChange={(val) => setSelectedYear(Number(val))}>
                  <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y: number) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                  </SelectContent>
               </Select>
             )}

            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center p-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-text-muted">Loading data...</p>
            </div>
          </div>
        )}
        
        {error && <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">{error}</div>}
        
        {!loading && !error && (
        <>
            {/* --- KPI CARDS --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-muted text-sm">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-text-dark mt-1">AED {formatNumber(totalRevenue)}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-brand-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-muted text-sm">Total Orders</p>
                      <h3 className="text-2xl font-bold text-text-dark mt-1">{totalOrders}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                      <FileText className="h-6 w-6 text-brand-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-muted text-sm">Average Order Value</p>
                      <h3 className="text-2xl font-bold text-text-dark mt-1">AED {formatNumber(averageOrderValue)}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-brand-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-muted text-sm">Total Customers</p>
                      <h3 className="text-2xl font-bold text-text-dark mt-1">{totalCustomers}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                      <PieChartIcon className="h-6 w-6 text-brand-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* --- TABS SECTION --- */}
            <Tabs defaultValue="revenue" className="space-y-4">
              <TabsList>
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="drivers">Drivers</TabsTrigger>
              </TabsList>

              {/* --- REVENUE TAB --- */}
              <TabsContent value="revenue">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Revenue Overview</CardTitle>
                      <CardDescription>
                        {filterType === "daily" && selectedDate && `Daily revenue for ${format(selectedDate, "PPP")}`}
                        {filterType === "monthly" && `Monthly revenue for ${monthOptions[selectedMonth]?.label} ${selectedYear}`}
                        {filterType === "yearly" && `Yearly revenue for ${selectedYear}`}
                      </CardDescription>
                    </CardHeader>
                     <CardContent>
                       <LineChart 
                         data={filteredOrders} 
                         filterType={filterType}
                         selectedDate={selectedDate}
                         selectedMonth={selectedMonth}
                         selectedYear={selectedYear}
                       />
                     </CardContent>
                  </Card>

                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Revenue by Service</CardTitle>
                      <CardDescription>Breakdown of revenue by service type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BarChart 
                        data={serviceRevenueData}
                        filterType={filterType}
                        timeRange={filterType}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Revenue Details Section */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Revenue Details</CardTitle>
                    <CardDescription>Detailed breakdown of revenue sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Revenue by Service Type */}
                      <div>
                        <h4 className="text-lg font-medium mb-4">Revenue by Service Type</h4>
                        {serviceRevenueData.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {serviceRevenueData.map((service, index) => (
                              <Card key={service.name || index} className="border-none shadow-none">
                                <CardContent className="p-4">
                                  <p className="text-text-muted text-sm">{service.name}</p>
                                  <h4 className="text-xl font-bold text-text-dark mt-1">AED {formatNumber(service.amount)}</h4>
                                  <div className="mt-2">
                                    <div className="h-2 w-full bg-bg-light rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-brand-primary rounded-full"
                                        style={{ width: `${service.percentage}%` }}
                                      />
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">{service.percentage}% of total</p>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-text-muted">
                            No service revenue data available for the selected time range
                          </div>
                        )}
                      </div>

                      {/* Revenue by Region */}
                      <div>
                        <h4 className="text-lg font-medium mb-4">Revenue by Region</h4>
                        {revenueByRegionData.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                              <thead>
                                <tr className="border-b border-line-light">
                                  <th className="text-left py-3 px-4 font-medium text-text-dark">Region</th>
                                  <th className="text-left py-3 px-4 font-medium text-text-dark">Revenue</th>
                                  <th className="text-left py-3 px-4 font-medium text-text-dark">% of Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {revenueByRegionData.map((row, index) => (
                                  <tr key={row.region || index} className="border-b border-line-light">
                                    <td className="py-3 px-4">{row.region || 'Unknown'}</td>
                                    <td className="py-3 px-4 font-medium">AED {formatNumber(row.revenue)}</td>
                                    <td className="py-3 px-4">{row.percentage}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="p-4 text-center text-text-muted border border-dashed border-line-medium rounded-md">
                            No regional revenue data available for the selected time range
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* --- ORDERS TAB --- */}
              <TabsContent value="orders">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Analytics</CardTitle>
                      <CardDescription>
                        {filterType === "daily" && selectedDate && `Order analysis for ${format(selectedDate, "PPP")}`}
                        {filterType === "monthly" && `Order analysis for ${monthOptions[selectedMonth]?.label} ${selectedYear}`}
                        {filterType === "yearly" && `Order analysis for ${selectedYear}`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full relative">
                        <OrderLineChart 
                          data={filteredOrders}
                          filterType={filterType}
                          timeRange={filterType}
                          selectedDate={selectedDate}
                          selectedMonth={selectedMonth}
                          selectedYear={selectedYear}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Status Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Status Breakdown</CardTitle>
                      <CardDescription>Distribution of orders by status</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[0, 1, 2, 3, 4].map(status => {
                          const statusOrders = filteredOrders.filter(order => order.order_status === status);
                          const statusName = {
                            0: 'Pending',
                            1: 'Confirmed',
                            2: 'In Progress',
                            3: 'Delivered',
                            4: 'Completed'
                          }[status] || `Status ${status}`;
                          
                          return (
                            <div key={status} className="p-4 border rounded-lg">
                              <p className="text-text-muted text-sm">{statusName}</p>
                              <h4 className="text-2xl font-bold text-text-dark mt-1">{statusOrders.length}</h4>
                              <p className="text-xs text-text-muted mt-1">
                                {totalOrders > 0 ? ((statusOrders.length / totalOrders) * 100).toFixed(1) : 0}% of total
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* --- DRIVERS TAB --- */}
              <TabsContent value="drivers">
                <div className="grid gap-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-text-muted text-sm">Active Drivers</p>
                            <h3 className="text-2xl font-bold text-text-dark mt-1">{driverAnalytics.totalDrivers}</h3>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-brand-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-text-muted text-sm">Avg Orders/Driver</p>
                            <h3 className="text-2xl font-bold text-text-dark mt-1">
                              {driverAnalytics.totalDrivers > 0 ? 
                                (totalOrders / driverAnalytics.totalDrivers).toFixed(1) : 0}
                            </h3>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-brand-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-text-muted text-sm">Avg Revenue/Driver</p>
                            <h3 className="text-2xl font-bold text-text-dark mt-1">
                              AED {driverAnalytics.totalDrivers > 0 ? 
                                formatNumber(totalRevenue / driverAnalytics.totalDrivers) : "0.00"}
                            </h3>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-brand-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-text-muted text-sm">Regions Covered</p>
                            <h3 className="text-2xl font-bold text-text-dark mt-1">{driversByRegionData.length}</h3>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-bg-accent-light flex items-center justify-center">
                            <PieChartIcon className="h-6 w-6 text-brand-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Driver Performance Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Driver Performance</CardTitle>
                      <CardDescription>Performance metrics for each driver</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {driverAnalytics.driverPerformance.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[600px]">
                            <thead>
                              <tr className="border-b border-line-light">
                                <th className="text-left py-3 px-4 font-medium text-text-dark">Driver ID (Van)</th>
                                <th className="text-left py-3 px-4 font-medium text-text-dark">Orders</th>
                                <th className="text-left py-3 px-4 font-medium text-text-dark">Revenue</th>
                                <th className="text-left py-3 px-4 font-medium text-text-dark">Regions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {driverAnalytics.driverPerformance
                                .sort((a, b) => b.revenue - a.revenue)
                                .slice(0, 10)
                                .map((driver, index) => (
                                <tr key={driver.driverId} className="border-b border-line-light">
                                  <td className="py-3 px-4">Van #{driver.driverId}</td>
                                  <td className="py-3 px-4">{driver.orders}</td>
                                  <td className="py-3 px-4 font-medium">AED {formatNumber(driver.revenue)}</td>
                                  <td className="py-3 px-4">{driver.regions.join(', ')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-4 text-center text-text-muted border border-dashed border-line-medium rounded-md">
                          No driver performance data available for the selected time range
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Drivers by Region */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Drivers by Region</CardTitle>
                      <CardDescription>Distribution of active drivers across regions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {driversByRegionData.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {driversByRegionData.map((regionData, index) => (
                            <div key={regionData.region || index} className="p-4 border rounded-lg">
                              <p className="text-text-muted text-sm">{regionData.region}</p>
                              <h4 className="text-2xl font-bold text-text-dark mt-1">{regionData.driverCount}</h4>
                              <p className="text-xs text-text-muted mt-1">
                                {driverAnalytics.totalDrivers > 0 ? 
                                  ((regionData.driverCount / driverAnalytics.totalDrivers) * 100).toFixed(1) : 0}% of total drivers
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-text-muted border border-dashed border-line-medium rounded-md">
                          No driver region data available for the selected time range
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
        </>
        )}
      </div>
    </DashboardLayout>
  )
}