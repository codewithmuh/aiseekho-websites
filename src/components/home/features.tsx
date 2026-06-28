import { Zap, ShieldCheck, Gift, Smartphone } from "lucide-react";

const features = [
  {
    icon: Gift,
    title: "100% free",
    description: "Every tool is free to use, with no hidden limits or paywalls.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-friendly",
    description:
      "Tools run in your browser. Your data isn't uploaded to a server.",
  },
  {
    icon: Zap,
    title: "Fast & no sign-up",
    description: "Open a tool and start using it instantly. No account needed.",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    description: "Responsive design that works great on desktop and mobile.",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-xl border border-border bg-card p-6"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <feature.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-semibold">{feature.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
