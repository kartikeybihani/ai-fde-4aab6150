export interface MaterialSupplier {
  id: string;
  name: string;
  contactInfo: string;
  pricePerUnit: number;
  deliveryTimeInDays: number;
  minimumOrderQuantity: number;
  reliability: number;
}

export interface MaterialInventory {
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderPoint: number;
  lastRestockDate: Date;
  nextDeliveryDate: Date | null;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  suppliers: MaterialSupplier[];
  inventory: MaterialInventory;
  status: 'available' | 'low_stock' | 'out_of_stock' | 'on_order';
  lastUpdated: Date;
  createdAt: Date;
}

export interface MaterialAvailability {
  materialId: string;
  available: boolean;
  quantity: number;
  expectedDelivery: Date | null;
}

export interface MaterialOrder {
  id: string;
  materialId: string;
  supplierId: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  orderDate: Date;
  expectedDeliveryDate: Date;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

export interface MaterialUsage {
  id: string;
  materialId: string;
  projectId: string;
  quantity: number;
  usageDate: Date;
  authorizedBy: string;
}

export type MaterialUpdatePayload = Partial<Omit<Material, 'id' | 'createdAt'>>;

export type MaterialCreatePayload = Omit<Material, 'id' | 'createdAt' | 'lastUpdated'>;