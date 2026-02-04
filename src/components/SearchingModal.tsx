// import React, { useEffect, useRef, useState } from "react";
// import {
//   IonContent,
//   IonSpinner,
//   IonButton,
//   IonHeader,
//   IonToolbar,
//   IonTitle
// } from "@ionic/react";
// import styled from "styled-components";
// import { useHistory } from "react-router-dom";

// import { ref, push, onValue, off, update } from "firebase/database";
// import { rtdb } from "../firebaseConfig";
// import { IonAlert } from "@ionic/react";
// import { useApp } from "../context/AppContext";
// import { auth } from "../firebaseConfig";



// const Container = styled.div`
//   padding: 18px;
//   background: #f6f8ff;
//   min-height: 100%;
//   text-align: center;
// `;

// const StatusText = styled.h3`
//   margin-top: 16px;
//   color: #2b2b2b;
// `;

// interface Props {
//   service: any;
//   address: string;
//   latLng: any;
//   onClose: () => void;
// }

// const SearchingModal: React.FC<Props> = ({
//   service,
//   address,
//   latLng,
//   onClose
// }) => {
//   const history = useHistory();

//   const [status, setStatus] = useState("SEARCHING");
//   const [orderId, setOrderId] = useState<string | null>(null);
//   const [showCancelAlert, setShowCancelAlert] = useState(false);
// const { setTrackingOpen , setActiveOrderId} = useApp();

// const user = auth.currentUser;



//   const hasCreatedRef = useRef(false);


// //creating order
// // useEffect(() => {
// //   if (hasCreatedRef.current) return;

// //   const user = auth.currentUser;

// //   if (!user) {
// //     console.error("No authenticated user found");
// //     return;
// //   }

// //   const ordersRef = ref(rtdb, "orders");

// //   const newOrderRef = push(ordersRef, {
// //     service,
// //     address,
// //     latLng,

// //     // 🔐 USER INFO
// //     userId: user.uid,
// //     userEmail: user.email || null,

// //     status: "SEARCHING",
// //     createdAt: Date.now()
// //   });

// //   hasCreatedRef.current = true;
// //   setOrderId(newOrderRef.key);
// // }, []);

// useEffect(() => {
//   if (hasCreatedRef.current) return;

//   const user = auth.currentUser;
//   if (!user) return;

//   const ordersRef = ref(rtdb, "orders");

//   const newOrderRef = push(ordersRef, {
//     service,
//     address,
//     latLng,
//     userId: user.uid,
//     userEmail: user.email || null,
//     status: "SEARCHING",
//     createdAt: Date.now()
//   });

//   hasCreatedRef.current = true;
//   setOrderId(newOrderRef.key);

//   // ✅ PERSIST ACTIVE ORDER
//   setActiveOrderId(newOrderRef.key);
// }, []);



//   // 2️⃣ LISTEN FOR REALTIME UPDATES
//   useEffect(() => {
//     if (!orderId) return;

//     const orderRef = ref(rtdb, `orders/${orderId}`);

//     onValue(orderRef, (snapshot) => {
//       const data = snapshot.val();
//       if (!data) return;

//       setStatus(data.status);

//       if (data.status === "ACCEPTED") {
//   setTrackingOpen(true);         // open tracking modal
//   onClose();                     // close searching modal
// }

//       if (data.status === "CANCELLED") {
//          setActiveOrderId(null);
//         onClose();

//       }
//     });

//     return () => off(orderRef);
//   }, [orderId]);

//   // 3️⃣ CANCEL ORDER
//   const cancelOrder = async () => {
//     if (!orderId) return;

//     const orderRef = ref(rtdb, `orders/${orderId}`);
//     await update(orderRef, {
//       status: "CANCELLED",
//       cancelledAt: Date.now(),
//       cancelledBy: "CUSTOMER"
//     });
// setActiveOrderId(null);
//     onClose();
//   };

//   return (
//     <>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Searching</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent>
//         <Container>
//           <IonSpinner name="crescent" />

