// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// const initialOptions = {
//   "client-id": "AVw5SK5QbcJalyLRwng7Dilfy3Wj16c8zzLmbX55Ff6TGs-7js8FdE8z7ZjWWEOknSyNfd9ITIf2pWEx",
//   currency: "USD", // or AED
//   intent: "capture"
// };


// const container = document.getElementById('root');
// const root = createRoot(container!);
// root.render(
//   <PayPalScriptProvider options={initialOptions}>
//   <App />
// </PayPalScriptProvider>
// );




import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const Root = () => {
  const [paypalOptions, setPaypalOptions] = useState<any>(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const docRef = doc(db, "app_config", "paypal");
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const data = snap.data();

          setPaypalOptions({
            "client-id": data.clientId,
            currency: data.currency,
            intent: data.intent,
          });
        }
      } catch (error) {
        console.error("Error loading PayPal config:", error);
      }
    };

    loadConfig();
  }, []);

  if (!paypalOptions) {
    return <div>Loading payment system...</div>;
  }

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <App />
    </PayPalScriptProvider>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Root />);