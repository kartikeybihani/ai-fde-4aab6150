'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Employee } from '@/types/employee'
import EmployeeStatusCard from '@/components/EmployeeStatusCard'
import { apiClient } from '@/lib/api-client'

const EmployeesPage = () => {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true)
        const response = await apiClient.get('/api/employees')
        setEmployees(response.data)
      } catch (err) {
        setError('Failed to fetch employees. Please try again later.')
        console.error('Error fetching employees:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleStatusUpdate = async (employeeId: string, newStatus: string) => {
    try {
      await apiClient.put(`/api/employees/${employeeId}/status`, { status: newStatus })
      setEmployees(prev =>
        prev.map(emp =>
          emp.id === employeeId ? { ...emp, status: newStatus } : emp
        )
      )
    } catch (err) {
      console.error('Error updating employee status:', err)
      setError('Failed to update employee status.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
        <button
          onClick={() => router.push('/employees/new')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <EmployeeStatusCard
            key={employee.id}
            employee={employee}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No employees found.</p>
        </div>
      )}
    </div>
  )
}

export default EmployeesPage