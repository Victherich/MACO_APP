// import React, { useEffect, useState } from "react";
// import {
//   IonModal,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonContent,
//   IonButton,
//   IonSpinner
// } from "@ionic/react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   Elements,
//   PaymentElement,
//   useStripe,
//   useElements
// } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(
//   import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
// );

// interface Props {
//   isOpen: boolean;
//   amount: number; // in AED
//   orderId: string;
//   onClose: () => void;
// }

// const CheckoutForm: React.FC<Props> = ({ amount, orderId, onClose }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [loading, setLoading] = useState(false);
//   const [clientSecret, setClientSecret] = useState<string | null>(null);

//   // 🔐 Create PaymentIntent via backend
//   useEffect(() => {
//     fetch("/create-payment-intent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         amount,
//         currency: "aed",
//         orderId
//       })
//     })
//       .then(res => res.json())
//       .then(data => setClientSecret(data.clientSecret));
//   }, []);

//   const handlePay = async () => {
//     if (!stripe || !elements) return;

//     setLoading(true);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         return_url: window.location.origin
//       }
//     });

//     if (!error) {
//       onClose();
//     }

//     setLoading(false);
//   };

//   if (!clientSecret) {
//     return <IonSpinner />;
//   }

//   return (
//     <>
//       <PaymentElement />

//       <IonButton
//         expand="block"
//         style={{ marginTop: 20 }}
//         onClick={handlePay}
//         disabled={!stripe || loading}
//       >
//         {loading ? "Processing…" : `Pay AED ${amount}`}
//       </IonButton>
//     </>
//   );
// };

// const PaymentModal: React.FC<Props> = ({ isOpen, onClose, amount, orderId }) => {
//   return (
//     <IonModal isOpen={isOpen} onDidDismiss={onClose}>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Secure Payment</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent style={{ padding: 16 }}>
//         <Elements
//           stripe={stripePromise}
//           options={{
//             mode: "payment",
//             currency: "aed",
//             amount: amount * 100
//           }}
//         >
//           <CheckoutForm
//             amount={amount}
//             orderId={orderId}
//             isOpen={isOpen}
//             onClose={onClose}
//           />
//         </Elements>
//       </IonContent>
//     </IonModal>
//   );
// };

// export default PaymentModal;




import React from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonAlert
} from "@ionic/react";
import { ref, update } from "firebase/database";
import { rtdb } from "../firebaseConfig"; // your RTDB instance
import { useHistory } from "react-router-dom"; // or your router hook
import { useApp } from "../context/AppContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: any; // pass the full order object
  amount: any;
  orderId:any;
}

const PaymentModal: React.FC<Props> = ({ isOpen, onClose, orderId, order, amount }) => {
  const {showAlert, setShowAlert} = useApp();

  console.log(orderId)

  const history = useHistory();

  const markAsPaid = async () => {
    if (!orderId) return;

    try {
      const orderRef = ref(rtdb, `orders/${orderId}`);
      await update(orderRef, { payment_status: "PAID" });
      setShowAlert(true);
    } catch (err) {
      console.error("Error marking order as PAID:", err);
    }
  };

 

  if (!orderId) return null;

  return (
    <>
      <IonModal isOpen={isOpen} onDidDismiss={onClose}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Order Summary</IonTitle>
            <IonButton slot="end" fill="clear" onClick={onClose}>
                                Close
                              </IonButton>
          </IonToolbar>
        </IonHeader>

        <IonContent style={{ padding: 16 }}>
          {/* 🔹 Order Summary */}
          <IonItem>
            <IonLabel>
              <strong>Service</strong>
              <p>{order.service?.title || "—"}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <strong>Description</strong>
              <p>{order.service?.desc || "—"}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <strong>Price</strong>
              <p>{order.service?.price || "—"}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <strong>Address</strong>
              <p>{order.address || "—"}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <strong>Booked At</strong>
              <p>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : "—"}
              </p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <strong>Accepted At</strong>
              <p>
                {order.acceptedAt
                  ? new Date(order.acceptedAt).toLocaleString()
                  : "Not yet accepted"}
              </p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <strong>Payment Status</strong>
              <p>{order.payment_status || "NOT_PAID"}</p>
            </IonLabel>
          </IonItem>

          {/* 🔹 Mark as Paid Button */}
          <IonButton
            expand="block"
            color="success"
            style={{ marginTop: 16 }}
            onClick={markAsPaid}
          >
            PAY NOW
          </IonButton>
        </IonContent>
      </IonModal>

     
    </>
  );
};

export default PaymentModal;
