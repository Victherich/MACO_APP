
// import { Redirect, Route } from 'react-router-dom';
// import {
//   IonApp,
//   IonIcon,
//   IonLabel,
//   IonRouterOutlet,
//   IonTabBar,
//   IonTabButton,
//   IonTabs,
//   setupIonicReact
// } from '@ionic/react';
// import { IonReactRouter } from '@ionic/react-router';
// import { home, list, card, cash, call } from 'ionicons/icons';

// /* Pages */
// import Splash from './pages/Splash';
// import Home from './pages/Home';
// import Booking from './pages/Booking';
// import PayPalPayment from './pages/PayPalPayment';
// import ContactUs from './pages/ContactUs';

// /* Core CSS required for Ionic components to work properly */
// import '@ionic/react/css/core.css';

// /* Basic CSS for apps built with Ionic */
// import '@ionic/react/css/normalize.css';
// import '@ionic/react/css/structure.css';
// import '@ionic/react/css/typography.css';

// /* Optional CSS utils that can be commented out */
// import '@ionic/react/css/padding.css';
// import '@ionic/react/css/float-elements.css';
// import '@ionic/react/css/text-alignment.css';
// import '@ionic/react/css/text-transformation.css';
// import '@ionic/react/css/flex-utils.css';
// import '@ionic/react/css/display.css';

// /* Dark mode palettes */
// // import '@ionic/react/css/palettes/dark.system.css';

// /* Theme variables */
// import './theme/variables.css';

// setupIonicReact();

// const App: React.FC = () => (
// <IonApp >
//   <IonReactRouter >
//     <IonRouterOutlet >
//       {/* Splash page - outside of tabs */}
//       <Route exact path="/splash">
//         <Splash />
//       </Route>

//       {/* Main app with tabs */}
//       <Route >
//         <IonTabs>
//           <IonRouterOutlet>
//             <Route exact path="/home">
//               <Home />
//             </Route>
//             <Route exact path="/booking">
//               <Booking />
//             </Route>
//             <Route exact path="/paypal-payment">
//               <PayPalPayment />
//             </Route>
//             <Route exact path="/contact">
//               <ContactUs />
//             </Route>
//             {/* Redirect root to splash */}
//             <Route exact path="/">
//               <Redirect to="/splash" />
//             </Route>
//           </IonRouterOutlet>

//           <IonTabBar slot="bottom">
//             <IonTabButton tab="home" href="/home">
//               <IonIcon icon={home} />
//               <IonLabel>Home</IonLabel>
//             </IonTabButton>
//             <IonTabButton tab="booking" href="/booking">
//               <IonIcon icon={list} />
//               <IonLabel>Booking</IonLabel>
//             </IonTabButton>
    
//             <IonTabButton tab="contact" href="/contact">
//               <IonIcon icon={call} />
//               <IonLabel>Contact</IonLabel>
//             </IonTabButton>
//           </IonTabBar>
//         </IonTabs>
//       </Route>
//     </IonRouterOutlet>
//   </IonReactRouter>
// </IonApp>

// );

// export default App;

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
import { home, list, call, informationCircle } from "ionicons/icons";

/* Pages */
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
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

setupIonicReact();

const App: React.FC = () => {
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

  return (
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

                <Route exact path="/booking">
                  <Booking />
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
              </IonRouterOutlet>

              {/* BOTTOM TABS */}
              <IonTabBar slot="bottom">
                <IonTabButton tab="home" href="/home">
                  <IonIcon icon={home} />
                  <IonLabel>Home</IonLabel>
                </IonTabButton>

                <IonTabButton tab="booking" href="/booking">
                  <IonIcon icon={list} />
                  <IonLabel>Booking</IonLabel>
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
  );
};

export default App;
