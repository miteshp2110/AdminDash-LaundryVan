"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function LineChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/orders/line-chart") // Update this path if your API route differs
        const result = await response.json()

        if (result.success && chartRef.current) {
          const ctx = chartRef.current.getContext("2d")

          if (ctx) {
            if (chartInstance.current) chartInstance.current.destroy()

            const labels = result.chartData.map((item: any) => item.date)
            const data = result.chartData.map((item: any) => item.total_revenue)

            chartInstance.current = new Chart(ctx, {
              type: "line",
              data: {
                labels,
                datasets: [
                  {
                    label: "Revenue",
                    data,
                    borderColor: "#0040FF",
                    backgroundColor: "rgba(230, 236, 255, 1)",
                    tension: 0.4,
                    fill: true,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.05)",
                    },
                    ticks: {
                      callback: (value) => `AED ${value}`,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              },
            })
          }
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      }
    }

    fetchChartData()

    return () => {
      if (chartInstance.current) chartInstance.current.destroy()
    }
  }, [])

  return <canvas ref={chartRef} height={300} />
}


export function BarChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:5000/admin/orders/bar-graph")
        const result = await response.json()

        if (result.success && chartRef.current) {
          const ctx = chartRef.current.getContext("2d")
          if (!ctx) return

          // Extract labels and data from API response
          const labels = result.data.map((item: any) => item.service_name)
          const data = result.data.map((item: any) => item.total_orders)

          // Destroy existing chart if present
          if (chartInstance.current) {
            chartInstance.current.destroy()
          }

          // Create new chart with dynamic data
          chartInstance.current = new Chart(ctx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Orders",
                  data: data,
                  backgroundColor: [
                    "#ED5050",
                    "#E6F7FF",
                    "#F39739",
                    "#219653",
                    "#5B8DEF",
                    "#F25F4C",
                  ].slice(0, labels.length), // use as many colors as needed
                  borderRadius: 4,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(0, 0, 0, 0.05)",
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            },
          })
        }
      } catch (error) {
        console.error("Failed to fetch orders count by service:", error)
      }
    }

    fetchData()

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return <canvas ref={chartRef} height={300} />
}

//order history chart
export function OrderLineChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    const fetchChartData2 = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/orders/daily-order-count") 
        const result = await response.json()

        if (result.success && chartRef.current) {
          const ctx = chartRef.current.getContext("2d")

          if (ctx) {
            if (chartInstance.current) chartInstance.current.destroy()

            const labels = result.data.map((item: any) => item.date)
            const data = result.data.map((item: any) => item.total_orders)

            chartInstance.current = new Chart(ctx, {
              type: "line",
              data: {
                labels,
                datasets: [
                  {
                    label: "Orders per Day",
                    data,
                    borderColor: "#0040FF",
                    backgroundColor: "rgba(230, 236, 255, 1)",
                    tension: 0.4,
                    fill: true,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.05)",
                    },
                    ticks: {
                      callback: (value) => `${value}`,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              },
            })
          }
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      }
    }

    fetchChartData2()

    return () => {
      if (chartInstance.current) chartInstance.current.destroy()
    }
  }, [])

  return <canvas ref={chartRef} height={300} />
}

export function DriverLineChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/regions/van-count")
        const result = await response.json()

        if (result.success && chartRef.current) {
          const ctx = chartRef.current.getContext("2d")

          if (ctx) {
            if (chartInstance.current) chartInstance.current.destroy()

            const labels = result.data.map((item: any) => item.region_name)
            const data = result.data.map((item: any) => item.van_count)

            chartInstance.current = new Chart(ctx, {
              type: "line",
              data: {
                labels,
                datasets: [
                  {
                    label: "Total Vans per Region",
                    data,
                    borderColor: "#219653", // green
                    backgroundColor: "rgba(33, 150, 83, 0.1)",
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 6,
                  },
                ],
              },
              options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.05)",
                    },
                    ticks: {
                      callback: (value) => `${value}`,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              },
            })
          }
        }
      } catch (error) {
        console.error("Failed to fetch van count by region:", error)
      }
    }

    fetchChartData()

    return () => {
      if (chartInstance.current) chartInstance.current.destroy()
    }
  }, [])

  return <canvas ref={chartRef} height={300} />
}

