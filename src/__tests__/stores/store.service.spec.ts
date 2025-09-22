import StoreService from '@/services/store.service';
import type { IStore } from '@/entities';

const mockSetStores = jest.fn();
const mockGetAllStores = jest.fn();
const mockGeocodeStore = jest.fn();

jest.mock('@/repositories/store.repository', () => {
  return jest.fn().mockImplementation(() => ({
    setStores: mockSetStores,
    getAllStores: mockGetAllStores,
  }));
});

jest.mock('@/services/maps.service', () => {
  return jest.fn().mockImplementation(() => ({
    geocodeStore: mockGeocodeStore,
  }));
});

jest.mock('@/data/mockStores', () => ({
  mockStores: [
    {
      id: '1',
      name: 'TechHub Iloilo',
      address: 'G/F Smallville Complex',
      city: 'Iloilo City',
      state: 'Iloilo',
      zip_code: '5000',
      country: 'Philippines',
      phone_number: '(033) 320-1234',
      rating: 4.5,
      is_open: true,
    },
    {
      id: '2',
      name: 'Digital World Superstore',
      address: 'SM City Iloilo',
      city: 'Iloilo City',
      state: 'Iloilo',
      zip_code: '5000',
      country: 'Philippines',
      phone_number: '(033) 321-5678',
      rating: 4.2,
      is_open: true,
    },
  ],
}));

describe('StoreService Unit Tests', () => {
  let storeService: StoreService;

  beforeEach(() => {
    storeService = new StoreService();
    jest.clearAllMocks();
  });

  describe('initializeStores', () => {
    const enhancedStore1: IStore = {
      id: '1',
      name: 'TechHub Iloilo',
      address: 'G/F Smallville Complex',
      city: 'Iloilo City',
      state: 'Iloilo',
      zip_code: '5000',
      country: 'Philippines',
      phone_number: '(033) 320-1234',
      rating: 4.5,
      is_open: true,
      latitude: 10.7202,
      longitude: 122.5621,
      location_id: 'ChIJxxx',
      created_at: new Date(),
    };

    const enhancedStore2: IStore = {
      id: '2',
      name: 'Digital World Superstore',
      address: 'SM City Iloilo',
      city: 'Iloilo City',
      state: 'Iloilo',
      zip_code: '5000',
      country: 'Philippines',
      phone_number: '(033) 321-5678',
      rating: 4.2,
      is_open: true,
      latitude: 10.7142,
      longitude: 122.5511,
      location_id: 'ChIJyyy',
      created_at: new Date(),
    };

    it('should initialize stores with geocoding', async () => {
      mockGeocodeStore.mockResolvedValueOnce(enhancedStore1);
      mockGeocodeStore.mockResolvedValueOnce(enhancedStore2);

      await storeService.initializeStores();

      expect(mockGeocodeStore).toHaveBeenCalledTimes(2);
      expect(mockGeocodeStore).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          name: 'TechHub Iloilo',
        })
      );
      expect(mockGeocodeStore).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '2',
          name: 'Digital World Superstore',
        })
      );

      expect(mockSetStores).toHaveBeenCalledWith([enhancedStore1, enhancedStore2]);
    });

    it('should not reinitialize if already initialized', async () => {
      mockGeocodeStore.mockResolvedValue(enhancedStore1);

      await storeService.initializeStores();
      await storeService.initializeStores();

      expect(mockGeocodeStore).toHaveBeenCalledTimes(2);
      expect(mockSetStores).toHaveBeenCalledTimes(1);
    });

    it('should handle geocoding errors gracefully', async () => {
      mockGeocodeStore.mockRejectedValue(new Error('Geocoding failed'));

      await expect(storeService.initializeStores()).rejects.toThrow('Geocoding failed');
    });
  });

  describe('getAllStores', () => {
    const mockStoresData: IStore[] = [
      {
        id: '1',
        name: 'TechHub Iloilo',
        address: 'G/F Smallville Complex',
        city: 'Iloilo City',
        state: 'Iloilo',
        zip_code: '5000',
        country: 'Philippines',
        phone_number: '(033) 320-1234',
        rating: 4.5,
        is_open: true,
        latitude: 10.7202,
        longitude: 122.5621,
        location_id: 'ChIJxxx',
        created_at: new Date(),
      },
    ];

    it('should return all stores from repository', async () => {
      mockGetAllStores.mockReturnValue(mockStoresData);
      mockGeocodeStore.mockResolvedValue(mockStoresData[0]);

      const stores = await storeService.getAllStores();

      expect(stores).toEqual(mockStoresData);
      expect(mockGetAllStores).toHaveBeenCalled();
    });

    it('should initialize stores if not already initialized', async () => {
      mockGeocodeStore.mockResolvedValue(mockStoresData[0]);
      mockGetAllStores.mockReturnValue(mockStoresData);

      const stores = await storeService.getAllStores();

      expect(mockGeocodeStore).toHaveBeenCalled();
      expect(mockSetStores).toHaveBeenCalled();
      expect(stores).toEqual(mockStoresData);
    });

    it('should not reinitialize if already initialized', async () => {
      mockGeocodeStore.mockResolvedValue(mockStoresData[0]);
      mockGetAllStores.mockReturnValue(mockStoresData);

      await storeService.initializeStores();
      jest.clearAllMocks();

      const stores = await storeService.getAllStores();

      expect(mockGeocodeStore).not.toHaveBeenCalled();
      expect(mockSetStores).not.toHaveBeenCalled();
      expect(mockGetAllStores).toHaveBeenCalled();
      expect(stores).toEqual(mockStoresData);
    });
  });
});
