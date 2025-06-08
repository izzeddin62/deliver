import { _WAZEAddressData } from "@/services/autocomplete.places.service";
import { AddressData } from "@/types";

export default function mapAddress(data: _WAZEAddressData): AddressData {
  return {
    formatted_address: data.cleanName,
    address_components: [
      {
        long_name: data.name,
        short_name: data.name,
        types: ["locality"],
      },
    ],
    geometry: {
      location: {
        lat: data.latLng.lat,
        lng: data.latLng.lng,
      },
    },
    place_id: data.venueId,
    html_attributions: [],
  };
}