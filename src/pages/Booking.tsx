
// import React, { useState } from 'react';
// import {
//   IonPage,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonContent,
//   IonItem,
//   IonLabel,
//   IonInput,
//   IonDatetime,
//   IonSelect,
//   IonSelectOption,
//   IonButton,
//   IonCard,
//   IonCardHeader,
//   IonCardTitle,
//   IonCardContent,
//   IonToast
// } from '@ionic/react';


// const Booking: React.FC = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [service, setService] = useState('');
//   const [showToast, setShowToast] = useState(false);

//   const handleBooking = () => {
//     if (name && email && date && time && service) {
//       setShowToast(true);
//       // Here you could also send the booking data to your backend
//       console.log({ name, email, date, time, service });
//     } else {
//       alert('Please fill in all fields');
//     }
//   };

//   return (
//     <IonPage>
//       <IonHeader>
//         <IonToolbar>
//           <IonTitle>Booking</IonTitle>
//         </IonToolbar>
//       </IonHeader>

//       <IonContent fullscreen>
//         <IonCard>
//           <IonCardHeader>
//             <IonCardTitle>Book a Service</IonCardTitle>
//           </IonCardHeader>
//           <IonCardContent>
//             <IonItem>
//               <IonLabel position="floating">Name</IonLabel>
//               <IonInput value={name} onIonChange={e => setName(e.detail.value!)} />
//             </IonItem>

//             <IonItem>
//               <IonLabel position="floating">Email</IonLabel>
//               <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} />
//             </IonItem>

//             <IonItem>
//               <IonLabel>Date</IonLabel>
//               <IonDatetime displayFormat="MM/DD/YYYY" value={date} onIonChange={e => setDate(e.detail.value!)} />
//             </IonItem>

//             <IonItem>
//               <IonLabel>Time</IonLabel>
//               <IonDatetime displayFormat="h:mm A" pickerFormat="h:mm A" value={time} onIonChange={e => setTime(e.detail.value!)} />
//             </IonItem>

//             <IonItem>
//               <IonLabel>Service</IonLabel>
//               <IonSelect value={service} placeholder="Select Service" onIonChange={e => setService(e.detail.value)}>
//                 <IonSelectOption value="consultation">Consultation</IonSelectOption>
//                 <IonSelectOption value="maintenance">Maintenance</IonSelectOption>
//                 <IonSelectOption value="support">Support</IonSelectOption>
//               </IonSelect>
//             </IonItem>

//             <IonButton expand="block" color="primary" onClick={handleBooking} style={{ marginTop: '20px' }}>
//               Submit Booking
//             </IonButton>
//           </IonCardContent>
//         </IonCard>

//         <IonToast
//           isOpen={showToast}
//           onDidDismiss={() => setShowToast(false)}
//           message="Booking submitted successfully!"
//           duration={2000}
//           color="success"
//         />
//       </IonContent>
//     </IonPage>
//   );
// };

// export default Booking;


import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonInput,
  IonButton,
  IonList,
  IonSpinner,
  IonToast,
  useIonViewWillEnter,IonDatetime
} from '@ionic/react';
import styled from 'styled-components';
import { Preferences } from '@capacitor/preferences';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import { IonAlert } from '@ionic/react';



/**
 * Booking.tsx
 *
 * Full Ionic React implementation of your React Native Booking screen.
 * - Loads selectedService from Capacitor Preferences (key: "selectedService")
 * - Modal 1: user info + date picker + time slot
 * - Modal 2: payment options (Pay on Delivery / Pay Now)
 * - Pay on Delivery: saves order in Firestore and calls your email backend (same URL you used)
 * - Pay Now: stores pendingOrder in Preferences and navigates to /paypal-payment to complete payment
 *
 * PayPal integration note:
 * Your backend must redirect to a URL like:
 *  https://<your-app-domain>/paypal-payment?success=1&paymentId=PAYID123
 * so your PayPalPayment page can detect paymentId and finalize the order (read pendingOrder from Preferences).
 */

