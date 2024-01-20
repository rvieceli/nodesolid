import { PageSizePolicy } from "../policies/page-size.policy";
import {
  LocationData,
  LocationsRepository,
} from "../repositories/locations.repository";
import { Point } from "../utils/get-distance-between-points";
import { PaginatedRequest, PaginatedResponse } from "../utils/pagination";

interface SearchNearbyLocationsUseCaseRequest
  extends Partial<PaginatedRequest> {
  coordinates: Point;
}

export class SearchNearbyLocationsUseCase {
  constructor(private readonly locationsRepository: LocationsRepository) {}

  async handler({
    coordinates,
    page = 1,
    pageSize = PageSizePolicy.DEFAULT_PAGE_SIZE,
  }: SearchNearbyLocationsUseCaseRequest): Promise<
    PaginatedResponse<LocationData>
  > {
    PageSizePolicy.isAllowedOrThrow(pageSize);

    const DISTANCE_IN_KM = 10;

    return this.locationsRepository.searchByProximityPaginated(
      coordinates,
      DISTANCE_IN_KM,
      { page, pageSize },
    );
  }
}
