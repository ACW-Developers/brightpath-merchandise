import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>BrightPath Technologies | IT Services & Consulting</title>
        <meta 
          name="description" 
          content="BrightPath Technologies offers expert IT consulting, software development, cloud solutions, and cybersecurity services. Transform your business with our innovative technology solutions." 
        />
        <meta name="keywords" content="IT consulting, software development, cloud solutions, cybersecurity, digital transformation, technology services" />
        <link rel="canonical" href="https://brightpath.tech" />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <AboutSection />
          <ServicesSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;