

"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { format, getDay, getMonth, eachDayOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfYear, endOfYear, parseISO, isValid } from 'date-fns';

// Register all Chart.js components
Chart.register(...registerables)

// --- Helper for number formatting ---
const formatCurrency = (value: number | string) => `AED ${Number(value).toFixed(2)}`;

// --- Props Interfaces ---
interface ChartDataProps {
  data: any[];
  filterType: 'daily' | 'monthly' | 'yearly' | string;
  selectedDate?: Date;
  selectedMonth?: number;
  selectedYear?: number;
  timeRange?: string;
  filteredData?: any[];
}

interface ServiceChartProps {
  data: any[];
  filterType?: string;
  timeRange?: string;
}

interface StaticChartProps {
  data?: any[];
  filterType?: string;
  timeRange?: string;
  selectedDate?: Date;
  selectedMonth?: number;
  selectedYear?: number;
}

// Helper function to safely parse dates
const safeParseDate = (dateString: string | Date): Date | null => {
  if (!dateString) return null;
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return isValid(date) ? date : null;
  } catch {
    return null;
  }
};

// ============================================================================
// 1. REVENUE LINE CHART
// ============================================================================
export function LineChart({ data, filterType, selectedDate, selectedMonth, selectedYear }: ChartDataProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    
    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    let labels: string[] = [];
    let chartData: number[] = [];

    // Process data based on filter type
    if (filterType === 'daily') {
      // Show hourly data for the selected day
      const hours = Array.from({ length: 24 }, (_, i) => i);
      labels = hours.map(hour => `${hour.toString().padStart(2, '0')}:00`);
      chartData = new Array(24).fill(0);

      if (data && data.length > 0) {
        data.forEach(order => {
          const orderDate = safeParseDate(order.created_at || order.createdAt);
          if (orderDate) {
            const hour = orderDate.getHours();
            chartData[hour] += parseFloat(order.total_amount || order.order_total || 0);
          }
        });
      }
    } else if (filterType === 'monthly') {
      // Show daily data for the selected month
      const year = selectedYear || new Date().getFullYear();
      const month = selectedMonth !== undefined ? selectedMonth : new Date().getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      chartData = new Array(daysInMonth).fill(0);

      if (data && data.length > 0) {
        data.forEach(order => {
          const orderDate = safeParseDate(order.created_at || order.createdAt);
          if (orderDate) {
            const day = orderDate.getDate();
            if (day >= 1 && day <= daysInMonth) {
              chartData[day - 1] += parseFloat(order.total_amount || order.order_total || 0);
            }
          }
        });
      }
    } else { // yearly
      // Show monthly data for the selected year
      const months = Array.from({ length: 12 }, (_, i) => i);
      labels = months.map(month => format(new Date(2023, month), 'MMM'));
      chartData = new Array(12).fill(0);

      if (data && data.length > 0) {
        data.forEach(order => {
          const orderDate = safeParseDate(order.created_at || order.createdAt);
          if (orderDate) {
            const monthIndex = orderDate.getMonth();
            chartData[monthIndex] += parseFloat(order.total_amount || order.order_total || 0);
          }
        });
      }
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Revenue",
          data: chartData,
          borderColor: "#0040FF",
          backgroundColor: "rgba(0, 64, 255, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#0040FF",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Revenue: ${formatCurrency(context.parsed.y)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { 
              callback: (value) => formatCurrency(value as number),
              maxTicksLimit: 6
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { 
            grid: { display: false },
            ticks: { maxTicksLimit: 10 }
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, filterType, selectedDate, selectedMonth, selectedYear]);

  return <canvas ref={chartRef} style={{ height: '300px', width: '100%' }} />;
}

// ============================================================================
// 2. SERVICE REVENUE BAR CHART
// ============================================================================
export function BarChart({ data }: ServiceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    let labels: string[] = [];
    let chartData: number[] = [];

    if (data && data.length > 0) {
      labels = data.map((item: any) => item.name || item.service_name || 'Unknown');
      chartData = data.map((item: any) => parseFloat(item.amount || item.total_revenue || 0));
    } else {
      labels = ['No Data'];
      chartData = [0];
    }

    const colors = ["#0040FF", "#00C851", "#FF4444", "#FF8800", "#AA66CC", "#33B5E5"];

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Revenue by Service",
          data: chartData,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: colors.slice(0, labels.length),
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${formatCurrency(context.parsed.y)}`
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true,
            ticks: { 
              callback: (value) => formatCurrency(value as number),
              maxTicksLimit: 6
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { 
            grid: { display: false },
            ticks: {
              maxRotation: 45,
              minRotation: 0
            }
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef} style={{ height: '300px', width: '100%' }} />;
}

// ============================================================================
// 3. ORDER COUNT LINE CHART
// ============================================================================
export function OrderLineChart({ data, filterType, selectedDate, selectedMonth, selectedYear }: StaticChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    let labels: string[] = [];
    let chartData: number[] = [];

    // Process data similar to revenue chart
    if (filterType === 'daily') {
      // Show hourly order counts
      const hours = Array.from({ length: 24 }, (_, i) => i);
      labels = hours.map(hour => `${hour.toString().padStart(2, '0')}:00`);
      chartData = new Array(24).fill(0);

      if (data && data.length > 0) {
        data.forEach(order => {
          const orderDate = safeParseDate(order.created_at || order.createdAt);
          if (orderDate) {
            const hour = orderDate.getHours();
            chartData[hour]++;
          }
        });
      }
    } else if (filterType === 'monthly') {
      // Show daily order counts for the month
      const year = selectedYear || new Date().getFullYear();
      const month = selectedMonth !== undefined ? selectedMonth : new Date().getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      chartData = new Array(daysInMonth).fill(0);

      if (data && data.length > 0) {
        data.forEach(order => {
          const orderDate = safeParseDate(order.created_at || order.createdAt);
          if (orderDate) {
            const day = orderDate.getDate();
            if (day >= 1 && day <= daysInMonth) {
              chartData[day - 1]++;
            }
          }
        });
      }
    } else { // yearly
      // Show monthly order counts
      const months = Array.from({ length: 12 }, (_, i) => i);
      labels = months.map(month => format(new Date(2023, month), 'MMM'));
      chartData = new Array(12).fill(0);

      if (data && data.length > 0) {
        data.forEach(order => {
          const orderDate = safeParseDate(order.created_at || order.createdAt);
          if (orderDate) {
            const monthIndex = orderDate.getMonth();
            chartData[monthIndex]++;
          }
        });
      }
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Order Count",
          data: chartData,
          borderColor: "#00C851",
          backgroundColor: "rgba(0, 200, 81, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#00C851",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `Orders: ${context.parsed.y}`
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              maxTicksLimit: 8
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { 
            grid: { display: false },
            ticks: { maxTicksLimit: 10 }
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, filterType, selectedDate, selectedMonth, selectedYear]);

  return <canvas ref={chartRef} style={{ height: '300px', width: '100%' }} />;
}

// ============================================================================
// 4. DRIVER/VAN COUNT LINE CHART
// ============================================================================
export function DriverLineChart({ filterType }: StaticChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Mock data for driver analytics (replace with actual API data)
    const mockRegions = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah'];
    const mockDriverCounts = [45, 32, 28, 15, 12];

    const labels = mockRegions;
    const chartData = mockDriverCounts;

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [{
          label: "Active Drivers",
          data: chartData,
          borderColor: "#FF8800",
          backgroundColor: "rgba(255, 136, 0, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#FF8800",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { 
          legend: { display: true, position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => `Drivers: ${context.parsed.y}`
            }
          }
        },
        scales: {
          y: { 
            beginAtZero: true,
            ticks: {
              stepSize: 5,
              maxTicksLimit: 8
            },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          x: { 
            grid: { display: false }
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [filterType]);

  return <canvas ref={chartRef} style={{ height: '300px', width: '100%' }} />;
}

// ============================================================================
// 5. DRIVER/VAN COUNT PIE CHART
// ============================================================================
export function DriverPieChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    // Mock data for regional distribution (replace with actual API data)
    const mockRegions = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah'];
    const mockDriverCounts = [45, 32, 28, 15, 12];

    const labels = mockRegions;
    const chartData = mockDriverCounts;
    const colors = ["#0040FF", "#00C851", "#FF4444", "#FF8800", "#AA66CC"];

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data: chartData,
          backgroundColor: colors,
          borderColor: "#fff",
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = chartData.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '60%',
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} style={{ height: '300px', width: '100%' }} />;
}