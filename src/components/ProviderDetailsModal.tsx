import React, { useEffect, useState } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
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

const ProviderDetailsModal: React.FC<Props> = ({ isOpen, onClose, providerId }) => {
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

  // Function to trigger phone call
  const callProvider = () => {
    if (!provider?.phone) return;
    window.open(`tel:${provider.phone}`);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Provider Details</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {loading && <IonSpinner />}

        {!loading && provider && (
          <>
            <IonItem>
              <IonLabel>
                <strong style={{ color: "blue" }}>Name</strong>
                <p>{provider.name || "—"}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <strong style={{ color: "blue" }}>Email</strong>
                <p>{provider.email || "—"}</p>
              </IonLabel>
            </IonItem>

            <IonItem>
              <IonLabel>
                <strong style={{ color: "blue" }}>Phone</strong>
                <p>{provider.phone || "—"}</p>
              </IonLabel>
            </IonItem>

            {/* ✅ CALL PROVIDER BUTTON */}
            {provider.phone && (
              <IonButton
                expand="block"
                color="primary"
                style={{ marginTop: 16 }}
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

export default ProviderDetailsModal;
