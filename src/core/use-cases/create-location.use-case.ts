import {
  LocationData,
  LocationsRepository,
} from "../repositories/locations.repository";
import { Point } from "../utils/get-distance-between-points";

export interface CreateLocationUseCaseRequest {
  name: string;
  address: string;
  description?: string | null;
  phone: string;
  coordinates: Point;
}

export interface CreateLocationUseCaseResponse {
  location: LocationData;
}

export class CreateLocationUseCase {
  constructor(private readonly locationsRepository: LocationsRepository) {}

  async handler({
    name,
    phone,
    description,
    address,
    coordinates,
  }: CreateLocationUseCaseRequest): Promise<CreateLocationUseCaseResponse> {
    const location = await this.locationsRepository.create({
      name,
      phone,
      description,
      address,
      coordinates,
    });

    return { location };
  }
}
