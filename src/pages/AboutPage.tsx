
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
   <Header title="About MACO"/>

      <IonContent fullscreen>
        <Container>

          <SectionTitle>Welcome to MACO</SectionTitle>

          <Paragraph>
            At <Highlight>MACO</Highlight>, we specialize in delivering premium 
            <Highlight> car wash</Highlight>, 
            <Highlight> home cleaning</Highlight>, and 
            <Highlight> maintenance services</Highlight> across 
            <strong> Dubai, UAE</strong>.  
          </Paragraph>

          <Paragraph>
            Our goal is simple: <strong>to make your daily life easier, cleaner, and stress-free.</strong>  
            Whether it’s your home, car, apartment, villa, or workspace — we are committed to providing the 
            <Highlight> highest quality service</Highlight> with unmatched professionalism.
          </Paragraph>

          <SectionTitle>Why We’re the Best in Dubai</SectionTitle>

          <Paragraph>
            ✔ <strong>Premium Quality</strong> — We use professional tools, advanced techniques,
            and trained experts to ensure outstanding results.
          </Paragraph>

          <Paragraph>
            ✔ <strong>Fast & Reliable</strong> — We value your time and always arrive on schedule.
          </Paragraph>

          <Paragraph>
            ✔ <strong>Affordable Pricing</strong> — Fair, transparent, and competitive rates for everyone.
          </Paragraph>

          <Paragraph>
            ✔ <strong>Trusted Professionals</strong> — Our team is highly trained, responsible, and dedicated.
          </Paragraph>

          <Paragraph>
            ✔ <strong>Your Satisfaction First</strong> — We don’t leave until the job is perfect.
          </Paragraph>

          <SectionTitle>Our Mission</SectionTitle>

          <Paragraph>
            Our mission is to provide 
            <Highlight> reliable, affordable, and high-quality services </Highlight>
            that improve everyday living. We are here to give you peace of mind and make your environment 
            cleaner, safer, and more comfortable.
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

          <Paragraph style={{ marginTop: 22, textAlign: 'center', fontWeight: 600 }}>
            Thank you for trusting MACO —  
            <br/>
            <Highlight>Your satisfaction is our priority!</Highlight>
          </Paragraph>

        </Container>
      </IonContent>
    </IonPage>
  );
};

export default AboutPage;
