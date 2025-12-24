
// // import React, { useEffect, useRef } from 'react';
// // import {
// //   IonPage,
// //   IonHeader,
// //   IonToolbar,
// //   IonTitle,
// //   IonContent,
// //   IonCard,
// //   IonCardHeader,
// //   IonCardTitle,
// //   IonCardContent
// // } from '@ionic/react';


// // const PayPalPayment: React.FC = () => {
// //   const paypalRef = useRef<HTMLDivElement>(null);

// //   useEffect(() => {
// //     // Load PayPal script dynamically
// //     const script = document.createElement('script');
// //     script.src = "https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"; // Replace with your PayPal client ID
// //     script.addEventListener('load', () => {
// //       // @ts-ignore
// //       window.paypal.Buttons({
// //         createOrder: (data: any, actions: any) => {
// //           return actions.order.create({
// //             purchase_units: [{
// //               amount: {
// //                 value: '10.00' // Set the payment amount
// //               }
// //             }]
// //           });
// //         },
// //         onApprove: async (data: any, actions: any) => {
// //           const order = await actions.order.capture();
// //           alert(`Payment successful! Transaction ID: ${order.id}`);
// //           console.log(order);
// //         },
// //         onError: (err: any) => {
// //           console.error(err);
// //           alert('Payment failed!');
// //         }
// //       }).render(paypalRef.current);
// //     });
// //     document.body.appendChild(script);
// //   }, []);

// //   return (
// //     <IonPage>
// //       <IonHeader>
// //         <IonToolbar>
// //           <IonTitle>PayPal Payment</IonTitle>
// //         </IonToolbar>
// //       </IonHeader>

// //       <IonContent fullscreen>
// //         <IonCard>
// //           <IonCardHeader>
// //             <IonCardTitle>Pay with PayPal</IonCardTitle>
// //           </IonCardHeader>
// //           <IonCardContent>
// //             <p>Click the button below to pay $10.00 using PayPal.</p>
// //             <div ref={paypalRef} />
// //           </IonCardContent>
// //         </IonCard>
// //       </IonContent>
// //     </IonPage>
// //   );
// // };

// // export default PayPalPayment;





// import React, { useEffect, useState } from "react";
// import {
//   IonPage,
//   IonContent,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonSpinner,
//   IonToast,
// } from "@ionic/react";
// import styled from "styled-components";
// import { Preferences } from "@capacitor/preferences";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebaseConfig";

// /** 
//  * PayPalPayment.tsx — Ionic version of your RN WebView screen.
//  * - Loads pending order from Preferences
//  * - Opens PayPal page inside iframe
//  * - Detects success/cancel via URL
//  * - On success: writes order to Firestore + sends email
//  */

// const Iframe = styled.iframe`
//   width: 100%;
//   height: 100%;
//   border: none;
// `;

// const PayPalPayment: React.FC = () => {
//   const [orderData, setOrderData] = useState<any | null>(null);
//   const [paymentUrl, setPaymentUrl] = useState("");
//   const [toast, setToast] = useState({ show: false, message: "" });

//   const showMessage = (msg: string) => setToast({ show: true, message: msg });

//   useEffect(() => {
//     const loadPendingOrder = async () => {
//       const pending = await Preferences.get({ key: "pendingOrder" });
//       if (!pending.value) {
//         showMessage("No pending order found.");
//         return;
//       }

//       const parsed = JSON.parse(pending.value);
//       setOrderData(parsed);

//       const url = `https://backend-mailer-1.vercel.app/api/paypal?amount=${parsed.priceUSD}`;
//       setPaymentUrl(url);
//     };

//     loadPendingOrder();
//   }, []);

//   /** Listen for messages from iframe */
//   useEffect(() => {
//     const listener = async (event: MessageEvent) => {
//       if (!event.data || typeof event.data !== "string") return;

//       // SUCCESS
//       if (event.data.includes("success")) {
//         const urlParams = new URLSearchParams(event.data.split("?")[1]);
//         const paymentId = urlParams.get("paymentId");

//         if (paymentId) {
//           await finalizeOrder(paymentId);
//         }
//       }

//       // CANCEL
//       if (event.data.includes("cancel")) {
//         showMessage("Payment cancelled.");
//         setTimeout(() => (window.location.href = "/booking"), 1500);
//       }
//     };

