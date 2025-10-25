import React from 'react';
import { LinearProgress, Box, Typography } from '@mui/material';
import { Project } from '@/types/project';
import { useQuery } from '@tanstack/react-query';
import { getProjectProgress } from '@/lib/api-client';

interface ProjectProgressBarProps {
  project: Project;
  showDetails?: boolean;
  className?: string;
}

const ProjectProgressBar: React.FC<ProjectProgressBarProps> = ({
  project,
  showDetails = true,
  className = '',
}) => {
  const { data: progress, isLoading, error } = useQuery({
    queryKey: ['projectProgress', project.id],
    queryFn: () => getProjectProgress(project.id),
    refetchInterval: 300000,
  });

  const getProgressColor = (value: number): string => {
    if (value >= 90) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return <div className="animate-pulse h-4 bg-gray-200 rounded"></div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Error loading progress</div>;
  }

  const progressValue = progress?.percentage || 0;
  const progressColor = getProgressColor(progressValue);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        <Typography variant="body2" className="text-gray-700 font-medium">
          {project.name}
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          {progressValue}%
        </Typography>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${progressColor} transition-all duration-300`}
          style={{ width: `${progressValue}%` }}
        />
      </div>
      {showDetails && progress && (
        <div className="mt-2 text-sm text-gray-600 flex justify-between">
          <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
          <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default ProjectProgressBar;