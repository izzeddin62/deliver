interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }
  interface Geometry {
    location: {
      lat: number;
      lng: number;
    };
  }

export interface AddressData {
    address_components: AddressComponent[];
    formatted_address: string;
    geometry: Geometry;
    html_attributions: any[]; // Assuming this can be any type of array
    place_id: string;
  }