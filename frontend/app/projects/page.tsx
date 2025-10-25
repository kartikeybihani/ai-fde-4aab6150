'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectProgressBar } from '@/components/ProjectProgressBar'
import { MaterialsTracker } from '@/components/MaterialsTracker'
import { Project } from '@/types/project'
import { apiClient } from '@/lib/api-client'

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.get('/api/projects')
        setProjects(response.data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load projects')
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

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
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projects Overview</h1>
        <button
          onClick={() => router.push('/projects/new')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">{project.name}</h2>
            <div className="mb-4">
              <ProjectProgressBar progress={project.progress} />
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Status: {project.status}</p>
              <p className="text-gray-600">
                Due Date: {new Date(project.dueDate).toLocaleDateString()}
              </p>
            </div>
            <MaterialsTracker projectId={project.id} />
            <button
              onClick={() => router.push(`/projects/${project.id}`)}
              className="mt-4 text-blue-500 hover:text-blue-600"
            >
              View Details →
            </button>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No projects found. Create a new project to get started.
        </div>
      )}
    </div>
  )
}