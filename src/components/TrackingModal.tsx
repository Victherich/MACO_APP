import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle
} from "@ionic/react";
import styled from "styled-components";
import { ref, onValue, off } from "firebase/database";
import { rtdb } from "../firebaseConfig";
import { useApp } from "../context/AppContext";

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const StatusBar = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
  background: #ffffff;
  padding: 16px;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
`;

const StatusText = styled.h3`
  margin: 0;
  text-align: center;
  color: #2b2b2b;
`;

interface Props {
  orderId: string;
  onClose: () => void;
}

const TrackingModal: React.FC<Props> = ({ orderId, onClose }) => {
  const { setActiveOrderId, setTrackingOpen } = useApp();

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const serviceMarker = useRef<google.maps.Marker | null>(null);
  const providerMarker = useRef<google.maps.Marker | null>(null);

  const [status, setStatus] = useState("");

  // 1️⃣ INIT MAP
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = new google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: 25.118, lng: 55.2 },
      disableDefaultUI: true
    });
  }, []);

  // 2️⃣ LISTEN TO ORDER REALTIME
  useEffect(() => {
    if (!orderId) return;

    const orderRef = ref(rtdb, `orders/${orderId}`);

    const unsubscribe = onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      if (!data || !mapInstance.current) return;

      setStatus(data.status);

      // 📍 Service location
      if (data.latLng && !serviceMarker.current) {
        serviceMarker.current = new google.maps.Marker({
          position: data.latLng,
          map: mapInstance.current,
          label: "📍"
        });

        mapInstance.current.setCenter(data.latLng);
      }

      // 🚗 Provider live location
      if (data.providerLocation) {
        if (!providerMarker.current) {
          providerMarker.current = new google.maps.Marker({
            position: data.providerLocation,
            map: mapInstance.current,
            label: "🚗"
          });
        } else {
          providerMarker.current.setPosition(data.providerLocation);
        }
      }

      // ✅ Order completed
      if (data.status === "COMPLETED") {
        setActiveOrderId(null);
        setTrackingOpen(false);
        onClose();
      }
    });

    return () => off(orderRef);
  }, [orderId]);

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tracking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <MapContainer ref={mapRef} />

        <StatusBar>
          <StatusText>
            {status === "ACCEPTED" && "Provider is on the way 🚗"}
            {status === "ON_THE_WAY" && "Provider approaching 📍"}
            {status === "IN_PROGRESS" && "Service in progress 🧼"}
            {status === "COMPLETED" && "Service completed ✅"}
        
          </StatusText>
        </StatusBar>
      </IonContent>
    </>
  );
};

export default TrackingModal;
