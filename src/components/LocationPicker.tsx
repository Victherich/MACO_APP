import React, { useEffect, useState } from "react";
import { IonButton } from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

interface Props {
  onLocationSelected: (data: {
    address: string;
    latLng: { lat: number; lng: number };
  }) => void;
}

const LocationPicker: React.FC<Props> = ({ onLocationSelected }) => {
  const [loadingLocation, setLoadingLocation] = useState(false);

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "ae" }, // change if needed
    },
    debounce: 300,
  });

//   const getCurrentLocation = async () => {
//     try {
//       setLoadingLocation(true);

//       const position = await Geolocation.getCurrentPosition();

//       const coords = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude,
//       };

//       const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=YOUR_GOOGLE_MAPS_API_KEY`;

//       const res = await fetch(geocodeUrl);
//       const data = await res.json();

//       const formattedAddress =
//         data.results[0]?.formatted_address || "Using your Current Location";

//       setValue(formattedAddress, false);

//       onLocationSelected({
//         address: formattedAddress,
//         latLng: coords,
//       });
//     } catch (error) {
//       console.error("Location error:", error);
//     } finally {
//       setLoadingLocation(false);
//     }
//   };


const getCurrentLocation = async () => {
  try {
    setLoadingLocation(true);

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,   // 🔥 CRITICAL
      timeout: 10000,             // wait up to 10 seconds for good GPS
      maximumAge: 0               // do NOT use cached location
    });

    const coords = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=YOUR_GOOGLE_MAPS_API_KEY`;

    const res = await fetch(geocodeUrl);
    const data = await res.json();

    const formattedAddress =
      data.results[0]?.formatted_address || "Using your Current Location";

    setValue(formattedAddress, false);

    onLocationSelected({
      address: formattedAddress,
      latLng: coords,
    });

  } catch (error) {
    console.error("Location error:", error);
  } finally {
    setLoadingLocation(false);
  }
};



  useEffect(() => {
    getCurrentLocation(); // auto-detect on load
  }, []);

  return (
    <div style={{ padding: 14, background: "#fff", borderRadius: 12 }}>
      {loadingLocation ? (
        <p>Please wait... Detecting location...</p>
      ) : (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search pickup location..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: 16,
            }}
          />

          {status === "OK" && (
            <div
              style={{
                marginTop: 10,
                background: "#f0f0f0",
                padding: 8,
                borderRadius: 8,
              }}
            >
              {data.map((suggestion) => (
                <div
                  key={suggestion.place_id}
                  style={{ padding: 6, cursor: "pointer" }}
                  onClick={async () => {
                    setValue(suggestion.description, false);
                    clearSuggestions();

                    const results = await getGeocode({
                      address: suggestion.description,
                    });

                    const { lat, lng } = await getLatLng(results[0]);

                    onLocationSelected({
                      address: suggestion.description,
                      latLng: { lat, lng },
                    });
                  }}
                >
                  {suggestion.description}
                </div>
              ))}
            </div>
          )}

          <IonButton
            fill="clear"
            size="small"
            onClick={getCurrentLocation}
            style={{marginTop:"20px", backgroundColor:"rgba(0,0,255,0.5)", color:"white"}}
          >
            Use current location
          </IonButton>
        </>
      )}
    </div>
  );
};

export default LocationPicker;
