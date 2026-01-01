import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    value: 'hello@brightpath.tech',
    description: 'We respond within 24 hours',
  },
  {
    icon: Phone,
    title: 'Call Us',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri, 9am-6pm EST',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    value: '123 Innovation Drive',
    description: 'San Francisco, CA 94105',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'Monday - Friday',
    description: '9:00 AM - 6:00 PM EST',
  },
];

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Contact Us</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
            Let's Start a Conversation
          </h2>
          <p className="text-lg text-muted-foreground">
            Ready to transform your business with technology? Reach out to our team 
            and discover how we can help you achieve your goals.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 text-center shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow border border-border"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="text-primary" size={28} />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {item.title}
              </h3>
              <p className="text-lg font-semibold text-card-foreground mb-1">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-secondary rounded-2xl p-8 sm:p-12">
            <h3 className="text-2xl font-bold text-secondary-foreground mb-3">
              Ready to Get Started?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Schedule a free consultation with our experts and take the first step 
              toward your digital transformation.
            </p>
            <a
              href="mailto:hello@brightpath.tech"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium transition-colors"
            >
              <Mail size={20} />
              Send Us an Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;