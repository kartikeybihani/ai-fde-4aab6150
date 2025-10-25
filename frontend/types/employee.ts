export type EmployeeRole = 'MANAGER' | 'SUPERVISOR' | 'TECHNICIAN' | 'WORKER' | 'INTERN';

export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'SICK' | 'INACTIVE' | 'TERMINATED';

export type EmployeePerformance = {
  efficiency: number;
  qualityScore: number;
  safetyRating: number;
  attendanceRate: number;
  projectsCompleted: number;
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: EmployeeRole;
  status: EmployeeStatus;
  department: string;
  hireDate: string;
  phoneNumber: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
  performance?: EmployeePerformance;
  currentProject?: string;
  skills: string[];
  certifications: string[];
  hourlyRate: number;
  totalHoursWorked: number;
  lastStatusUpdate: string;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeStatusUpdate = {
  employeeId: string;
  status: EmployeeStatus;
  note?: string;
  timestamp: string;
};

export type EmployeeFilters = {
  role?: EmployeeRole;
  status?: EmployeeStatus;
  department?: string;
  projectId?: string;
};

export type EmployeeSort = {
  field: keyof Employee;
  direction: 'asc' | 'desc';
};

export type EmployeePagination = {
  page: number;
  limit: number;
  total: number;
};

export type EmployeeResponse = {
  data: Employee[];
  pagination: EmployeePagination;
};