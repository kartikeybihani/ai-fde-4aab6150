'use client'

import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import EmployeeStatusCard from '@/components/EmployeeStatusCard'
import ProjectProgressBar from '@/components/ProjectProgressBar'
import MaterialsTracker from '@/components/MaterialsTracker'
import { Employee } from '@/types/employee'
import { Project } from '@/types/project'
import { Material } from '@/types/material'
import { fetchEmployees, fetchProjects, fetchMaterials } from '@/lib/api-client'

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)
        const [employeeData, projectData, materialData] = await Promise.all([
          fetchEmployees(),
          fetchProjects(),
          fetchMaterials()
        ])
        
        setEmployees(employeeData)
        setProjects(projectData)
        setMaterials(materialData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()

    const projectsSubscription = supabase
      .channel('project-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, 
        payload => {
          setProjects(current => current.map(project => 
            project.id === payload.new.id ? { ...project, ...payload.new } : project
          ))
        }
      )
      .subscribe()

    return () => {
      projectsSubscription.unsubscribe()
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-full lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Project Progress</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projects}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Employee Status</h2>
          <div className="space-y-4">
            {employees.map(employee => (
              <EmployeeStatusCard key={employee.id} employee={employee} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Active Projects</h2>
          {projects.map(project => (
            <ProjectProgressBar key={project.id} project={project} />
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Materials Inventory</h2>
          <MaterialsTracker materials={materials} />
        </div>
      </div>
    </div>
  )
}