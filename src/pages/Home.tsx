// import React, { useEffect, useState, useRef } from 'react';
// import {
//   IonPage,
//   IonContent,
//   IonText,
//   IonImg,
//   IonButton,
//   useIonViewWillEnter
// } from '@ionic/react';
// import { useHistory } from 'react-router-dom';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from '../firebaseConfig';
// import { Preferences } from '@capacitor/preferences';
// import styled from 'styled-components';
// import { App as CapacitorApp } from '@capacitor/app';
// import Logo2 from '../assets/logo.png';

// /* ------------------------- STYLED COMPONENTS ------------------------- */

// const Container = styled.div`
//   padding: 20px;
//   background-color: #f0f8ff;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   min-height: 100vh;
// `;

// const LogoWrapper = styled.div`
//   width: 100px;
//   height: 100px;
//   border-radius: 50%; /* makes the container circular */
//   overflow: hidden;   /* ensures the image is clipped to the circle */
//   margin-top: 20px;
//   margin-bottom: 10px;
// `;

// const Logo = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover; /* ensures the image fills the container without distortion */
// `;


// const Heading = styled.h3`
//   font-size: 18px;
//   color: #333;
//   margin: 0;
// `;

// const Brand = styled.h2`
//   font-size: 22px;
//   font-weight: bold;
//   color: #0072ff;
//   text-align: center;
//   margin-bottom: 20px;
// `;

// const SectionTitle = styled.h4`
//   font-size: 18px;
//   font-weight: 600;
//   margin: 15px 0;
//   align-self: flex-start;
//   color: #333;
// `;

// const ServicesGrid = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: space-around;
//   width: 100%;
//   gap: 8px;
// `;

// const Card = styled.div`
//   width: 45%;
//   background-color: #fff;
//   border-radius: 15px;
//   padding: 10px;
//   align-items: center;
//   margin-bottom: 15px;
//   box-shadow: 5px 5px 10px rgba(0,0,0,0.3);
//   display: flex;
//   flex-direction: column;
// `;

// const CardLabel = styled.p`
//   text-align: center;
//   font-size: 16px;
//   font-weight: 600;
//   color: #0072ff;
// `;


// // Wrapper for the card image
// const CardImageWrapper = styled.div`
//   width: 60px;
//   height: 60px;
//   border-radius: 50%;  /* circular */
//   overflow: hidden;    /* clip image to circle */
//   margin-top: 5px;
//   background-color: #eee; /* optional background while loading */
// `;

// // The actual image inside the wrapper
// const CardImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;  /* ensures image fills the container */
// `;

// const CardButton = styled(IonButton)`
//   --background: #64aaff;
//   --color: white;
//   margin-top: 10px;
// `;

// const StepsContainer = styled.div`
//   width: 100%;
//   margin-top: 10px;
// `;

// const Step = styled.p`
//   font-size: 14px;
//   color: #444;
//   margin-bottom: 8px;
// `;

// const HeroCarousel = styled.div`
//   width: 100%;
//   height: 140px;
//   background-color: #64aaff;
//   border-radius: 20px;
//   justify-content: center;
//   align-items: center;
//   margin: 25px 0;
//   display: flex;
// `;

// const HeroText = styled.p`
//   font-size: 22px;
//   font-weight: 700;
//   color: #fff;
//   text-align: center;
//   letter-spacing: 1px;
// `;

// const PromoCarouselWrapper = styled.div`
//   margin-top: 30px;
//   width: 100%;
//   height: 100px;
//   border-radius: 10px;
//   overflow: hidden;
//   background-color: rgb(134, 134, 238);
// `;

// const PromoText = styled.p`
//   color: #fff;
//   font-size: 16px;
//   font-weight: 600;
//   padding: 30px 10px;
// `;

// /* ------------------------- DATA ------------------------- */

// const carouselTexts = [
//   '🛠️ 1. CHOOSE YOUR PACKAGE BELOW',
//   '📞 2. BOOK / CONTACT US',
//   '🧘‍♂️ 3. RELAX AND WATCH US DELIVER 🚘✨',
// ];

