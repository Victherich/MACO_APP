
import React from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonAlert
} from "@ionic/react";
import { person, list, card, logOut, helpCircle } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useState } from "react";

/* ---------- styles ---------- */
const Container = styled.div`
  padding: 16px;
  background: #f6f8ff;
  min-height: 100vh;
`;

const UserCard = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
`;

const UserName = styled.h3`
  margin: 0;
  font-weight: 700;
`;

const UserEmail = styled.p`
  margin: 4px 0 0;
  color: #6b6b6b;
`;

/* ---------- component ---------- */
const UserAccount: React.FC = () => {
  const history = useHistory();
  const user = auth.currentUser;
 const [showLogoutAlert, setShowLogoutAlert] = useState(false);


  const handleLogout = async () => {
    await signOut(auth);
    history.replace("/splash");
  };

  return (
    <IonPage>
      <Header title="Account" />
      <IonContent fullscreen>
        <Container>
          {/* USER INFO */}
          <UserCard>
            <UserName>{user?.email?.split("@")[0] || "User"}</UserName>
            <UserEmail>{user?.email}</UserEmail>
          </UserCard>

          {/* MENU */}
          <IonList inset>
            <IonItem button onClick={() => history.push("/profile")}>
              <IonIcon icon={person} slot="start" />
              <IonLabel>User Information</IonLabel>
            </IonItem>

            <IonItem button onClick={() => history.push("/booking-history")}>
              <IonIcon icon={list} slot="start" />
              <IonLabel>Booking History</IonLabel>
            </IonItem>

            <IonItem button onClick={() => history.push("/transactions")}>
              <IonIcon icon={card} slot="start" />
              <IonLabel>Transaction History</IonLabel>
            </IonItem>

            <IonItem button onClick={() => history.push("/support")}>
              <IonIcon icon={helpCircle} slot="start" />
              <IonLabel>Help & Support</IonLabel>
            </IonItem>
          </IonList>

          {/* LOGOUT */}
          <IonButton
            expand="block"
            
            style={{ marginTop: 30, backgroundColor:"gray" }}
             onClick={() => setShowLogoutAlert(true)}
          >
            Logout
          </IonButton>

          <IonAlert
        isOpen={showLogoutAlert}
        onDidDismiss={() => setShowLogoutAlert(false)}
        header={"Confirm Logout"}
        message={"Are you sure you want to logout?"}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: () => setShowLogoutAlert(false),
          },
          {
            text: "Logout",
            handler: handleLogout,
          },
        ]}
      />
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default UserAccount;
