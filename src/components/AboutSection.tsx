import { CheckCircle, Target, Lightbulb, Handshake } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Results-Driven',
    description: 'We focus on delivering measurable outcomes that directly impact your business success.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'Staying ahead of technology trends to bring you cutting-edge solutions.',
  },
  {
    icon: Handshake,
    title: 'True Partnership',
    description: 'We work alongside you as an extension of your team, not just a vendor.',
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-6">
              Your Trusted Technology Partner
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              BrightPath Technologies is a leading IT services and consulting firm dedicated to helping 
              businesses navigate the complex digital landscape. With over a decade of experience, we've 
              helped hundreds of organizations transform their operations through strategic technology solutions.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Our team of certified experts brings deep industry knowledge and a passion for innovation 
              to every project. We don't just implement technology—we create lasting partnerships that 
              drive continuous growth and success.
            </p>

            {/* Checklist */}
            <ul className="space-y-4">
              {[
                'Certified technology experts',
                'Industry-specific solutions',
                '24/7 dedicated support',
                'Proven track record',
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-primary shrink-0" size={20} />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Values Cards */}
          <div className="space-y-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow border border-border"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <value.icon className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;