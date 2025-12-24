import React from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

/* Import your logo */
import Logo from '../assets/logo.png'; // Make sure your logo is in /src/assets/logo.png

/* Styled Components */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 20px;
  background: linear-gradient(180deg, #00c6ff 0%, #0072ff 100%);
`;

const LogoImage = styled.img`
  width: 180px;
  height: 180px;
  margin-bottom: 30px;
  border-radius: 90px;
  object-fit: contain;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #fff;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #e0f7ff;
  text-align: center;
  margin-bottom: 50px;
`;

const StartButton = styled.button`
  background-color: #fff;
  color: #0072ff;
  font-size: 18px;
  font-weight: bold;
  padding: 14px 50px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const Splash: React.FC = () => {
  const history = useHistory();

  const goToMain = () => {
    history.replace('/home'); // Navigate to Home or Main page
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Container>
          <LogoImage src={Logo} alt="App Logo" />
          <Title>MACO</Title>
          <Subtitle>Shine like never before!</Subtitle>
          <StartButton onClick={goToMain}>Get Started</StartButton>
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default Splash;
