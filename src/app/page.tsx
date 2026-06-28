import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { ToolsShowcase } from "@/components/home/tools-showcase";
import { CallToAction } from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <ToolsShowcase />
      <CallToAction />
    </>
  );
}