//     window.addEventListener("message", listener);
//     return () => window.removeEventListener("message", listener);
//   }, [orderData]);

//   /** Finalize the order after PayPal success */
//   const finalizeOrder = async (paymentId: string) => {
//     try {
//       const finalOrder = {
//         ...orderData,
//         paymentStatus: "PAID",
//         paymentDetails: {
//           method: "PayPal",
//           status: "PAID",
//           transactionId: paymentId,
//         },
//         createdAt: serverTimestamp(),
//       };

//       await addDoc(collection(db, "orders"), finalOrder);

//       // Send email receipt
//       await fetch("https://backend-mailer-1.vercel.app/api/matthew_car_wash_order_email_sender", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(finalOrder),
//       });

//       // Clear pending order & service
//       await Preferences.remove({ key: "pendingOrder" });
//       await Preferences.remove({ key: "selectedService" });

//       showMessage("Payment successful!");

//       setTimeout(() => (window.location.href = "/home"), 1200);
//     } catch (err) {
//       console.error("Payment finalization error:", err);
//       showMessage("Error completing payment.");
//     }
//   };

//   if (!orderData || !paymentUrl) {
//     return (
//       <IonPage>
//         <IonHeader>
//           <IonToolbar>
//             <IonTitle>PayPal</IonTitle>
//           </IonToolbar>
//         </IonHeader>
//         <IonContent>
//           <div style={{ textAlign: "center", paddingTop: 40 }}>
//             <IonSpinner />
//           </div>
//         </IonContent>
//       </IonPage>
//     );
//   }

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>PayPal Payment</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent fullscreen>
//         <Iframe
//           src={paymentUrl}
//           sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
//         />
//       </IonContent>

//       <IonToast
//         isOpen={toast.show}
//         message={toast.message}
//         duration={2000}
//         onDidDismiss={() => setToast({ show: false, message: "" })}
//       />
//     </IonPage>
//   );
// };

// export default PayPalPayment;



// import React, { useEffect, useState } from "react";
// import {
//   IonPage,
//   IonContent,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonSpinner,
//   IonToast,
// } from "@ionic/react";
// import { Browser } from "@capacitor/browser";
// import { Preferences } from "@capacitor/preferences";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebaseConfig";

// const PayPalPayment: React.FC = () => {
//   const [orderData, setOrderData] = useState<any | null>(null);
//   const [toast, setToast] = useState({ show: false, message: "" });

//   const showMessage = (message: string) => {
//     setToast({ show: true, message });
//   };

//   /** Start Payment */
//   useEffect(() => {
//     const start = async () => {
//       const pending = await Preferences.get({ key: "pendingOrder" });

//       if (!pending.value) {
//         showMessage("No pending order.");
//         return;
//       }

//       const parsed = JSON.parse(pending.value);
//       setOrderData(parsed);

//       const successUrl = "https://backend-mailer-1.vercel.app/paypal-success";
//       const cancelUrl = "https://backend-mailer-1.vercel.app/paypal-cancel";

//       const url = `https://backend-mailer-1.vercel.app/api/paypal?amount=${parsed.priceUSD}&return=${successUrl}&cancel=${cancelUrl}`;

//       await Browser.open({ url });

//       /** Detect when PayPal window closes */
//       Browser.addListener("browserFinished", async () => {
//         console.log("Browser closed, checking status...");

//         // Check status from backend
//         const res = await fetch(
//           `https://backend-mailer-1.vercel.app/api/paypal/status`
//         );
//         const status = await res.json();

//         if (status.success) {
//           finalizeOrder(status.paymentId);
//         } else {
//           showMessage("Payment cancelled.");
//           setTimeout(() => (window.location.href = "/booking"), 1200);
//         }
//       });
//     };

//     start();
//   }, []);

//   /** Finalize order after PayPal approval */
//   const finalizeOrder = async (paymentId: string) => {
//     try {
//       const final = {
//         ...orderData,
//         paymentStatus: "PAID",
//         paymentDetails: {
//           method: "PayPal",
//           status: "PAID",
//           transactionId: paymentId,
//         },
//         createdAt: serverTimestamp(),
//       };

//       await addDoc(collection(db, "orders"), final);

//       await fetch(
//         "https://backend-mailer-1.vercel.app/api/matthew_car_wash_order_email_sender",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(final),
//         }
//       );

