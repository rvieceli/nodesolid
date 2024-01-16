export type CreateLocationInput = {
  id?: string;
  name: string;
  address: string;
  description?: string;
  phone: string;
  latitude: number;
  longitude: number;
};

export interface LocationData {
  id: string;
  name: string;
  address: string;
  description?: string;
  phone: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

export interface LocationsRepository {
  create(data: CreateLocationInput): Promise<LocationData>;
  findById(id: string): Promise<LocationData | undefined>;
}
