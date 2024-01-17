import { PageSizePolicy } from "../policies/page-size.policy";
import {
  LocationData,
  LocationsRepository,
} from "../repositories/locations.repository";
import { PaginatedRequest, PaginatedResponse } from "../utils/pagination";

interface SearchLocationsUseCaseRequest extends Partial<PaginatedRequest> {
  query: string;
}

export class SearchLocationsUseCase {
  constructor(private readonly locationsRepository: LocationsRepository) {}

  async handler({
    query,
    page = 1,
    pageSize = PageSizePolicy.DEFAULT_PAGE_SIZE,
  }: SearchLocationsUseCaseRequest): Promise<PaginatedResponse<LocationData>> {
    PageSizePolicy.isAllowedOrThrow(pageSize);

    return await this.locationsRepository.searchPaginated(query, {
      page,
      pageSize,
    });
  }
}
