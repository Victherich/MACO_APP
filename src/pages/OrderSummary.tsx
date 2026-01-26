import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useLocation, useHistory } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";

import { ref, onValue, off } from "firebase/database";
import { rtdb } from "../firebaseConfig";

const Container = styled.div`
  padding: 18px;
  background: #f6f8ff;
  min-height: 100vh;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0 0 12px;
  font-size: 20px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #444;
`;

const Label = styled.span`
  color: #777;
`;

const OrderSummary: React.FC = () => {
  const location = useLocation<any>();
  const history = useHistory();
  const { orderId } = location.state;

  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const orderRef = ref(rtdb, `orders/${orderId}`);

    const unsub = onValue(orderRef, (snapshot) => {
      setOrder(snapshot.val());
    });

    return () => off(orderRef);
  }, [orderId]);

  if (!order) return null;

  const createdTime = new Date(order.createdAt).toLocaleString();
  const completedTime = order.completedAt
    ? new Date(order.completedAt).toLocaleString()
    : "—";

  return (
    <IonPage>
      <Header title="Order Summary" />
      <IonContent fullscreen>
        <Container>

          {/* SERVICE INFO */}
          <Card>
            <Title>Service Details</Title>
            <Row>
              <Label>Service</Label>
              <span>{order.service?.title}</span>
            </Row>
            <Row>
              <Label>Price</Label>
              <span>{order.service?.price}</span>
            </Row>
          </Card>

          {/* LOCATION */}
          <Card>
            <Title>Location</Title>
            <p>{order.address}</p>
          </Card>

          {/* TIME INFO */}
          <Card>
            <Title>Timing</Title>
            <Row>
              <Label>Requested At</Label>
              <span>{createdTime}</span>
            </Row>
            <Row>
              <Label>Completed At</Label>
              <span>{completedTime}</span>
            </Row>
          </Card>

          {/* PAYMENT */}
          <IonButton
            expand="block"
            style={{ marginTop: 24 }}
            onClick={() =>
              history.push("/payment", { orderId })
            }
          >
            Proceed to Payment
          </IonButton>

        </Container>
      </IonContent>
    </IonPage>
  );
};

export default OrderSummary;