/* ---------------- Styled components ---------------- */

const Container = styled.div`
  padding: 20px;
  background-color: #f0f8ff;
  min-height: 100vh;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  color: #0072ff;
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 80px;
  display: block;
  margin: 10px auto;
  background-color: #eee;
  object-fit: cover;
`;

const PickerWrapper = styled.div`
  margin: 15px 0;
  background: #fff;
  border-radius: 8px;
  padding: 6px;
  border: 1px solid #ccc;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 18px;
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  color: #333;
`;

/* ---------------- Component ---------------- */

const Booking: React.FC = () => {
  const [service, setService] = useState<any | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);

  // user fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [phone, setPhone] = useState('');

  // modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // booking times
  const [selectedDate, setSelectedDate] = useState(''); // yyyy-mm-dd
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const history =useHistory()

  // const [selectedDate, setSelectedDate] = useState('');
const [showDatePicker, setShowDatePicker] = useState(false);

const [showSelectServiceAlert, setShowSelectServiceAlert] = useState(false);



  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' });

  const timeSlots = [
    '08:00 AM - 09:00 AM',
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 01:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM',
    '05:00 PM - 06:00 PM',
    '06:00 PM - 07:00 PM',
    '07:00 PM - 08:00 PM',
  ];

  // load selectedService from Preferences each time view will enter
// useIonViewWillEnter(() => {
//   const loadSelectedService = async () => {
//     try {
//       const r = await Preferences.get({ key: 'selectedService' });
      
//       if (r.value) {
//         const parsed = JSON.parse(r.value);
//         setService(parsed);
//         setSelectedPackage(null);
//       } else {
//         setService(null);
//         setSelectedPackage(null);
//       }

//     } catch (err) {
//       console.error('Failed to load selectedService:', err);
//     }
//   };

//   loadSelectedService();
// });



