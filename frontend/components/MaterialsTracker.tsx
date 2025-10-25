import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchMaterialsAvailability } from '@/lib/api-client';
import { Material } from '@/types/material';

type MaterialStatus = {
  name: string;
  available: number;
  threshold: number;
  onOrder: number;
};

const MaterialsTracker: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const data = await fetchMaterialsAvailability();
        const formattedData = data.map((material: Material) => ({
          name: material.name,
          available: material.quantity,
          threshold: material.minimumThreshold,
          onOrder: material.onOrderQuantity
        }));
        setMaterials(formattedData);
        setError(null);
      } catch (err) {
        setError('Failed to load materials data');
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
    const interval = setInterval(loadMaterials, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Materials Inventory Status</h2>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={materials}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="available" fill="#4CAF50" name="Available" />
            <Bar dataKey="threshold" fill="#FF9800" name="Minimum Threshold" />
            <Bar dataKey="onOrder" fill="#2196F3" name="On Order" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4">
        {materials.map((material) => (
          <div
            key={material.name}
            className={`flex justify-between items-center p-2 rounded ${
              material.available < material.threshold ? 'bg-red-50' : ''
            }`}
          >
            <span className="font-medium">{material.name}</span>
            <div className="flex gap-4">
              <span className={material.available < material.threshold ? 'text-red-600' : ''}>
                Available: {material.available}
              </span>
              <span className="text-orange-600">Threshold: {material.threshold}</span>
              <span className="text-blue-600">On Order: {material.onOrder}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialsTracker;