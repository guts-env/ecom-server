import { config } from '@/config';
import type { IStore } from '@/entities';

export default class MapsService {
  private readonly apiKey = config.GOOGLE_MAPS_API_KEY;

  async geocodeStore(store: Partial<IStore>): Promise<IStore> {
    if (!this.apiKey) {
      throw new Error('Google Maps API key is not set');
    }

    try {
      const address = `${store.address}, ${store.city}, ${store.state}, ${store.country}`;
      const encodedAddress = encodeURIComponent(address);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.apiKey}`;

      const response = await fetch(url);
      const data = (await response.json()) as {
        status: string;
        results: { geometry: { location: { lat: number; lng: number } }; place_id: string }[];
      };

      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        const location = result?.geometry?.location;
        const place_id = result?.place_id;

        return {
          ...store,
          latitude: location?.lat,
          longitude: location?.lng,
          location_id: place_id,
          created_at: new Date(),
        } as IStore;
      } else {
        return {
          ...store,
          latitude: 10.7202,
          longitude: 122.5621,
          location_id: '',
          created_at: new Date(),
        } as IStore;
      }
    } catch (error) {
      return {
        ...store,
        latitude: 10.7202,
        longitude: 122.5621,
        location_id: '',
        created_at: new Date(),
      } as IStore;
    }
  }
}
