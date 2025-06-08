import mapAddress from "@/mappers/mapAddress";
import { queryOptions } from "@tanstack/react-query";
import axios from "axios";

export const autocompletePlacesQueries = {
  all: (query: TAutocompletePlacesQuery) =>
    queryOptions<any[]>({
      queryKey: ["autocomplete_places", JSON.stringify(query)],
      queryFn: async () => {
        const response = await axios.get<_WAZEAddressData[]>(
          "https://www.waze.com/live-map/api/autocomplete/",
          {
            params: {
              q: query.q,
              exp: "1,1,1",
              "geo-env": "row",
              v: "-1.96107353,30.09852648;-1.95466143,30.11891127",
              lang: "en",
            },
          }
        );    
        const onlyRwandaPlaces = response.data.filter((place) => {
          return place.address.toLowerCase().includes("rwanda");
        });

        const result = onlyRwandaPlaces.map((place) => mapAddress(place));
        return result;
      },
      enabled: !!query.q,
    }),
};

type TAutocompletePlacesQuery = {
  q: string;
};

export type _WAZEAddressData = {
  name: string;
  cleanName: string;
  address: string;
  venueId: string;
  latLng: {
    lat: number;
    lng: number;
  };
};