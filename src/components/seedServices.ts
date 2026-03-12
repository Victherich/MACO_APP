import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export const seedAppConfig = async () => {
  try {
    await setDoc(doc(db, "app_config", "paypal"), {
      clientId: "AVw5SK5QbcJalyLRwng7Dilfy3Wj16c8zzLmbX55Ff6TGs-7js8FdE8z7ZjWWEOknSyNfd9ITIf2pWEx",
      currency: "USD",
      intent: "capture"
    });

    console.log("✅ PayPal config seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding PayPal config:", error);
  }
};