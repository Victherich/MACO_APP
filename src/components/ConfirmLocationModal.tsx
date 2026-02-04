// import React, { useState } from "react";
// import {
//   IonContent,
//   IonButton,
//   IonHeader,
//   IonToolbar,
//   IonTitle
// } from "@ionic/react";
// import styled from "styled-components";
// import { useHistory } from "react-router-dom";
// import { IonModal } from "@ionic/react";
// import SearchingModal from "./SearchingModal";
// import { IonAlert } from "@ionic/react";



// const Container = styled.div`
//   padding: 18px;
//   background: #f6f8ff;
//   min-height: 100%;
// `;

// const Title = styled.h1`
//   font-size: 22px;
//   font-weight: 700;
//   margin: 0;
//   color: #2b2b2b;
// `;

// const Desc = styled.p`
//   color: #6b6b6b;
// `;

// interface Props {
//   service: any;
//   onClose: () => void;
// }

// const ConfirmLocationModal: React.FC<Props> = ({ service, onClose }) => {
//   const history = useHistory();
//   const [openSearching, setOpenSearching] = useState(false);
//   const [showRequestAlert, setShowRequestAlert] = useState(false);



//   // dummy location
//   const [address] = useState("Al Barsha, Dubai");
//   const [latLng] = useState({ lat: 25.118, lng: 55.2 });

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
//           <Title>{service.title}</Title>
//           <Desc>Pickup Location</Desc>

//           <div
//             style={{
//               margin: "12px 0",
//               padding: 14,
//               background: "#fff",
//               borderRadius: 12
//             }}
//           >
//             {address}
//           </div>

//         <IonButton expand="block" onClick={() => setShowRequestAlert(true)}>
//   Request Now
// </IonButton>

// <IonModal
//   isOpen={openSearching}
//   onDidDismiss={() => setOpenSearching(false)}
// >
//   <SearchingModal
//     service={service}
//     address={address}
//     latLng={latLng}
//     onClose={() => setOpenSearching(false)}
//   />
// </IonModal>

// <IonAlert
//   isOpen={showRequestAlert}
//   onDidDismiss={() => setShowRequestAlert(false)}
//   header="Confirm Service Request"
//   message="Do you want to request this service at the selected location?"
//   buttons={[
//     {
//       text: "No",
//       role: "cancel"
//     },
//     {
//       text: "Yes, Request",
//       handler: () => {
//         setShowRequestAlert(false);
//         setOpenSearching(true);
//       }
//     }
//   ]}
// />


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
  IonAlert
} from "@ionic/react";
import styled from "styled-components";
import { ref, onValue, push, get } from "firebase/database";
import { rtdb, auth } from "../firebaseConfig";
import { useApp } from "../context/AppContext";


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
  const { setActiveOrderId, setOpenSearchingModal, openSearchingModal } = useApp();

  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showActiveOrderAlert, setShowActiveOrderAlert] = useState(false);
  const [creating, setCreating] = useState(false);

  // dummy location (replace later)
  const address = "Al Barsha, Dubai";
  const latLng = { lat: 25.118, lng: 55.2 };

//   const handleCreateOrder = async () => {
//     const user = auth.currentUser;
//     if (!user || creating) return;

//     setCreating(true);

//     const ordersRef = ref(rtdb, "orders");

//     onValue(
//       ordersRef,
//       (snapshot) => {
//         const orders = snapshot.val();

//         const hasActiveOrder =
//           orders &&
//           Object.values<any>(orders).some(
//             (order) =>
//               order.userId === user.uid &&
//               ["SEARCHING", "ACCEPTED", "IN_PROGRESS"].includes(order.status)
//           );

//         if (hasActiveOrder) {
//           setCreating(false);
//           setShowActiveOrderAlert(true);
//           return;
//         }

//         const newOrderRef = push(ordersRef, {
//           service,
//           address,
//           latLng,
//           userId: user.uid,
//           userEmail: user.email || null,
//           status: "SEARCHING",
//           createdAt: Date.now()
//         });

//         // setActiveOrderId(newOrderRef.key);
//         setOpenSearchingModal(true)
//         setCreating(false);
//         onClose();
//       },
//       { onlyOnce: true }
//     );
//   };





const handleCreateOrder = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const ordersRef = ref(rtdb, "orders");

    // ✅ Get a one-time snapshot
    const snapshot = await get(ordersRef);
    const orders = snapshot.val();

    const hasActive =
      orders &&
      Object.values<any>(orders).some(
        (o) =>
          o.userId === user.uid &&
          ["SEARCHING", "ACCEPTED", "IN_PROGRESS","COMPLETED"].includes(o.status)
      );

    if (hasActive) {
      setShowActiveOrderAlert(true);
      return;
    }

    // ✅ No active order, create new
    const newOrderRef = push(ordersRef, {
      service,
      address,
      latLng,
      userId: user.uid,
      userEmail: user.email || null,
      status: "SEARCHING",
      createdAt: Date.now()
    });

    // Open searching modal after creating order
    setOpenSearchingModal(true);
    onClose();

  } catch (err) {
    console.error("Error creating order:", err);
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

          <div style={{ padding: 14, background: "#fff", borderRadius: 12 }}>
            {address}
          </div>

          <IonButton
            expand="block"
            style={{ marginTop: 20 }}
            onClick={() => setShowConfirmAlert(true)}
          >
            Request Now
          </IonButton>

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
                }
              }
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
