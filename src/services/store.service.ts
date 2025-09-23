import type { IStore } from '@/entities';
import StoreRepository from '@/repositories/store.repository';
import MapsService from '@/services/maps.service';
import { mockStores } from '@/data/mockStores';

export default class StoreService {
  private storeRepository: StoreRepository;
  private mapsService: MapsService;
  private initialized = false;

  constructor() {
    this.storeRepository = new StoreRepository();
    this.mapsService = new MapsService();
  }

  async initializeStores(): Promise<void> {
    if (this.initialized) return;

    const enhancedStores: IStore[] = [];

    for (const mockStore of mockStores) {
      const enhancedStore = await this.mapsService.geocodeStore(mockStore);
      enhancedStores.push(enhancedStore);
    }

    this.storeRepository.setStores(enhancedStores);
    this.initialized = true;
  }

  async getAllStores(): Promise<IStore[]> {
    if (!this.initialized) {
      await this.initializeStores();
    }

    return this.storeRepository.getAllStores();
  }

  async getStoreById(id: string): Promise<IStore | null> {
    if (!this.initialized) {
      await this.initializeStores();
    }
    return this.storeRepository.getStoreById(id);
  }
}
