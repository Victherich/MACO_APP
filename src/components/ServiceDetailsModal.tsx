import React from "react";
import { IonContent, IonButton, IonHeader, IonToolbar, IonTitle } from "@ionic/react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { IonModal } from "@ionic/react";
import { useState } from "react";
import ConfirmLocationModal from "./ConfirmLocationModal";


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

const Emoji = styled.div`
  font-size: 100px;
  text-align: center;
`;

const Price = styled.p`
  color: #1a6cff;
  font-weight: 700;
  text-align: center;
`;

interface Props {
  service: any;
  onClose: () => void;
}

const ServiceDetailsModal: React.FC<Props> = ({ service, onClose }) => {
  const history = useHistory();
  const [openConfirm, setOpenConfirm] = useState(false);


  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Service Details</IonTitle>
          <IonButton slot="end" fill="clear" onClick={onClose}>
            Close
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <Container>
          <Title>{service.title}</Title>
          <Emoji>{service.icon}</Emoji>
          <Desc>{service.desc}</Desc>
          <Price>{service.price}</Price>

     <IonButton expand="block" onClick={() => setOpenConfirm(true)}>
  Continue
</IonButton>

<IonModal
  isOpen={openConfirm}
  onDidDismiss={() => setOpenConfirm(false)}
>
  <ConfirmLocationModal
    service={service}
    onClose={() => setOpenConfirm(false)}
  />
</IonModal>


        </Container>
      </IonContent>
    </>
  );
};

export default ServiceDetailsModal;
