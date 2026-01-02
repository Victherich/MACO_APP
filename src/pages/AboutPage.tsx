
import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/react';
import styled from 'styled-components';
import Header from '../components/Header';

const Container = styled.div`
  padding: 22px;
  background-color: #f0f8ff;
  min-height: 100vh;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #0072ff;
  text-align: center;
`;

const Paragraph = styled.p`
  font-size: 16px;
  color: #333;
  line-height: 1.6;
  text-align: left;
  margin-top: 12px;
`;

const Highlight = styled.span`
  color: #0072ff;
  font-weight: 600;
`;

const ContactBox = styled.div`
  margin-top: 18px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border-left: 4px solid #0072ff;
  box-shadow: 0px 3px 14px rgba(0,0,0,0.07);
`;

const ContactItem = styled.p`
  margin: 6px 0;
  font-size: 15px;
  font-weight: 500;
  color: #444;
`;

const AboutPage: React.FC = () => {
return (
  <IonPage>
    <Header title="About MACO" />

    <IonContent fullscreen>
      <Container>

        <SectionTitle>Welcome to MACO</SectionTitle>

        <Paragraph>
          <Highlight>MACO</Highlight> provides
          <Highlight> car wash</Highlight>,
          <Highlight> home cleaning</Highlight>, and
          <Highlight> maintenance services</Highlight> in
          <strong> Dubai, UAE</strong>.
        </Paragraph>

        <Paragraph>
          The app allows users to request services for homes, apartments,
          villas, offices, and vehicles. Users can schedule and manage
          service requests through the application.
        </Paragraph>

        <Paragraph>
          ✔ Services are carried out using professional tools and
          established cleaning and maintenance methods.
        </Paragraph>

        <Paragraph>
          ✔ Service requests can be scheduled based on user availability.
        </Paragraph>

        <Paragraph>
          ✔ Pricing details are displayed within the app where applicable.
        </Paragraph>

        <Paragraph>
          ✔ Service personnel are trained to perform assigned tasks.
        </Paragraph>

        <Paragraph>
          ✔ Service completion is based on the selected service request.
        </Paragraph>

        <SectionTitle>Contact Information</SectionTitle>

        <ContactBox>
          <ContactItem>
            <strong>Company:</strong> MACO
          </ContactItem>
          <ContactItem>
            <strong>Website:</strong> macoexperts.com
          </ContactItem>
          <ContactItem>
            <strong>Address:</strong> Royal Class Office No. 493, DIP 1, Dubai
          </ContactItem>
          <ContactItem>
            <strong>Email:</strong> matthewcarwashandcleaning20@gmail.com
          </ContactItem>
          <ContactItem>
            <strong>Phone/WhatsApp:</strong> +971 56 830 7510
          </ContactItem>
        </ContactBox>

      </Container>
    </IonContent>
  </IonPage>
);

};

export default AboutPage;
