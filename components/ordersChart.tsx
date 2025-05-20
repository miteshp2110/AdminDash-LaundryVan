"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function OrderLineChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch("http://localhost:5000/admin/orders/daily-order-count") 
        const result = await response.json()

        if (result.success && chartRef.current) {
          const ctx = chartRef.current.getContext("2d")

          if (ctx) {
            if (chartInstance.current) chartInstance.current.destroy()

            const labels = result.chartData.map((item: any) => item.date)
            const data = result.chartData.map((item: any) => item.total_orders) 

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

    fetchChartData()

    return () => {
      if (chartInstance.current) chartInstance.current.destroy()
    }
  }, [])

  return <canvas ref={chartRef} height={300} />
}
