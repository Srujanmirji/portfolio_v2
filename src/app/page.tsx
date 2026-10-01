import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Timeline } from "@/components/sections/Timeline";
import { Lab } from "@/components/sections/Lab";
import { TechStack } from "@/components/sections/TechStack";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Timeline />
      <Lab />
      <TechStack />
      <Contact />
    </>
  );
}
