import React from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton
} from "@ionic/react";

import { PayPalButtons } from "@paypal/react-paypal-js";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
}

const PayPalPaymentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  amount,
  onSuccess
}) => {

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pay with PayPal</IonTitle>

          <IonButton slot="end" fill="clear" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent style={{ padding: 20 }}>

        <PayPalButtons
          style={{ layout: "vertical" }}

          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount.toString()
                  }
                }
              ]
            });
          }}

          onApprove={async (data, actions) => {

            const details = await actions.order?.capture();

            console.log("Payment successful:", details);

            await onSuccess();

            onClose();
          }}

          onError={(err) => {
            console.error("PayPal error:", err);
          }}
        />

      </IonContent>
    </IonModal>
  );
};

export default PayPalPaymentModal;