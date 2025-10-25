'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EmployeeStatusCard from '@/components/EmployeeStatusCard'
import ProjectProgressBar from '@/components/ProjectProgressBar'
import MaterialsTracker from '@/components/MaterialsTracker'
import { Employee } from '@/types/employee'
import { Project } from '@/types/project'
import { Material } from '@/types/material'

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth/signin')
        return
      }
      
      try {
        const [employeeRes, projectRes, materialRes] = await Promise.all([
          fetch('/api/employees'),
          fetch('/api/projects'),
          fetch('/api/materials')
        ])

        if (!employeeRes.ok || !projectRes.ok || !materialRes.ok) {
          throw new Error('Failed to fetch data')
        }

        const [employeeData, projectData, materialData] = await Promise.all([
          employeeRes.json(),
          projectRes.json(),
          materialRes.json()
        ])

        setEmployees(employeeData)
        setProjects(projectData)
        setMaterials(materialData)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <section className="col-span-1 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Employee Status</h2>
          {employees.slice(0, 3).map((employee) => (
            <EmployeeStatusCard key={employee.id} employee={employee} />
          ))}
        </section>

        <section className="col-span-1 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Active Projects</h2>
          {projects.slice(0, 3).map((project) => (
            <ProjectProgressBar key={project.id} project={project} />
          ))}
        </section>

        <section className="col-span-1 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Materials Overview</h2>
          <MaterialsTracker materials={materials} />
        </section>
      </div>

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={() => router.push('/employees')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          View All Employees
        </button>
        <button
          onClick={() => router.push('/projects')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          View All Projects
        </button>
      </div>
    </main>
  )
}