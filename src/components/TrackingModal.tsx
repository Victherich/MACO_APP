

// import React, { useEffect, useRef, useState } from "react";
// import {
//   IonContent,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonButton
// } from "@ionic/react";
// import styled from "styled-components";
// import { ref, onValue, off } from "firebase/database";
// import { rtdb, auth } from "../firebaseConfig";
// import { useApp } from "../context/AppContext";
// import PaymentModal from "./PaymentModal";
// import CustomerTrackingMap from "./CustomerTrackingMap";

// const MapContainer = styled.div`
//   width: 100%;
//   height: 100%;
// `;

// const StatusBar = styled.div`
//   position: absolute;
//   bottom: 50px;
//   width: 100%;
//   background: #ffffff;
//   padding: 16px;
//   border-top-left-radius: 18px;
//   border-top-right-radius: 18px;
//   box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.08);
// `;

// const StatusText = styled.h3`
//   margin: 0;
//   text-align: center;
//   color: #2b2b2b;
// `;

// interface Props {
//   onClose: () => void;
// }

// const TrackingModal: React.FC<Props> = ({ onClose }) => {
//   const { setTrackingOpen } = useApp();

//   const mapRef = useRef<HTMLDivElement>(null);
//   const mapInstance = useRef<google.maps.Map | null>(null);
//   const serviceMarker = useRef<google.maps.Marker | null>(null);
//   const providerMarker = useRef<google.maps.Marker | null>(null);

//   const [status, setStatus] = useState<string>("");
//   const [paymentOpen, setPaymentOpen] = useState(false);
//   const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
//   const [activeOrder, setActiveOrder] = useState<any | null>(null);

//   const user = auth.currentUser;

//   // 1️⃣ INIT MAP ONCE (independent)
//   useEffect(() => {
//     if (!mapRef.current || mapInstance.current) return;

//     mapInstance.current = new google.maps.Map(mapRef.current, {
//       zoom: 14,
//       center: { lat: 25.118, lng: 55.2 },
//       disableDefaultUI: true
//     });
//   }, []);

//   // 2️⃣ REAL-TIME LISTENER (🔥 FIXED: NO map check here)

// useEffect(() => {
//   if (!user) return;

//   const ordersRef = ref(rtdb, "orders");

//   // First: find the user's active order ID
//   const unsubAll = onValue(ordersRef, (snapshot) => {
//     const orders = snapshot.val();
//     if (!orders) {
//       setActiveOrder(null);
//       setStatus("");
//       return;
//     }

//     const activeEntry = Object.entries(orders).find(
//       ([_, order]: any) =>
//         order.userId === user.uid &&
//         (order.status === "ACCEPTED" ||
//           order.status === "IN_PROGRESS" ||
//           order.status === "COMPLETED" ||
//           order.status === "PAID")
//     );

//     if (!activeEntry) {
//       setActiveOrder(null);
//       setStatus("");
//       return;
//     }

//     const [orderId] = activeEntry;
//     setActiveOrderId(orderId);

//     // 🔥 NOW LISTEN TO THIS SPECIFIC ORDER ONLY
//     const orderRef = ref(rtdb, `orders/${orderId}`);

//     const unsubOne = onValue(orderRef, (snap) => {
//       const data = snap.val();
//       if (!data) return;

//       // ✅ REAL-TIME SAFE STATE UPDATES
//       setActiveOrder(data);
//       setStatus(data.status);

//       if (mapInstance.current) {
//         // Customer marker (only once)
//         if (data.latLng && !serviceMarker.current) {
//           serviceMarker.current = new google.maps.Marker({
//             position: data.latLng,
//             map: mapInstance.current,
//             label: "📍"
//           });
//           mapInstance.current.setCenter(data.latLng);
//         }

//         // Provider marker (create once, then MOVE IT)
//         if (data.providerLocation) {
//           if (!providerMarker.current) {
//             providerMarker.current = new google.maps.Marker({
//               position: data.providerLocation,
//               map: mapInstance.current,
//               label: "🚗"
//             });
//           } else {
//             providerMarker.current.setPosition(data.providerLocation);
//           }
//         }
//       }

//       // Close when paid
//       if (data.status === "PAID") {
//         setTrackingOpen(false);
//         onClose();
//       }
//     });

//     // Cleanup inner listener when order changes
//     return () => off(orderRef);
//   });

//   return () => off(ordersRef);
// }, [user]);



//   return (
//     <>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Tracking</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent fullscreen>
//         {/* <MapContainer ref={mapRef} /> */}

//         <CustomerTrackingMap
//   customerLocation={activeOrder?.latLng}
//   providerLocation={activeOrder?.providerLocation}
// />