// const promos = [
//   '🔥 20% OFF this week only!',
//   '🧽 Book now',
//   '🚘 We come to you',
//   '✨ Shine like new',
// ];

// /* ------------------------- HOME PAGE ------------------------- */

// const Home: React.FC = () => {
//   const history = useHistory();
//   const [services, setServices] = useState<any[]>([]);
//   const [services2, setServices2] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [carouselIndex, setCarouselIndex] = useState(0);
//   const promoRef = useRef<HTMLDivElement>(null);

//   /* ------------------------- CAROUSEL ------------------------- */
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCarouselIndex((prev) => (prev + 1) % carouselTexts.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   /* ------------------------- FETCH FIREBASE ------------------------- */
//   useIonViewWillEnter(() => {
//     const fetchServices = async () => {
//       try {
//         const querySnapshot1 = await getDocs(collection(db, 'services'));
//         setServices(querySnapshot1.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

//         const querySnapshot2 = await getDocs(collection(db, 'services2'));
//         setServices2(querySnapshot2.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   });

//   /* ------------------------- ANDROID BACK BUTTON EXIT ------------------------- */
//   useEffect(() => {
//     const handler = CapacitorApp.addListener('backButton', () => {
//       if (window.location.pathname === '/home') {
//         if (window.confirm('Exit App?')) CapacitorApp.exitApp();
//       }
//     });
//     return () => handler.remove();
//   }, []);

//   /* ------------------------- HANDLE BOOK NOW ------------------------- */
//   const handleBookNow = async (service: any) => {
//     await Preferences.set({
//       key: 'selectedService',
//       value: JSON.stringify(service),
//     });
//     history.push('/booking');
//   };

//   const handleBookNow2 = async (service: any) => {
//     await Preferences.set({
//       key: 'selectedService',
//       value: JSON.stringify(service),
//     });
//     history.push('/contact');
//   };

//   /* ------------------------- RENDER ------------------------- */

//   return (
//     <IonPage>
//       <IonContent fullscreen>
//         <Container>
//           <LogoWrapper>
//                <Logo src={Logo2} />
//           </LogoWrapper>
         
//           <Heading>Welcome to</Heading>
//           <Brand>MACO</Brand>

//           <HeroCarousel>
//             <HeroText>{carouselTexts[carouselIndex]}</HeroText>
//           </HeroCarousel>

//           <SectionTitle>Our Packages</SectionTitle>

//           <ServicesGrid>
//             {loading ? (
//               <IonText>Loading services...</IonText>
//             ) : (
//               services.map((service) => (
//                 <Card key={service.id}>
//                   <CardLabel>{service.title}</CardLabel>

//                   <CardImageWrapper>
//                       <CardImage src={service.imageUrl} />
//                   </CardImageWrapper>
                  
//                   <CardButton onClick={() => handleBookNow(service)}>
//                     Book now
//                   </CardButton>
//                 </Card>
//               ))
//             )}
//           </ServicesGrid>

//           <ServicesGrid>
//             {loading ? (
//               <IonText>Loading services...</IonText>
//             ) : (
//               services2.map((service) => (
//                 <Card key={service.id} style={{width:"100%"}}>
//                   <CardLabel>{service.title}</CardLabel>
//                   {service.packages?.map((p: any, i: number) => (
//                     <p key={i}>{p.name} {p.price ? `- AED ${p.price}` : ''}</p>
//                   ))}
//                   <CardButton onClick={() => handleBookNow2(service)}>
//                     Contact now
//                   </CardButton>
//                 </Card>
//               ))
//             )}
//           </ServicesGrid>

//           <SectionTitle>How It Works</SectionTitle>
//           <StepsContainer>
//             <Step>1️⃣ Choose your service</Step>
//             <Step>📅 Book / Contact us</Step>
//             <Step>🧽 We clean, you relax!</Step>
//           </StepsContainer>

//           <PromoCarouselWrapper ref={promoRef}>
//             {promos.map((promo, i) => (
//               <PromoText key={i}>{promo}</PromoText>
//             ))}
//           </PromoCarouselWrapper>
//         </Container>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default Home;






import React, { useEffect, useState, useRef } from 'react';
import {
  IonPage,
  IonContent,
  IonText,
  IonImg,
  IonButton,
  useIonViewWillEnter,
  IonAlert,
  IonHeader, IonToolbar,IonTitle
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Preferences } from '@capacitor/preferences';
import styled from 'styled-components';
import { App as CapacitorApp } from '@capacitor/app';
import Logo2 from '../assets/logo.png';
import type { PluginListenerHandle } from '@capacitor/core';
import Header from '../components/Header';
// import Header from './components/Header'


/* ------------------------- STYLED COMPONENTS ------------------------- */
const Container = styled.div`
  padding: 20px;
  background-color: #f0f8ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;
const LogoWrapper = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 10px;
`;
const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Heading = styled.h3`
  font-size: 18px;
  color: #333;
  margin: 0;
`;
const Brand = styled.h2`
  font-size: 22px;
  font-weight: bold;
  color: #0072ff;
  text-align: center;
  margin-bottom: 20px;
`;
const SectionTitle = styled.h4`
  font-size: 18px;
  font-weight: 600;
  margin: 15px 0;
  align-self: flex-start;
  color: #333;
`;
const ServicesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  gap: 8px;
`;
const Card = styled.div`
  width: 45%;
  background-color: #fff;
  border-radius: 15px;
  padding: 10px;
  align-items: center;
  margin-bottom: 15px;
  box-shadow: 5px 5px 10px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
`;
const CardLabel = styled.p`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #0072ff;
`;
const CardImageWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 5px;
  background-color: #eee;
`;
const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const CardButton = styled(IonButton)`
  --background: #64aaff;
  --color: white;
  margin-top: 10px;
`;
const StepsContainer = styled.div`
  width: 100%;
  margin-top: 10px;
`;
const Step = styled.p`
  font-size: 14px;
  color: #444;
  margin-bottom: 8px;
`;
const HeroCarousel = styled.div`
  width: 100%;
  height: 140px;
  background-color: #64aaff;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin: 25px 0;
  display: flex;
`;
const HeroText = styled.p`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  letter-spacing: 1px;
`;
const PromoCarouselWrapper = styled.div`
  margin-top: 30px;
  width: 100%;
  height: 100px;
  border-radius: 10px;
  overflow: hidden;
  background-color: rgb(134, 134, 238);
`;
const PromoText = styled.p`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  padding: 30px 10px;
`;

/* ------------------------- DATA ------------------------- */
const carouselTexts = [
  '🛠️ 1. CHOOSE YOUR PACKAGE BELOW',
  '📞 2. BOOK / CONTACT US',
  '🧘‍♂️ 3. RELAX AND WATCH US DELIVER 🚘✨',
];
const promos = [
  '🔥 20% OFF this week only!',
  '🧽 Book now',
  '🚘 We come to you',
  '✨ Shine like new',
];

/* ------------------------- HOME PAGE ------------------------- */
const Home: React.FC = () => {
  const history = useHistory();
  const [services, setServices] = useState<any[]>([]);
  const [services2, setServices2] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const promoRef = useRef<HTMLDivElement>(null);
  const [showExitAlert, setShowExitAlert] = useState(false);

  /* ------------------------- CAROUSEL ------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % carouselTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  /* ------------------------- FETCH FIREBASE ------------------------- */
  useIonViewWillEnter(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot1 = await getDocs(collection(db, 'services'));
        setServices(querySnapshot1.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        const querySnapshot2 = await getDocs(collection(db, 'services2'));
        setServices2(querySnapshot2.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  });

  // /* ------------------------- ANDROID BACK BUTTON EXIT ------------------------- */
  // useEffect(() => {
  //   const handler = CapacitorApp.addListener('backButton', (event) => {
  //     if (window.location.pathname === '/home') {
  //       event.preventDefault();
  //       setShowExitAlert(true);
  //     }
  //   });
  //   return () => handler.remove();
  // }, []);



// useEffect(() => {
//   let listener: PluginListenerHandle | undefined;

//   const setupListener = async () => {
//     listener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
//       // Only exit on specific route
//       if (window.location.pathname === '/home') {
//         setShowExitAlert(true);
//       }
//     });
//   };

//   setupListener();

//   return () => {
//     listener?.remove();
//   };
// }, []);


useEffect(() => {
  let listener: PluginListenerHandle | undefined;

  const setupListener = async () => {
    listener = await CapacitorApp.addListener('backButton', () => {
      // Only handle back on Home
      if (window.location.pathname === '/home') {
        // Show exit alert ONLY if not already open
        setShowExitAlert(prev => {
          if (!prev) return true; // open alert
          return prev; // already open, do nothing
        });
      }
      // Do NOT navigate back at all
    });
  };

  setupListener();

  return () => {
    listener?.remove();
  };
}, []);



  /* ------------------------- HANDLE BOOK NOW ------------------------- */
  const handleBookNow = async (service: any) => {
    await Preferences.set({ key: 'selectedService', value: JSON.stringify(service) });
    history.push('/booking');
  };
  const handleBookNow2 = async (service: any) => {
    await Preferences.set({ key: 'selectedService', value: JSON.stringify(service) });
    history.push('/contact');
  };

  return (
    <IonPage>
      <Header title="MACO"/>
      {/* <IonHeader>
          <IonToolbar>
            <IonTitle>MACO</IonTitle>
          </IonToolbar>
        </IonHeader> */}
      <IonContent fullscreen>
        <Container>
          <LogoWrapper><Logo src={Logo2} /></LogoWrapper>
          <Heading>Welcome to</Heading>
          <Brand>MACO</Brand>
          <p style={{textAlign:"center"}}>Your Best Carwash, Home Maintenance, Cleaning and Handyman Services Provider</p>
          <HeroCarousel><HeroText>{carouselTexts[carouselIndex]}</HeroText></HeroCarousel>
          <SectionTitle>Our Packages</SectionTitle>
          <ServicesGrid>
            {loading ? (
              <IonText>Loading services...</IonText>
            ) : (
              services.map((service) => (
                <Card key={service.id}>
                  <CardLabel>{service.title}</CardLabel>
                  <CardImageWrapper><CardImage src={service.imageUrl} /></CardImageWrapper>
                  <CardButton onClick={() => handleBookNow(service)}>Book now</CardButton>
                </Card>
              ))
            )}
          </ServicesGrid>
          <ServicesGrid>
            {loading ? (
              <IonText>Loading services...</IonText>
            ) : (
              services2.map((service) => (
                <Card key={service.id} style={{ width: '100%' }}>
                  <CardLabel>{service.title}</CardLabel>
                  {service.packages?.map((p: any, i: number) => (
                    <p style={{color:"#222"}} key={i}>{p.name} {p.price ? `- AED ${p.price}` : ''}</p>
                  ))}
                  <CardButton onClick={() => handleBookNow2(service)}>Contact now</CardButton>
                </Card>
              ))
            )}
          </ServicesGrid>
          <SectionTitle>How It Works</SectionTitle>
          <StepsContainer>
            <Step>1️⃣ Choose your service</Step>
            <Step>📅 Book / Contact us</Step>
            <Step>🧽 We clean, you relax!</Step>
          </StepsContainer>
          <PromoCarouselWrapper ref={promoRef}>
            {promos.map((promo, i) => (<PromoText key={i}>{promo}</PromoText>))}
          </PromoCarouselWrapper>
        </Container>

        {/* Exit Confirmation Alert */}
        <IonAlert
          isOpen={showExitAlert}
          header="Exit App?"
          message="Do you really want to exit the app?"
          buttons={[
            { text: 'Cancel', role: 'cancel', handler: () => setShowExitAlert(false) },
            { text: 'Yes, Exit', handler: () => CapacitorApp.exitApp() }
          ]}
          onDidDismiss={() => setShowExitAlert(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Home;
