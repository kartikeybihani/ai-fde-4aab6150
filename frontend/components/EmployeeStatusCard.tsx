import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { fetchWithAuth } from '@/lib/api-client';

type EmployeeStatusCardProps = {
  employeeId: string;
  onStatusChange?: (status: string) => void;
};

type StatusUpdate = {
  status: string;
  lastUpdated: string;
  performance: number;
};

const statusColors = {
  active: 'bg-green-500',
  break: 'bg-yellow-500',
  offline: 'bg-red-500',
  meeting: 'bg-blue-500',
};

export default function EmployeeStatusCard({ employeeId, onStatusChange }: EmployeeStatusCardProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [statusUpdate, setStatusUpdate] = useState<StatusUpdate | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const [employeeData, statusData] = await Promise.all([
          fetchWithAuth(`/api/employees/${employeeId}`),
          fetchWithAuth(`/api/employees/${employeeId}/status`)
        ]);

        setEmployee(employeeData);
        setStatusUpdate(statusData);
      } catch (err) {
        setError('Failed to fetch employee data');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
    
    const statusInterval = setInterval(fetchEmployeeData, 30000);
    return () => clearInterval(statusInterval);
  }, [employeeId]);

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetchWithAuth(`/api/employees/${employeeId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      setStatusUpdate(response);
      onStatusChange?.(newStatus);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-md p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (error || !employee || !statusUpdate) {
    return (
      <div className="bg-red-50 rounded-lg shadow-md p-4">
        <p className="text-red-500">Error loading employee status</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{employee.name}</h3>
          <p className="text-gray-600">{employee.role}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColors[statusUpdate.status as keyof typeof statusColors]}`} />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <span className="font-medium">{statusUpdate.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Last Updated</span>
          <span className="font-medium">
            {new Date(statusUpdate.lastUpdated).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Performance</span>
          <span className="font-medium">{statusUpdate.performance}%</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {Object.keys(statusColors).map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-3 py-1 rounded-md text-sm font-medium capitalize
              ${statusUpdate.status === status 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}