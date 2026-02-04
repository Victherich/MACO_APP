import React, {useEffect, useState} from "react";
import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  useIonViewWillEnter,
  IonModal,
  IonButton,IonAlert
} from "@ionic/react";
import styled from "styled-components";
import Header from "../components/Header";
import { useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ServiceDetailsModal from "../components/ServiceDetailsModal";
import { useApp } from "../context/AppContext";
import TrackingModal from "../components/TrackingModal";
import UserInfo from "../components/UserInfo";
import { ref, onValue, off } from "firebase/database";
import { rtdb, auth } from "../firebaseConfig";
import SearchingModal from "../components/SearchingModal";






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
        title: "4x / month",
        desc: "Premium monthly plan with deeper cleaning (4 visits per month)",
        price: "AED 50",
      },
      {
        icon: "🚘",
        title: "8x / month",
        desc: "Premium monthly plan with deeper cleaning (8 visits per month)",
        price: "AED 80",
      },
      {
        icon: "🚘",
        title: "12x / month",
        desc: "Ultimate monthly plan for daily use cars (12 visits per month)",
        price: "AED 100",
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
    category: "Handyman Services",
    items: [
      {
        icon: "🔧",
        title: "4x / month",
        desc: "Subscription package for regular handyman work (monthly plan)",
        price: "AED 420",
      },

    ],
  },
];


const DashboardHome: React.FC = () => {
  const history= useHistory();
const [isOpen, setIsOpen] = useState(false);
const [selectedService, setSelectedService] = useState<any>(null);
const { activeOrderId, isTrackingOpen, setTrackingOpen , setActiveOrderId, openSearchingModal, setOpenSearchingModal} = useApp();
const [showNoBookingAlert, setShowNoBookingAlert] = useState(false);
const [hasActiveBooking, setHasActiveBooking] = useState(false);




  


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





useEffect(() => {
  if (!user) return;

  const ordersRef = ref(rtdb, "orders");

  const unsubscribe = onValue(ordersRef, (snapshot) => {
    const orders = snapshot.val();
    if (!orders) {
      setHasActiveBooking(false);
      return;
    }

    // ✅ 👇 THIS CODE GOES RIGHT HERE
    const active = Object.entries(orders).find(
      ([_, order]: any) =>
        order.userId === user.uid &&
        (order.status === "ACCEPTED" ||
          order.status === "IN_PROGRESS" ||
          order.status === "COMPLETED")
    );

    if (!active) {
      setHasActiveBooking(false);
      return;
    }

    setHasActiveBooking(true);

    const [orderId, data]: any = active;

    // setActiveOrder(data);
    // setStatus(data.status);
    // setActiveOrderId(orderId);

    // map + markers logic continues here...
  });

  return () => off(ordersRef);
}, [user]);






useEffect(() => {
  if (!user) return;

  const ordersRef = ref(rtdb, "orders");

  const unsubscribe = onValue(ordersRef, (snapshot) => {
    const orders = snapshot.val();

    if (!orders) {
      setOpenSearchingModal(false);
      return;
    }

    const searchingOrder = Object.values<any>(orders).find(
      (order) =>
        order.userId === user.uid &&
        order.status === "SEARCHING"
    );

    setOpenSearchingModal(!!searchingOrder);
  });

  return () => off(ordersRef);
}, [user]);



// 🔹 AUTO-OPEN TRACKING MODAL WHEN THERE IS AN ACTIVE BOOKING
useEffect(() => {
  if (hasActiveBooking && !isTrackingOpen) {
    setTrackingOpen(true);
  }
}, [hasActiveBooking]);





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

                   
 <IonButton
  expand="block"
  onClick={() => {
    if (hasActiveBooking) {
      setTrackingOpen(true);
    } else {
      setShowNoBookingAlert(true);
    }
  }}
>
  Ongoing Booking
</IonButton>




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





          <IonModal
  isOpen={isTrackingOpen}
  canDismiss={false}
>
    <TrackingModal
      onClose={() => setTrackingOpen(false)}
    />
</IonModal>


<IonModal isOpen={openSearchingModal}>
  <SearchingModal onClose={() => setOpenSearchingModal(false)} />
</IonModal>





<IonAlert
  isOpen={showNoBookingAlert}
  onDidDismiss={() => setShowNoBookingAlert(false)}
  header="No Active Booking"
  message="You have no ongoing booking at the moment."
  buttons={["OK"]}
/>


        </Container>
      </IonContent>
    </IonPage>
  );
};

export default DashboardHome;
