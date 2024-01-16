import {
  LocationData,
  LocationsRepository,
} from "../repositories/locations.repository";
import { Point } from "../utils/get-distance-between-points";

export interface CreateLocationUseCaseRequest {
  name: string;
  address: string;
  description?: string;
  phone: string;
  coordinates: Point;
}

export class CreateLocationUseCase {
  constructor(private readonly locationsRepository: LocationsRepository) {}

  async handler({
    name,
    phone,
    description,
    address,
    coordinates,
  }: CreateLocationUseCaseRequest): Promise<LocationData> {
    const location = await this.locationsRepository.create({
      name,
      phone,
      description,
      address,
      coordinates,
    });

    return location;
  }
}