//       await Preferences.remove({ key: "pendingOrder" });
//       await Preferences.remove({ key: "selectedService" });

//       showMessage("Payment successful!");
//       setTimeout(() => (window.location.href = "/home"), 1500);
//     } catch (err) {
//       console.error(err);
//       showMessage("Something went wrong.");
//     }
//   };

//   if (!orderData) {
//     return (
//       <IonPage>
//         <IonHeader>
//           <IonToolbar>
//             <IonTitle>PayPal</IonTitle>
//           </IonToolbar>
//         </IonHeader>
//         <IonContent>
//           <div style={{ textAlign: "center", marginTop: 60 }}>
//             <IonSpinner />
//           </div>
//         </IonContent>
//       </IonPage>
//     );
//   }

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>PayPal Payment</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent fullscreen>
//         <div style={{ textAlign: "center", marginTop: 30, fontSize: 18 }}>
//           Opening PayPal...
//         </div>
//       </IonContent>

//       <IonToast
//         isOpen={toast.show}
//         message={toast.message}
//         duration={2000}
//         onDidDismiss={() => setToast({ show: false, message: "" })}
//       />
//     </IonPage>
//   );
// };

// export default PayPalPayment;









import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { Browser } from "@capacitor/browser";
import { Preferences } from "@capacitor/preferences";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

const PayPalPayment: React.FC = () => {
  const [orderData, setOrderData] = useState<any | null>(null);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [loading, setLoading] = useState(true);

  const showMessage = (msg: string) => {
    setToast({ show: true, message: msg });
  };

  /** Load order only */
  useEffect(() => {
    const loadOrder = async () => {
      const pending = await Preferences.get({ key: "pendingOrder" });

      if (!pending.value) {
        showMessage("No pending order found.");
        setLoading(false);
        return;
      }

      setOrderData(JSON.parse(pending.value));
      setLoading(false);
    };

    loadOrder();
  }, []);

  /** Listen for PayPal return events */
  useEffect(() => {
    const listener = async (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "string") return;

      console.log("PAYPAL MESSAGE:", event.data);

      // SUCCESS
      if (event.data.includes("success")) {
        const params = new URLSearchParams(event.data.split("?")[1]);
        const paymentId = params.get("paymentId");
        if (paymentId) finalizeOrder(paymentId);
      }

      // CANCEL
      if (event.data.includes("cancel")) {
        showMessage("Payment cancelled.");
        await Browser.close();
        setTimeout(() => (window.location.href = "/booking"), 1500);
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [orderData]);

  /** Open PayPal when user taps button */
  const openPayPal = async () => {
    if (!orderData) return;

    const paypalUrl = `https://backend-mailer-1.vercel.app/api/paypal?amount=${orderData.priceUSD}`;

    await Browser.open({ url: paypalUrl }); // NO POPUP BLOCK IN APPS
  };

  /** Save final order */
  const finalizeOrder = async (paymentId: string) => {
    try {
      const finalOrder = {
        ...orderData,
        paymentStatus: "PAID",
        paymentDetails: {
          method: "PayPal",
          status: "PAID",
          transactionId: paymentId,
        },
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), finalOrder);

      // Email
      await fetch(
        "https://backend-mailer-1.vercel.app/api/matthew_car_wash_order_email_sender",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalOrder),
        }
      );

      await Browser.close();
      await Preferences.remove({ key: "pendingOrder" });
      await Preferences.remove({ key: "selectedService" });

      showMessage("Payment successful!");
      setTimeout(() => (window.location.href = "/home"), 1500);
    } catch (err) {
      console.error("ERROR:", err);
      showMessage("Something went wrong.");
      await Browser.close();
    }
  };

  // ---------------- UI ----------------

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>PayPal</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <IonSpinner />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!orderData) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>PayPal Payment</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            No order found.
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PayPal Payment</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div style={{ padding: 20, textAlign: "center" }}>
          <h2>Amount to Pay: ${orderData.priceUSD}</h2>

          <IonButton
            expand="block"
            color="primary"
            onClick={openPayPal}
            style={{ marginTop: "20px" }}
          >
            Continue to PayPal
          </IonButton>
        </div>
      </IonContent>

      <IonToast
        isOpen={toast.show}
        message={toast.message}
        duration={2000}
        onDidDismiss={() => setToast({ show: false, message: "" })}
      />
    </IonPage>
  );
};

export default PayPalPayment;
