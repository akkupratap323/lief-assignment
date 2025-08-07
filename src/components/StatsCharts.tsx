'use client'

import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface WeeklyHours {
  userId: string
  userName: string
  totalHours: number
}

interface DashboardStats {
  avgHoursPerDay: number
  dailyClockIns: number
  weeklyHoursByStaff: WeeklyHours[]
}

interface StatsChartsProps {
  stats?: DashboardStats
}

export default function StatsCharts({ stats }: StatsChartsProps) {
  if (!stats || !stats.weeklyHoursByStaff) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Hours by Staff</CardTitle>
            <CardDescription>
              Total hours worked by each staff member in the last week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Loading chart data...
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hour Distribution</CardTitle>
            <CardDescription>
              Breakdown of staff by weekly hour categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Loading chart data...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  const weeklyHoursData = {
    labels: stats.weeklyHoursByStaff.map(staff => staff.userName),
    datasets: [
      {
        label: 'Weekly Hours',
        data: stats.weeklyHoursByStaff.map(staff => staff.totalHours),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }

  const weeklyHoursOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Hours by Staff Member',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
        },
      },
    },
  }

  const staffCategories = stats.weeklyHoursByStaff.map(staff => {
    if (staff.totalHours >= 40) return 'Full-time (40+ hrs)'
    if (staff.totalHours >= 20) return 'Part-time (20-39 hrs)'
    return 'Minimal (< 20 hrs)'
  })

  const categoryCount = staffCategories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const distributionData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        label: 'Staff Distribution',
        data: Object.values(categoryCount),
        backgroundColor: [
          'rgba(34, 197, 94, 0.5)',
          'rgba(249, 115, 22, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  }

  const distributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Staff Hour Distribution',
      },
    },
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Hours by Staff</CardTitle>
          <CardDescription>
            Total hours worked by each staff member in the last week
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.weeklyHoursByStaff.length > 0 ? (
            <Bar data={weeklyHoursData} options={weeklyHoursOptions} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No data available for the past week
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hour Distribution</CardTitle>
          <CardDescription>
            Breakdown of staff by weekly hour categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.weeklyHoursByStaff.length > 0 ? (
            <Doughnut data={distributionData} options={distributionOptions} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              No data available for distribution analysis
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}