import type { IStore } from '@/entities';

export default class StoreRepository {
  private stores: IStore[] = [];

  setStores(stores: IStore[]): void {
    this.stores = stores;
  }

  getAllStores(): IStore[] {
    return this.stores;
  }
}
