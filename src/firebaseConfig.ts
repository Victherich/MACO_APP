
// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

/* ✅ Your Firebase configuration */
const firebaseConfig = {
  apiKey: "AIzaSyD_UARANWvdIF4YfVHu6NGU9sullXug2kM",
  authDomain: "matthew-car-wash-and-cleaning.firebaseapp.com",
  projectId: "matthew-car-wash-and-cleaning",
  storageBucket: "matthew-car-wash-and-cleaning.appspot.com",
  messagingSenderId: "1042442426170",
  appId: "1:1042442426170:web:47c60feae9144aaeb7a203",
  measurementId: "G-SXEFTW2NWR"
};

/* Initialize Firebase */
const app = initializeApp(firebaseConfig);

/* Optional: Analytics (works in browser or HTTPS) */
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

/* Export services for use in your app */
export const auth = getAuth(app);
export const db = getFirestore(app);
export { analytics };
export default app;