//           <StatusText>
//             {status === "SEARCHING" && "Searching for provider..."}
//             {status === "ACCEPTED" && "Provider accepted your request"}
//           </StatusText>

//           {status === "SEARCHING" && (
//             <IonButton
//               fill="outline"
//               color="danger"
//               style={{ marginTop: 20 }}
//               onClick={() => setShowCancelAlert(true)}

//             >
//               Cancel Request
//             </IonButton>
//           )}


//           <IonAlert
//   isOpen={showCancelAlert}
//   onDidDismiss={() => setShowCancelAlert(false)}
//   header="Cancel Request?"
//   message="Are you sure you want to cancel this service request?"
//   buttons={[
//     {
//       text: "No",
//       role: "cancel"
//     },
//     {
//       text: "Yes, Cancel",
//       role: "destructive",
//       handler: () => cancelOrder()
//     }
//   ]}
// />

//         </Container>
//       </IonContent>
//     </>
//   );
// };

// export default SearchingModal;






import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonSpinner,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAlert
} from "@ionic/react";
import styled from "styled-components";
import { ref, onValue, off, update } from "firebase/database";
import { rtdb, auth } from "../firebaseConfig";
import { useApp } from "../context/AppContext";

const Container = styled.div`
  padding: 18px;
  background: #f6f8ff;
  min-height: 100%;
  text-align: center;
`;

interface Props {
  onClose: () => void;
}
const SearchingModal: React.FC<Props> = ({ onClose }) => {
  const { setTrackingOpen, setOpenSearchingModal } = useApp();

  const [order, setOrder] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  // Find SEARCHING order for this user
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ordersRef = ref(rtdb, "orders");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const orders = snapshot.val();
      if (!orders) return;

      const found = Object.entries<any>(orders).find(
        ([_, o]) => o.userId === user.uid && o.status === "SEARCHING"
      );

      if (!found) {
        setOrder(null);
        setOrderId(null);
        setOpenSearchingModal(false); // close modal
        return;
      }

      const [id, data] = found;
      setOrderId(id);
      setOrder(data);
    });

    return () => off(ordersRef);
  }, [setOpenSearchingModal]);

  // Listen for status changes
  useEffect(() => {
    if (!orderId) return;

    const orderRef = ref(rtdb, `orders/${orderId}`);

    const unsubscribe = onValue(orderRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setOrder(data);

      if (data.status === "ACCEPTED") {
        setTrackingOpen(true);
        setOpenSearchingModal(false);
      }

      if (data.status === "CANCELLED") {
        setOrder(null);
        setOrderId(null);
        setOpenSearchingModal(false); // close modal cleanly
      }
    });

    return () => off(orderRef);
  }, [orderId, setOpenSearchingModal, setTrackingOpen]);

  const cancelOrder = async () => {
    if (!orderId) return;

    await update(ref(rtdb, `orders/${orderId}`), {
      status: "CANCELLED",
      cancelledAt: Date.now(),
      cancelledBy: "CUSTOMER"
    });

    // modal will close via listener
  };

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Searching</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <Container>
          <IonSpinner name="crescent" />

          {order ? (
            <>
              <h3>Searching for provider…</h3>
              <p><strong>{order.service?.title}</strong></p>
              <p>{order.service.desc}</p>
              {/* <p>{order.address}</p> */}

              <IonButton
                fill="outline"
                color="danger"
                onClick={() => setShowCancelAlert(true)}
                style={{ marginTop: 20 }}
              >
                Cancel Request
              </IonButton>
            </>
          ) : (
            <h3>Closing…</h3> // temporary message until modal disappears
          )}

          <IonAlert
            isOpen={showCancelAlert}
            onDidDismiss={() => setShowCancelAlert(false)}
            header="Cancel Request?"
            message="Are you sure you want to cancel?"
            buttons={[
              { text: "No", role: "cancel" },
              { text: "Yes", role: "destructive", handler: cancelOrder }
            ]}
          />
        </Container>
      </IonContent>
    </>
  );
};

export default SearchingModal