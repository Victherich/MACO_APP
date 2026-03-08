
















import { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, list, call, informationCircle, peopleCircle } from "ionicons/icons";

/* Pages */
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import PayPalPayment from "./pages/PayPalPayment";
import ContactUs from "./pages/ContactUs";
import AboutPage from "./pages/AboutPage";   // <-- ✅ ADDED


/* Capacitor App Update */
import { AppUpdate, AppUpdateAvailability } from "@capawesome/capacitor-app-update";

/* Ionic CSS */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme */
import "./theme/variables.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserAccount from "./pages/UserAccount";
import { AppProvider } from "./context/AppContext";
// import { saveFcmToken } from "./pushNotifications";
// import { onMessage } from "firebase/messaging";
// import { messaging } from "./firebaseConfig";
import { App as CapApp } from "@capacitor/app";
import { useIonAlert } from "@ionic/react";
// import OneSignal from 'onesignal-cordova-plugin';
// import { PushNotifications } from "@capacitor/push-notifications";

// document.addEventListener('deviceready', function () {

//   OneSignal.setAppId("2453990e-29a7-4be4-b01e-0ea150654842");

//   OneSignal.setNotificationOpenedHandler(function(jsonData) {
//     console.log("Notification opened:", jsonData);
//   });

// });



setupIonicReact();

const App: React.FC = () => {
  const [presentAlert] = useIonAlert();

  // ----------------------------
  // FORCE UPDATE IF AVAILABLE
  // ----------------------------
  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const result = await AppUpdate.getAppUpdateInfo();
        console.log("UPDATE INFO:", result);

        if (result.updateAvailability === AppUpdateAvailability.UPDATE_AVAILABLE) {
          await AppUpdate.performImmediateUpdate();
        }
      } catch (err) {
        console.warn("Update check failed:", err);
      }
    };

    checkForUpdate();
  }, []);


// useEffect(() => {
//   saveFcmToken();
// }, []);



// useEffect(() => {
//   onMessage(messaging, (payload) => {
//     console.log("Foreground notification:", payload);
//   });
// }, []);





useEffect(() => {
  let backHandler: any;

  const setupBackButton = async () => {
    backHandler = await CapApp.addListener("backButton", () => {
      const path = window.location.pathname;

      if (path === "/home") {
        presentAlert({
          header: "Exit App",
          message: "Are you sure you want to exit?",
          buttons: [
            {
              text: "No",
              role: "cancel",
            },
            {
              text: "Yes",
              handler: () => {
                CapApp.exitApp();
              },
            },
          ],
        });
      } else {
        window.history.back();
      }
    });
  };

  setupBackButton();

  return () => {
    if (backHandler) {
      backHandler.remove();
    }
  };
}, [presentAlert]);



// //  useEffect(() => {
// //     document.addEventListener("deviceready", () => {

// //       OneSignal.setAppId("2453990e-29a7-4be4-b01e-0ea150654842");

// //       OneSignal.setNotificationOpenedHandler((data: any) => {
// //         console.log("Notification opened:", data);
// //       });

// //     });
// //   }, []);


// //  useEffect(() => {

// //     document.addEventListener("deviceready", function () {

// //       console.log("Device ready fired");

// //       OneSignal.setLogLevel(6, 0); // DEBUG

// //       OneSignal.setAppId("2453990e-29a7-4be4-b01e-0ea150654842");

// //       OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
// //         console.log("User accepted notifications:", accepted);
// //       });

// //       OneSignal.setNotificationOpenedHandler(function(data) {
// //         console.log("Notification opened:", data);
// //       });

// //     }, false);

// //   }, []);




//     // // Enable verbose logging for debugging (remove in production)
//     //   OneSignal.Debug.setLogLevel(6);
//     //   // Initialize with your OneSignal App ID
//     //   OneSignal.initialize("2453990e-29a7-4be4-b01e-0ea150654842");
//     //   // Use this method to prompt for push notifications.
//     //   // We recommend removing this method after testing and instead use In-App Messages to prompt for notification permission.
//     //   OneSignal.Notifications.requestPermission(false).then((accepted: boolean) => {
//     //     console.log("User accepted notifications: " + accepted);
//     //   });




//   useEffect(() => {
//     setupNotificationChannels();
//   }, []);

//   const setupNotificationChannels = async () => {

//     await PushNotifications.createChannel({
//       id: "orders",
//       name: "New Orders",
//       importance: 5
//     });

//     await PushNotifications.createChannel({
//       id: "order_updates",
//       name: "Order Updates",
//       importance: 4
//     });

//     await PushNotifications.createChannel({
//       id: "payments",
//       name: "Payments",
//       importance: 4
//     });

//   };



  return (
<AppProvider>
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Splash page */}
          <Route exact path="/splash">
            <Splash />
          </Route>

          {/* Main Tabs */}
          <Route>
            <IonTabs>
              <IonRouterOutlet>
                <Route exact path="/home">
                  <Home />
                </Route>

            

                <Route exact path="/paypal-payment">
                  <PayPalPayment />
                </Route>

                <Route exact path="/contact">
                  <ContactUs />
                </Route>

                <Route exact path="/about">
                  <AboutPage />   {/* <-- ✅ ABOUT PAGE ROUTE */}
                </Route>

                {/* Redirect root to splash */}
                <Route exact path="/">
                  <Redirect to="/splash" />
                </Route>

<Route exact path="/login">
<Login/>
</Route>
<Route exact path="/signup">
<Signup/>
</Route>

<Route exact path="/user-account">
<UserAccount/>
</Route>

              </IonRouterOutlet>

              {/* BOTTOM TABS */}
              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/home">
                  <IonIcon icon={home} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>

                <IonTabButton tab="user-account" href="/user-account">
                  <IonIcon icon={peopleCircle} />
                  <IonLabel>Account</IonLabel>
                </IonTabButton>

                <IonTabButton tab="contact" href="/contact">
                  <IonIcon icon={call} />
                  <IonLabel>Contact</IonLabel>
                </IonTabButton>

                <IonTabButton tab="about" href="/about">
                  <IonIcon icon={informationCircle} /> {/* <-- ICON */}
                  <IonLabel>About</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>

</AppProvider>
  );
};

export default App;