//         <StatusBar>
//           <StatusText>
//             {status === "ACCEPTED" && "Provider is on the way 🚗"}
//             {status === "IN_PROGRESS" && "Service in progress 🧼"}
//             {status === "COMPLETED" && "Service Completed ✅"}
//             {status === "PAID" && "Payment received 🎉"}
//             {!status && "Waiting for update..."}
//           </StatusText>

//           {activeOrder && (
//             <p style={{ textAlign: "center", marginTop: 8, color: "#666" }}>
//               {activeOrder.service.title} • {activeOrder.service.price}
//             </p>
//           )}

//           {status === "COMPLETED" && (
//             <IonButton
//               expand="block"
//               color="primary"
//               style={{
//                 marginTop: 14,
//                 fontWeight: 700,
//                 borderRadius: 14,
//                 height: 48
//               }}
//               onClick={() => setPaymentOpen(true)}
//             >
//               Pay Now
//             </IonButton>
//           )}
//         </StatusBar>

//         {paymentOpen && activeOrderId && activeOrder && (
//           <PaymentModal
//             isOpen={paymentOpen}
//             orderId={activeOrderId}
//             amount={Number(
//               activeOrder.service.price.replace("AED", "").trim()
//             )}
//             onClose={() => setPaymentOpen(false)}
//           />
//         )}
//       </IonContent>
//     </>
//   );
// };

// export default TrackingModal;






import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton
} from "@ionic/react";
import styled from "styled-components";
import { ref, onValue, off } from "firebase/database";
import { rtdb, auth } from "../firebaseConfig";
import { useApp } from "../context/AppContext";
import PaymentModal from "./PaymentModal";
import CustomerTrackingMap from "./CustomerTrackingMap";

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
  onClose: () => void;
}

const TrackingModal: React.FC<Props> = ({ onClose }) => {
  const { setTrackingOpen } = useApp();
  const user = auth.currentUser;

  const [status, setStatus] = useState<string>("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);

  // 🔹 SINGLE CLEAN REAL-TIME LISTENER
  useEffect(() => {
    if (!user) return;

    const ordersRef = ref(rtdb, "orders");

    const unsubAll = onValue(ordersRef, (snapshot) => {
      const orders = snapshot.val();
      if (!orders) {
        setActiveOrder(null);
        setStatus("");
        return;
      }

      const activeEntry = Object.entries(orders).find(
        ([_, order]: any) =>
          order.userId === user.uid &&
          (order.status === "ACCEPTED" ||
            order.status === "IN_PROGRESS" ||
            order.status === "COMPLETED" ||
            order.status === "PAID")
      );

      if (!activeEntry) {
        setActiveOrder(null);
        setStatus("");
        return;
      }

      const [orderId] = activeEntry;
      setActiveOrderId(orderId);

      const orderRef = ref(rtdb, `orders/${orderId}`);

      const unsubOne = onValue(orderRef, (snap) => {
        const data = snap.val();
        if (!data) return;

        setActiveOrder(data);
        setStatus(data.status);

        if (data.status === "PAID") {
          setTrackingOpen(false);
          onClose();
        }
      });

      return () => off(orderRef);
    });

    return () => off(ordersRef);
  }, [user]);




  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tracking</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <MapContainer>
          <CustomerTrackingMap
            customerLocation={
              activeOrder?.latLng
                ? {
                    lat: activeOrder.latLng.lat,
                    lng: activeOrder.latLng.lng
                  }
                : null
            }
            providerLocation={
              activeOrder?.providerLocation
                ? {
                    lat: activeOrder.providerLocation.lat,
                    lng: activeOrder.providerLocation.lng
                  }
                : null
            }
          />
        </MapContainer>

        <StatusBar>
          <StatusText>
            {status === "ACCEPTED" && "Provider is on the way 🚗"}
            {status === "IN_PROGRESS" && "Service in progress 🧼"}
            {status === "COMPLETED" && "Service Completed ✅"}
            {status === "PAID" && "Payment received 🎉"}
            {!status && "Waiting for update..."}
          </StatusText>

          {activeOrder && (
            <p style={{ textAlign: "center", marginTop: 8, color: "#666" }}>
              {activeOrder.service.title} • {activeOrder.service.price}
            </p>
          )}

          {status === "COMPLETED" && (
            <IonButton
              expand="block"
              color="primary"
              style={{
                marginTop: 14,
                fontWeight: 700,
                borderRadius: 14,
                height: 48
              }}
              onClick={() => setPaymentOpen(true)}
            >
              Pay Now
            </IonButton>
          )}
        </StatusBar>

        {paymentOpen && activeOrderId && activeOrder && (
          <PaymentModal
            isOpen={paymentOpen}
            orderId={activeOrderId}
            amount={Number(
              activeOrder.service.price.replace("AED", "").trim()
            )}
            onClose={() => setPaymentOpen(false)}
          />
        )}
      </IonContent>
    </>
  );
};

export default TrackingModal;
