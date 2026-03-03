import { Shield, Truck, RotateCcw, Headphones } from "lucide-react";

const badges = [
  { icon: Shield, title: "Secure Payments", desc: "Your data is protected" },
  { icon: Truck, title: "Fast Delivery", desc: "Quick turnaround times" },
  { icon: RotateCcw, title: "Quality Guarantee", desc: "Premium materials only" },
  { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
];

const TrustBadges = () => (
  <section className="py-12 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="glass-card p-5 text-center group hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-sm font-space mb-1">{title}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default TrustBadges;
