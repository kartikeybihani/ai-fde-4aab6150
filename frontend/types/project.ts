import { Employee } from './employee';
import { Material } from './material';

export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ProjectProgress {
  completedTasks: number;
  totalTasks: number;
  percentageComplete: number;
  lastUpdated: Date;
}

export interface ProjectBudget {
  allocated: number;
  spent: number;
  remaining: number;
  currency: string;
}

export interface ProjectTimeline {
  startDate: Date;
  plannedEndDate: Date;
  actualEndDate?: Date;
  milestones: ProjectMilestone[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: Date;
  completed: boolean;
  description?: string;
}

export interface ProjectTeam {
  projectManager: Employee;
  teamMembers: Employee[];
  suppliers?: string[];
}

export interface ProjectMaterials {
  required: Material[];
  allocated: Material[];
  pending: Material[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: ProjectProgress;
  budget: ProjectBudget;
  timeline: ProjectTimeline;
  team: ProjectTeam;
  materials: ProjectMaterials;
  clientId?: string;
  clientName?: string;
  location?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type ProjectCreateInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type ProjectUpdateInput = Partial<ProjectCreateInput>;