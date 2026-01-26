import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonLoading,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Header from "../components/Header";

/* ---------- styles ---------- */
const Container = styled.div`
  padding: 24px;
  background: #f6f8ff;
  min-height: 100vh;
`;

const Title = styled.h2`
  margin-top: 20px;
  font-weight: 700;
`;

const ErrorText = styled(IonText)`
  color: #e53935;
`;

/* ---------- component ---------- */
const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      history.replace("/home"); // ✅ logged in → dashboard
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <Header title="Login" />
      <IonContent fullscreen>
        <Container>
          <Title>Welcome back 👋</Title>

          <IonInput
            type="email"
            placeholder="Email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value!)}
          />

          <IonInput
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />

          {error && <ErrorText>{error}</ErrorText>}

          <IonButton expand="block" onClick={handleLogin}>
            Login
          </IonButton>

          <IonButton
            expand="block"
            fill="clear"
            onClick={() => history.push("/signup")}
          >
            Create an account
          </IonButton>

          <IonLoading isOpen={loading} message="Logging in..." />
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default Login;
