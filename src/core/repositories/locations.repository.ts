import { Point } from "../utils/get-distance-between-points";

export type CreateLocationInput = {
  id?: string;
  name: string;
  address: string;
  description?: string;
  phone: string;
  coordinates: Point;
};

export interface LocationData {
  id: string;
  name: string;
  address: string;
  description?: string;
  phone: string;
  coordinates: Point;
  createdAt: Date;
}

export interface LocationsRepository {
  create(data: CreateLocationInput): Promise<LocationData>;
  findById(id: string): Promise<LocationData | undefined>;
}
