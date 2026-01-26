import React, { useState } from "react";
import {
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle
} from "@ionic/react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { IonModal } from "@ionic/react";
import SearchingModal from "./SearchingModal";
import { IonAlert } from "@ionic/react";



const Container = styled.div`
  padding: 18px;
  background: #f6f8ff;
  min-height: 100%;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #2b2b2b;
`;

const Desc = styled.p`
  color: #6b6b6b;
`;

interface Props {
  service: any;
  onClose: () => void;
}

const ConfirmLocationModal: React.FC<Props> = ({ service, onClose }) => {
  const history = useHistory();
  const [openSearching, setOpenSearching] = useState(false);
  const [showRequestAlert, setShowRequestAlert] = useState(false);



  // dummy location
  const [address] = useState("Al Barsha, Dubai");
  const [latLng] = useState({ lat: 25.118, lng: 55.2 });

  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Confirm Location</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <Container>
          <Title>{service.title}</Title>
          <Desc>Pickup Location</Desc>

          <div
            style={{
              margin: "12px 0",
              padding: 14,
              background: "#fff",
              borderRadius: 12
            }}
          >
            {address}
          </div>

        <IonButton expand="block" onClick={() => setShowRequestAlert(true)}>
  Request Now
</IonButton>

<IonModal
  isOpen={openSearching}
  onDidDismiss={() => setOpenSearching(false)}
>
  <SearchingModal
    service={service}
    address={address}
    latLng={latLng}
    onClose={() => setOpenSearching(false)}
  />
</IonModal>

<IonAlert
  isOpen={showRequestAlert}
  onDidDismiss={() => setShowRequestAlert(false)}
  header="Confirm Service Request"
  message="Do you want to request this service at the selected location?"
  buttons={[
    {
      text: "No",
      role: "cancel"
    },
    {
      text: "Yes, Request",
      handler: () => {
        setShowRequestAlert(false);
        setOpenSearching(true);
      }
    }
  ]}
/>


        </Container>
      </IonContent>
    </>
  );
};

export default ConfirmLocationModal;