useIonViewWillEnter(() => {
  const loadSelectedService = async () => {
    try {
      const r = await Preferences.get({ key: 'selectedService' });

      if (r.value) {
        const parsed = JSON.parse(r.value);
        setService(parsed);
        setSelectedPackage(null);
      } else {
        setService(null);
        setSelectedPackage(null);

        // 🔴 SHOW POPUP
        setShowSelectServiceAlert(true);
      }
    } catch (err) {
      console.error('Failed to load selectedService:', err);
    }
  };

  loadSelectedService();
});



  // fetch booked slots when selectedDate changes
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!selectedDate) return;
      try {
        const q = query(collection(db, 'orders'), where('selectedDate', '==', selectedDate));
        const snap = await getDocs(q);
        const slots = snap.docs.map((d) => d.data().selectedSlot);
        setBookedSlots(slots as string[]);
      } catch (err) {
        console.error('Error fetching booked slots:', err);
      }
    };
    fetchBookedSlots();
  }, [selectedDate]);

  const extractAmountUSD = (pkg: any) => {
    const AED_TO_USD = 0.27;
    const aed = parseFloat(pkg?.price ?? '50');
    return parseFloat((aed * AED_TO_USD).toFixed(2));
  };

  const showError = (msg: string) => {
    setToast({ show: true, message: msg });
  };

  /* ---------------- Submit Pay on Delivery (same as handleSubmitOrder2) ---------------- */
  const handlePayOnDelivery = async () => {
    if (!name || !email || !phone) {
      showError('Missing Info — please fill all user fields.');
      return;
    }
    if (email !== confirmEmail) {
      showError('Emails do not match.');
      return;
    }
    if (!selectedDate || !selectedSlot) {
      showError('Please select date and time slot.');
      return;
    }

    // confirm with user
    const ok = window.confirm(`Confirm booking for ${selectedDate} at ${selectedSlot}?`);
    if (!ok) return;

    setLoading(true);
    try {
      const orderData = {
        user: { name, email, phone },
        serviceTitle: service?.title,
        selectedPackage,
        selectedDate,
        selectedSlot,
        sellerEmail: 'matthewcarwashandcleaning20@gmail.com',
        priceAED: selectedPackage?.price,
        priceUSD: extractAmountUSD(selectedPackage),
        paymentDetails: 'NULL',
        date: new Date().toISOString(),
        paymentStatus: 'NOT YET PAID',
      };

      await addDoc(collection(db, 'orders'), {
        ...orderData,
        createdAt: serverTimestamp(),
      });

      // send email using your backend
      await fetch('https://backend-mailer-1.vercel.app/api/matthew_car_wash_order_email_sender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      // clear selection and close modals
      await Preferences.remove({ key: 'selectedService' });
      setShowPaymentModal(false);
      setShowUserModal(false);
      setSelectedDate('');
      setSelectedSlot('');
      setName('');
      setEmail('');
      setPhone('');
      setConfirmEmail('');
      showError('Success — booking placed (Pay on Delivery).');

    setTimeout(() => {
  history.push('/home'); // v5 compatible navigation
}, 500);

    } catch (err) {
      console.error('Order error (Pay on Delivery):', err);
      showError('Error — failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- PayPal flow (Pay Now) ----------------
     Strategy:
     1) Validate inputs (same checks)
     2) Build orderData with paymentStatus: 'PAID' (or Pending)
     3) Save a "pendingOrder" in Preferences (so PayPalPayment page can finalize on return)
     4) Navigate to '/paypal-payment' route. Your PayPal backend should redirect back to:
        https://<your-app-host>/paypal-payment?success=1&paymentId=PAYID123
     5) The PayPalPayment page should:
        - read 'pendingOrder' from Preferences
        - when it detects paymentId (via URL query), add the final order to Firestore, call email sender,
          remove pendingOrder and selectedService, and show success.
  ------------------------------------------------------------------*/
  const handlePayNow = async (navigateToPaypal: (urlPath?: string) => void) => {
    if (!name || !email || !phone) {
      showError('Missing Info — please fill all user fields.');
      return;
    }
    if (email !== confirmEmail) {
      showError('Emails do not match.');
      return;
    }
    if (!selectedDate || !selectedSlot) {
      showError('Please select date and time slot.');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        user: { name, email, phone },
        serviceTitle: service?.title,
        selectedPackage,
        selectedDate,
        selectedSlot,
        sellerEmail: 'matthewcarwashandcleaning20@gmail.com',
        priceAED: selectedPackage?.price,
        priceUSD: extractAmountUSD(selectedPackage),
        paymentDetails: {
          method: 'PayPal',
          status: 'Pending',
        },
        date: new Date().toISOString(),
        paymentStatus: 'PENDING_PAYMENT',
      };

      // store pending order (PayPalPayment page will pick it up)
      await Preferences.set({ key: 'pendingOrder', value: JSON.stringify(orderData) });

      // navigate to PayPalPayment route
      // NOTE: Payment URL will be constructed in PayPalPayment page; we just route there.
      navigateToPaypal('/paypal-payment');
    } catch (err) {
      console.error('Error preparing PayPal order:', err);
      showError('Error — could not initiate PayPal payment.');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Open user-info modal handler ---------------- */
  const openUserModal = () => {
    if (!selectedPackage) {
      showError('Please select a package first.');
      return;
    }
    setShowUserModal(true);
  };

  /* ---------------- Helper: validate email format ---------------- */
  const isEmailValid = (em: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(em);
  };

  /* ---------------- Render ---------------- */
  if (!service) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Booking</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <div style={{ padding: 20, textAlign: 'center' }}>
            {/* <IonSpinner name="crescent" /> */}
            <p>Please Select a package from <span style={{
              fontWeight:"bold",
               fontStyle:"italic",
                color:"blue",
                cursor:"pointer",
                textDecoration:"underline"
                }}>Home</span></p>
          </div>
        </IonContent>

<IonAlert
  isOpen={showSelectServiceAlert}
  backdropDismiss={false}
  header="No Package Selected"
  message="Please select a package from the Home page to continue."
  buttons={[
    {
      text: 'OK',
      handler: () => {
        setShowSelectServiceAlert(false);
        history.push('/home'); // 👈 navigate to Home
      },
    },
  ]}
/>


      </IonPage>
    );
  }

  return (
    <IonPage>
 
      <Header title='Select a Package'/>

      <IonContent fullscreen>
        <Container>
          <Title>Select a Package for {service?.title}</Title>

          <Image src={service?.imageUrl || service?.image || '/assets/logo.png'} alt="service" />

          <div style={{ textAlign: 'left', marginTop: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#0072ff' }}>{service?.title}</div>
          </div>

          <PickerWrapper >
            <IonItem >
              {/* <IonLabel >-- Select Package --</IonLabel> */}
              <IonSelect
                value={selectedPackage}
                onIonChange={(e) => setSelectedPackage(e.detail.value)}
                interface="popover"

           
              >
                <IonSelectOption value={null}>-- Select Package --</IonSelectOption>
                {service?.packages?.map((pkg: any, idx: number) => (
                  <IonSelectOption key={idx} value={pkg}>
                    {pkg.name} - AED {pkg.price}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </PickerWrapper>

          {selectedPackage && (
            <>
              <Label>Selected Package:</Label>
              <div style={{ fontSize: 16, color: '#333', marginTop: 6 }}>{selectedPackage.name}</div>
              <div style={{ fontSize: 14, color: '#555', marginTop: 4 }}>Price: AED {selectedPackage.price}</div>

              <ButtonRow>
                <IonButton color="primary" onClick={openUserModal}>Continue</IonButton>
              </ButtonRow>
            </>
          )}

          {/* ---------------- User Info Modal (FULLSCREEN) ---------------- */}
          <IonModal isOpen={showUserModal} className="my-fullscreen-modal">

            <Header title='Enter Your Info'/>

            <IonContent>
              <div style={{ padding: 18 }}>
                <Label>Name:</Label>
                <IonInput value={name} placeholder="Name" onIonChange={(e) => setName(e.detail.value ?? '')} 
                  style={{borderBottom:"1px solid blue"}}
                  />

                <Label>Email:</Label>
                <IonInput
                  value={email}
                  placeholder="Email"
                  onIonChange={(e) => setEmail(e.detail.value ?? '')}
                  type="email"
                  inputMode="email"
                  style={{borderBottom:"1px solid blue"}}
                />

                <Label>Enter Email Again to confirm:</Label>
                <IonInput
                  value={confirmEmail}
                  placeholder="Confirm Email"
                  onIonChange={(e) => setConfirmEmail(e.detail.value ?? '')}
                  type="email"
                  inputMode="email"
                  style={{borderBottom:"1px solid blue"}}
                />

                <Label>Phone:</Label>
                <IonInput value={phone} placeholder="Phone" onIonChange={(e) => setPhone(e.detail.value ?? '')} type="tel" 
                  style={{borderBottom:"1px solid blue"}}
                  />

                <Label style={{ marginTop: 14 }}>Select Date:</Label>
                {/* IonInput type=date works across web and mobile browsers.
                    Alternatively IonDatetime can be used for richer UI. */}
                {/* <IonItem>
                  <IonLabel position="stacked" htmlFor="dt">Click below to select Date:</IonLabel>
                  <br/>     

<IonItem id="dt">
  <IonInput
    className="date-input"
    type="date"
    value={selectedDate}
    onIonChange={(e) => {
      setSelectedDate(e.detail.value ?? '');
      setSelectedSlot('');
    }}

    style={{backgroundColor:"red"}}
  />

</IonItem>


                </IonItem> */}
<IonItem button detail onClick={() => setShowDatePicker(true)}>
  <IonLabel>
    {selectedDate ? `Selected Date: ${selectedDate}` : "Tap to Select Date"}
  </IonLabel>
</IonItem>

<IonModal isOpen={showDatePicker} onDidDismiss={() => setShowDatePicker(false)}>
  <IonContent className="ion-padding">

    <h2>Select a Date</h2>

    <IonDatetime
      presentation="date"
      value={selectedDate}
    onIonChange={(e) => {
  const value = e.detail.value;

  if (typeof value === "string") {
    const onlyDate = value.split("T")[0];
    setSelectedDate(onlyDate);
  }
  setSelectedSlot('')
}}

    />

    <IonButton expand="block" onClick={() => setShowDatePicker(false)}>
      Done
    </IonButton>

  </IonContent>
</IonModal>



                <Label style={{ marginTop: 12 }}>Select Time Slot:</Label>
                <IonItem>
                  <IonLabel position="stacked">Time Slot:</IonLabel>
                  <IonSelect
                    value={selectedSlot}
                    placeholder="-- Select Time Slot --"
                    onIonChange={(e) => setSelectedSlot(e.detail.value ?? '')}
                  >
                    <IonSelectOption value="">-- Select Time Slot --</IonSelectOption>
                    {timeSlots.map((slot) => (
                      <IonSelectOption key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                        {bookedSlots.includes(slot) ? `${slot} (Booked)` : slot}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>

                <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                  <IonButton expand="block" onClick={() => {
                    // Validate inputs like RN's handleActionButtonsOpen
                    if (!name || !email || !phone) {
                      showError('Missing Info — fill all user fields.');
                      return;
                    }
                    if (!isEmailValid(email)) {
                      showError('Invalid Email — please enter valid email.');
                      return;
                    }
                    if (email !== confirmEmail) {
                      showError('Email Mismatch — emails do not match.');
                      return;
                    }
                    if (!selectedDate || !selectedSlot) {
                      showError('Select Time — select date and time slot.');
                      return;
                    }
                    // open payment modal
                    setShowPaymentModal(true);
                  }}>Next</IonButton>

                  <IonButton expand="block" color="medium" onClick={() => setShowUserModal(false)}>Cancel</IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>

          {/* ---------------- Payment Modal (FULLSCREEN) ---------------- */}
         <IonModal isOpen={showPaymentModal} className="my-fullscreen-modal">
            <IonHeader>
             <Header title='Choose Payment Option'/>
            </IonHeader>

            <IonContent>
              <div style={{ padding: 18 }}>
                <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16, textAlign: 'center' }}>
                  Price: AED {selectedPackage?.price} • USD {extractAmountUSD(selectedPackage)}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <IonButton
                    onClick={() => handlePayOnDelivery()}
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="crescent" /> : 'Pay on Delivery'}
                  </IonButton>


{/* ccontinue with paypal payment later */}
                  {/* <IonButton
                    onClick={() => handlePayNow((url) => { window.location.href = url ?? '/paypal-payment'; })}
                    disabled={loading}
                  >
                    {loading ? <IonSpinner name="crescent" /> : 'Pay Now (PayPal)'}
                  </IonButton> */}

                  <IonButton color="medium" onClick={() => setShowPaymentModal(false)}>Cancel</IonButton>
                </div>
              </div>
            </IonContent>
          </IonModal>

          {loading && (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <IonSpinner name="crescent" />
            </div>
          )}
        </Container>

        <IonToast
          isOpen={toast.show}
          onDidDismiss={() => setToast({ show: false, message: '' })}
          message={toast.message}
          duration={5000}
          style={{height:"50%", backgroundColor:"#9cc8ffff"}}
           
        />


        

      </IonContent>
    </IonPage>
  );
};

export default Booking;
