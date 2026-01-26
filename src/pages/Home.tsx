import React, {useEffect, useState} from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  useIonViewWillEnter,
  IonModal,
  IonButton
} from "@ionic/react";
import styled from "styled-components";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ServiceDetailsModal from "../components/ServiceDetailsModal";
import { useApp } from "../context/AppContext";
import TrackingModal from "../components/TrackingModal";
import UserInfo from "../components/UserInfo";






const Container = styled.div`
  padding: 18px 5px;
  background: #f6f8ff;
  min-height: 100vh;
`;

const Title = styled.h1`
  color: #2b2b2b;
  font-size: 22px;
  margin: 0;
  font-weight: 700;
  margin-left:10px;
  margin-top:50px;
`;

const Subtitle = styled.p`
  color: #6b6b6b;
  margin: 4px 0 0 0;
  font-size: 14px;
  margin-left:10px;
`;

const CategoryTitle = styled.h2`
  color: #2b2b2b;
  font-size: 18px;
  font-weight: 700;
  margin: 18px 0 10px 0;
  margin-left:15px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 14px;
  // height: 140px; /* square card */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid #e3e6f0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
`;

const Emoji = styled.div`
  font-size: 28px;
  text-align: center;
  font-weight: 800;
`;

const CardTitle = styled.h3`
  color: #2b2b2b;
  font-size: 14px;
  margin: 0;
  font-weight: 700;
  text-align: center;
`;

const CardDesc = styled.p`
  color: #6b6b6b;
  margin: 0;
  font-size: 12px;
  text-align: center;
`;

const Price = styled.p`
  color: #1a6cff;
  font-weight: 700;
  font-size: 13px;
  margin: 0;
  text-align: center;
`;

const services = [
  {
    category: "Car Wash Cleaning",
    items: [
 
      {
        icon: "🚘",
        title: "8x / month",
        desc: "Premium monthly plan with deeper cleaning (8 visits per month)",
        price: "AED 80",
      },
      {
        icon: "🚙",
        title: "12x / month",
        desc: "Ultimate monthly plan for daily use cars (12 visits per month)",
        price: "AED 100",
      },
      {
        icon: "🧼",
        title: "Interior Clean",
        desc: "Full interior vacuum + wipe-down + dashboard cleaning",
        price: "AED 25",
      },
    
      {
        icon: "🧽",
        title: "Tyre + Wash",
        desc: "One-time tyre service plus full exterior wash bundle",
        price: "AED 120",
      },
      {
        icon: "🚿",
        title: "1x Wash",
        desc: "Standard exterior wash with quick drying finish",
        price: "AED 25",
      },
      {
        icon: "🚿",
        title: "Inside + Outside",
        desc: "Complete inside and outside cleaning in a single visit",
        price: "AED 40",
      },
    ],
  },
  {
    category: "Gardening Cleaning",
    items: [
      {
        icon: "🌿",
        title: "2x weekly",
        desc: "Weekly garden maintenance with watering and leaf clearing",
        price: "AED 100",
      },
      {
        icon: "🌱",
        title: "3x weekly",
        desc: "Weekly care with cutting, trimming, and cleaning services",
        price: "AED 150",
      },
      {
        icon: "🌳",
        title: "Daily (small)",
        desc: "Daily garden maintenance for small gardens (size-based pricing)",
        price: "AED 200",
      },
      {
        icon: "🌳",
        title: "Daily (medium)",
        desc: "Daily garden maintenance for medium gardens (size-based pricing)",
        price: "AED 250",
      },
      {
        icon: "🌳",
        title: "Daily (large)",
        desc: "Daily garden maintenance for large gardens (size-based pricing)",
        price: "AED 300",
      },
    ],
  },
  {
    category: "Home & Office Cleaning",
    items: [
      {
        icon: "🏠",
        title: "Per hour",
        desc: "Professional cleaning per hour without materials (customer supplies)",
        price: "AED 25",
      },
      {
        icon: "🧹",
        title: "Per hour",
        desc: "Hourly cleaning with premium materials included in the price",
        price: "AED 35",
      },
    ],
  },
  {
    category: "Maintenance",
    items: [
      {
        icon: "🛠️",
        title: "Routine",
        desc: "Routine inspection & maintenance service (price based on scope)",
        price: "AED - ",
      },
    ],
  },
  {
    category: "Handyman Services",
    items: [
      {
        icon: "🔧",
        title: "4x / month",
        desc: "Subscription package for regular handyman work (monthly plan)",
        price: "AED 420",
      },
      {
        icon: "🔌",
        title: "Non-subscriber",
        desc: "One-time handyman services based on required tasks and scope",
        price: "AED - ",
      },
    ],
  },
];


const DashboardHome: React.FC = () => {
  const history= useHistory();
const [isOpen, setIsOpen] = useState(false);
const [selectedService, setSelectedService] = useState<any>(null);
const { activeOrderId, isTrackingOpen, setTrackingOpen } = useApp();

  


const { user, loading } = useAuth();

useEffect(() => {
  if (!loading && !user) {
    history.replace("/login");
  }
}, [user, loading]);

  // useIonViewWillEnter(() => {
  //   if (!loading && !user) {
  //     history.push("/login");
  //   }
  // });

  return (
    <IonPage>
      <Header title="MACO" />

      <IonContent fullscreen>
        <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
  {selectedService && (
    <ServiceDetailsModal
      service={selectedService}
      onClose={() => setIsOpen(false)}
    />
  )}
</IonModal>

        <Container>

<UserInfo/>

                   {activeOrderId && (
  <IonButton expand="block" onClick={() => setTrackingOpen(true)}>
  Ongoing Booking
  </IonButton>
)}


          <Title>Service Dashboard</Title>
          <Subtitle>Click any service card to start booking</Subtitle>


          {services.map((category) => (
            <div key={category.category}>
              <CategoryTitle>{category.category}</CategoryTitle>
              <IonGrid>
                <IonRow>
                  {category.items.map((item, idx) => (
                    <IonCol size="4" key={idx}>
                      <Card
 onClick={() => {
  setSelectedService(item);
  setIsOpen(true);
}}

>
  <div>
    <Emoji>{item.icon}</Emoji>
    <CardTitle>{item.title}</CardTitle>
  </div>
  <Price>{item.price}</Price>
</Card>

                    </IonCol>
                  ))}
                </IonRow>
              </IonGrid>
            </div>
          ))}

          {activeOrderId && (
  <IonButton expand="block" onClick={() => setTrackingOpen(true)}>
    Ongoing Booking
  </IonButton>
)}


          <IonModal
  isOpen={isTrackingOpen && !!activeOrderId}
  canDismiss={false}
>
  {activeOrderId && (
    <TrackingModal
      orderId={activeOrderId}
      onClose={() => setTrackingOpen(false)}
    />
  )}
</IonModal>

        </Container>
      </IonContent>
    </IonPage>
  );
};

export default DashboardHome;
