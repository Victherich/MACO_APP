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
import { db } from "../firebaseConfig"; // adjust path if needed

interface Props {
  booking: any;
  onClose: () => void;
}

const BookingDetailsModal: React.FC<Props> = ({ booking, onClose }) => {
  const [provider, setProvider] = useState<any | null>(null);
  const [loadingProvider, setLoadingProvider] = useState(false);

  console.log("Booking data:", booking);

  // 🔹 Fetch provider details from Firestore
  useEffect(() => {
    if (!booking?.providerId) return;

    const fetchProvider = async () => {
      setLoadingProvider(true);
      try {
        const ref = doc(db, "users", booking.providerId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProvider(snap.data());
        }
      } catch (err) {
        console.error("Error fetching provider:", err);
      }
      setLoadingProvider(false);
    };

    fetchProvider();
  }, [booking?.providerId]);

  if (!booking) return null;

  return (
    <IonModal isOpen={!!booking} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Booking Details</IonTitle>

          <IonButton slot="end" fill="clear" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* BOOKING ID */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Booking ID</strong>
            <p>{booking.id}</p>
          </IonLabel>
        </IonItem>

        {/* SERVICE */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Service</strong>
            <p>{booking.service.title}</p>
          </IonLabel>
        </IonItem>

        {/* DESCRIPTION */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Description</strong>
            <p>{booking.service.desc}</p>
          </IonLabel>
        </IonItem>

        {/* PROVIDER DETAILS */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Provider Name</strong>
            {loadingProvider ? (
              <IonSpinner name="dots" />
            ) : (
              <p>{provider?.name || "—"}</p>
            )}
          </IonLabel>
        </IonItem>

        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Provider Email</strong>
            <p>{booking.providerEmail || provider?.email || "—"}</p>
          </IonLabel>
        </IonItem>

        {/* STATUS */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Status</strong>
            <p>{booking.status}</p>
          </IonLabel>
        </IonItem>

        {/* PAYMENT STATUS */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Payment Status</strong>
            <p>{booking.payment_status}</p>
          </IonLabel>
        </IonItem>

        {/* PRICE */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Price</strong>
            <p>{booking.service.price}</p>
          </IonLabel>
        </IonItem>

        {/* ADDRESS */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Address</strong>
            <p>{booking.address || "—"}</p>
          </IonLabel>
        </IonItem>

        {/* BOOKED AT */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Booked At</strong>
            <p>
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleString()
                : "—"}
            </p>
          </IonLabel>
        </IonItem>

        {/* ACCEPTED AT */}
        <IonItem>
          <IonLabel>
            <strong style={{ color: "blue" }}>Accepted At</strong>
            <p>
              {booking.acceptedAt
                ? new Date(booking.acceptedAt).toLocaleString()
                : "Not yet accepted"}
            </p>
          </IonLabel>
        </IonItem>
      </IonContent>
    </IonModal>
  );
};

export default BookingDetailsModal;
