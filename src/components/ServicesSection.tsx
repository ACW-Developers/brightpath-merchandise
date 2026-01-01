import { Cloud, Code, Shield, RefreshCw, BarChart3, Headphones } from 'lucide-react';

const services = [
  {
    icon: Code,
    title: 'Software Development',
    description: 'Custom applications built to your exact specifications using modern technologies and best practices.',
  },
  {
    icon: Cloud,
    title: 'Cloud Solutions',
    description: 'Seamless cloud migration and management with AWS, Azure, and Google Cloud expertise.',
  },
  {
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Comprehensive security assessments, implementation, and monitoring to protect your digital assets.',
  },
  {
    icon: RefreshCw,
    title: 'Digital Transformation',
    description: 'Strategic guidance to modernize your operations and embrace digital-first business models.',
  },
  {
    icon: BarChart3,
    title: 'Data Analytics',
    description: 'Turn your data into actionable insights with advanced analytics and visualization tools.',
  },
  {
    icon: Headphones,
    title: 'IT Support & Management',
    description: 'Reliable 24/7 support and proactive IT management to keep your systems running smoothly.',
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-foreground mt-3 mb-6">
            Solutions That Drive Success
          </h2>
          <p className="text-lg text-muted-foreground">
            From strategic consulting to hands-on implementation, we offer a full spectrum of 
            IT services designed to accelerate your business growth.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-8 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 border border-border hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center mb-6 transition-colors">
                <service.icon className="text-primary group-hover:text-primary-foreground transition-colors" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-card-foreground mb-3">{service.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;