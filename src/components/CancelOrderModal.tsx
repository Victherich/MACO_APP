import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner
} from "@ionic/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  providerId?: string;
}

const CancelOrderModal: React.FC<Props> = ({ isOpen, onClose, providerId }) => {
  const [provider, setProvider] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!providerId || !isOpen) return;

    const fetchProvider = async () => {
      setLoading(true);
      try {
        const ref = doc(db, "users", providerId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProvider(snap.data());
        }
      } catch (err) {
        console.error("Error fetching provider:", err);
      }
      setLoading(false);
    };

    fetchProvider();
  }, [providerId, isOpen]);

  // SAME CALL METHOD YOU USED BEFORE ✅
  const callProvider = () => {
    if (!provider?.phone) return;
    window.open(`tel:${provider.phone}`);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cancel Order</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            Back
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ textAlign: "center" }}>
        {loading && <IonSpinner />}

        {!loading && provider && (
          <>
            <h3>To cancel this order, please call the provider:</h3>

            <h2 style={{ margin: "20px 0" }}>
              {provider.phone || "—"}
            </h2>

            {provider.phone && (
              <IonButton
                expand="block"
                color="danger"
                onClick={callProvider}
              >
                Call Provider
              </IonButton>
            )}
          </>
        )}

        {!loading && !provider && (
          <p>No provider details found.</p>
        )}
      </IonContent>
    </IonModal>
  );
};

export default CancelOrderModal;
