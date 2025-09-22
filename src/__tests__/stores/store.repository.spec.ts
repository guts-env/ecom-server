import StoreRepository from '@/repositories/store.repository';
import type { IStore } from '@/entities';

describe('StoreRepository Unit Tests', () => {
  let storeRepository: StoreRepository;

  const mockStores: IStore[] = [
    {
      id: '1',
      name: 'TechHub Iloilo',
      address: 'G/F Smallville Complex',
      city: 'Iloilo City',
      state: 'Iloilo',
      zip_code: '5000',
      country: 'Philippines',
      latitude: 10.7202,
      longitude: 122.5621,
      phone_number: '(033) 320-1234',
      rating: 4.5,
      is_open: true,
      location_id: 'ChIJxxx',
      created_at: new Date(),
    },
    {
      id: '2',
      name: 'Digital World Superstore',
      address: 'SM City Iloilo',
      city: 'Iloilo City',
      state: 'Iloilo',
      zip_code: '5000',
      country: 'Philippines',
      latitude: 10.7142,
      longitude: 122.5511,
      phone_number: '(033) 321-5678',
      rating: 4.2,
      is_open: false,
      location_id: 'ChIJyyy',
      created_at: new Date(),
    },
  ];

  beforeEach(() => {
    storeRepository = new StoreRepository();
  });

  describe('setStores', () => {
    it('should set stores in the repository', () => {
      storeRepository.setStores(mockStores);
      const stores = storeRepository.getAllStores();

      expect(stores).toEqual(mockStores);
      expect(stores).toHaveLength(2);
    });

    it('should replace existing stores when called again', () => {
      storeRepository.setStores(mockStores);

      const newStores = [mockStores[0]!] as IStore[];
      storeRepository.setStores(newStores);

      const stores = storeRepository.getAllStores();
      expect(stores).toHaveLength(1);
      expect(stores[0]!.id).toBe('1');
    });

    it('should handle empty array', () => {
      storeRepository.setStores([]);
      const stores = storeRepository.getAllStores();

      expect(stores).toEqual([]);
      expect(stores).toHaveLength(0);
    });
  });

  describe('getAllStores', () => {
    it('should return empty array when no stores are set', () => {
      const stores = storeRepository.getAllStores();

      expect(stores).toEqual([]);
      expect(stores).toHaveLength(0);
    });

    it('should return all stores that were set', () => {
      storeRepository.setStores(mockStores);
      const stores = storeRepository.getAllStores();

      expect(stores).toEqual(mockStores);
      expect(stores).toHaveLength(2);
      expect(stores[0]!.name).toBe('TechHub Iloilo');
      expect(stores[1]!.name).toBe('Digital World Superstore');
    });

    it('should return stores with all properties intact', () => {
      storeRepository.setStores(mockStores);
      const stores = storeRepository.getAllStores();

      const firstStore = stores[0]!;
      expect(firstStore).toHaveProperty('id', '1');
      expect(firstStore).toHaveProperty('name', 'TechHub Iloilo');
      expect(firstStore).toHaveProperty('latitude', 10.7202);
      expect(firstStore).toHaveProperty('longitude', 122.5621);
      expect(firstStore).toHaveProperty('phone_number', '(033) 320-1234');
      expect(firstStore).toHaveProperty('rating', 4.5);
      expect(firstStore).toHaveProperty('is_open', true);
      expect(firstStore).toHaveProperty('location_id', 'ChIJxxx');
    });

    it('should return the same reference each time', () => {
      storeRepository.setStores(mockStores);

      const stores1 = storeRepository.getAllStores();
      const stores2 = storeRepository.getAllStores();

      expect(stores1).toBe(stores2);
    });
  });
});
