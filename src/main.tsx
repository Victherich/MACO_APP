import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id": "AVw5SK5QbcJalyLRwng7Dilfy3Wj16c8zzLmbX55Ff6TGs-7js8FdE8z7ZjWWEOknSyNfd9ITIf2pWEx",
  currency: "USD", // or AED
  intent: "capture"
};


const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <PayPalScriptProvider options={initialOptions}>
  <App />
</PayPalScriptProvider>
);