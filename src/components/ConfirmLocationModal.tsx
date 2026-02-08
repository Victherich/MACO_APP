



// import React, { useState } from "react";
// import {
//   IonContent,
//   IonButton,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonAlert
// } from "@ionic/react";
// import styled from "styled-components";
// import { ref, onValue, push, get } from "firebase/database";
// import { rtdb, auth } from "../firebaseConfig";
// import { useApp } from "../context/AppContext";


// const Container = styled.div`
//   padding: 18px;
//   background: #f6f8ff;
//   min-height: 100%;
// `;

// interface Props {
//   service: any;
//   onClose: () => void;
// }

// const ConfirmLocationModal: React.FC<Props> = ({ service, onClose }) => {
//   const { setActiveOrderId, setOpenSearchingModal, openSearchingModal } = useApp();

//   const [showConfirmAlert, setShowConfirmAlert] = useState(false);
//   const [showActiveOrderAlert, setShowActiveOrderAlert] = useState(false);
//   const [creating, setCreating] = useState(false);

//   // dummy location (replace later)
//   const address = "Al Barsha, Dubai";
//   const latLng = { lat: 25.118, lng: 55.2 };





// const handleCreateOrder = async () => {
//   const user = auth.currentUser;
//   if (!user) return;

//   try {
//     const ordersRef = ref(rtdb, "orders");

//     // ✅ Get a one-time snapshot
//     const snapshot = await get(ordersRef);
//     const orders = snapshot.val();

//     const hasActive =
//       orders &&
//       Object.values<any>(orders).some(
//         (o) =>
//           o.userId === user.uid &&
//           ["SEARCHING", "ACCEPTED", "IN_PROGRESS","COMPLETED"].includes(o.status)
//       );

//     if (hasActive) {
//       setShowActiveOrderAlert(true);
//       return;
//     }

//     // ✅ No active order, create new
//     const newOrderRef = push(ordersRef, {
//       service,
//       address,
//       latLng,
//       userId: user.uid,
//       userEmail: user.email || null,
//       status: "SEARCHING",
//       createdAt: Date.now()
//     });

//     // Open searching modal after creating order
//     setOpenSearchingModal(true);
//     onClose();

//   } catch (err) {
//     console.error("Error creating order:", err);
//   }
// };


//   return (
//     <>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Confirm Location</IonTitle>
//           <IonButton slot="end" fill="clear" onClick={onClose}>
//             Close
//           </IonButton>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent>
//         <Container>
//           <h2>{service.title}</h2>
//           <p>Pickup Location</p>

//           <div style={{ padding: 14, background: "#fff", borderRadius: 12 }}>
//             {address}
//           </div>

//           <IonButton
//             expand="block"
//             style={{ marginTop: 20 }}
//             onClick={() => setShowConfirmAlert(true)}
//           >
//             Request Now
//           </IonButton>

//           <IonAlert
//             isOpen={showConfirmAlert}
//             onDidDismiss={() => setShowConfirmAlert(false)}
//             header="Confirm Service Request"
//             message="Do you want to request this service?"
//             buttons={[
//               { text: "No", role: "cancel" },
//               {
//                 text: "Yes, Request",
//                 handler: () => {
//                   setShowConfirmAlert(false);
//                   handleCreateOrder();
//                 }
//               }
//             ]}
//           />

//           <IonAlert
//             isOpen={showActiveOrderAlert}
//             onDidDismiss={() => setShowActiveOrderAlert(false)}
//             header="Active Booking Found"
//             message="You already have an ongoing booking. Please complete or cancel it before creating a new one."
//             buttons={["OK"]}
//           />
//         </Container>
//       </IonContent>
//     </>
//   );
// };

// export default ConfirmLocationModal;








import React, { useState } from "react";
import {
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAlert,
} from "@ionic/react";
import styled from "styled-components";
import { ref, push, get } from "firebase/database";
import { rtdb, auth } from "../firebaseConfig";
import { useApp } from "../context/AppContext";
import LocationPicker from "../components/LocationPicker"; // <-- NEW IMPORT

const Container = styled.div`
  padding: 18px;
  background: #f6f8ff;
  min-height: 100%;
`;

interface Props {
  service: any;
  onClose: () => void;
}

const ConfirmLocationModal: React.FC<Props> = ({ service, onClose }) => {
  const { setActiveOrderId, setOpenSearchingModal } = useApp();

  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showActiveOrderAlert, setShowActiveOrderAlert] = useState(false);
  const [creating, setCreating] = useState(false);

  // ✅ NEW: Real location state instead of dummy data
  const [address, setAddress] = useState<string | null>(null);
  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const handleCreateOrder = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // ✅ Prevent request if no location selected
    if (!address || !latLng) {
      alert("Please select a pickup location first.");
      return;
    }

    setCreating(true);

    try {
      const ordersRef = ref(rtdb, "orders");

      // Check for active orders
      const snapshot = await get(ordersRef);
      const orders = snapshot.val();

      const hasActive =
        orders &&
        Object.values<any>(orders).some(
          (o) =>
            o.userId === user.uid && o.payment_status === "NOT_PAID" &&
            ["SEARCHING", "ACCEPTED", "IN_PROGRESS", "COMPLETED"].includes(
              o.status
            ) 
        );

      if (hasActive) {
        setShowActiveOrderAlert(true);
        setCreating(false);
        return;
      }

      // Create new order
      const newOrderRef = push(ordersRef, {
        service,
        address,
        latLng,
        userId: user.uid,
        userEmail: user.email || null,
        status: "SEARCHING",
        payment_status:"NOT_PAID",
        createdAt: Date.now(),
      });

      // Save active order id in context (optional but useful)
      setActiveOrderId(newOrderRef.key);

      // Open searching modal after creating order
      setOpenSearchingModal(true);
      onClose();
    } catch (err) {
      console.error("Error creating order:", err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Confirm Location</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <Container>
          <h2>{service.title}</h2>
          <p>Pickup Location</p>

          {/* ✅ REPLACED DUMMY ADDRESS WITH LOCATION PICKER */}
          <LocationPicker
            onLocationSelected={({ address, latLng }) => {
              setAddress(address);
              setLatLng(latLng);
            }}
          />

          {latLng&&<IonButton
            expand="block"
            style={{ marginTop: 20 }}
            disabled={creating}
            onClick={() => setShowConfirmAlert(true)}
          >
            {creating ? "Requesting..." : "Request Now"}
          </IonButton>}

          <IonAlert
            isOpen={showConfirmAlert}
            onDidDismiss={() => setShowConfirmAlert(false)}
            header="Confirm Service Request"
            message="Do you want to request this service?"
            buttons={[
              { text: "No", role: "cancel" },
              {
                text: "Yes, Request",
                handler: () => {
                  setShowConfirmAlert(false);
                  handleCreateOrder();
                },
              },
            ]}
          />

          <IonAlert
            isOpen={showActiveOrderAlert}
            onDidDismiss={() => setShowActiveOrderAlert(false)}
            header="Active Booking Found"
            message="You already have an ongoing booking. Please complete or cancel it before creating a new one."
            buttons={["OK"]}
          />
        </Container>
      </IonContent>
    </>
  );
};

export default ConfirmLocationModal;
