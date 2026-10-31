import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroAbout } from "@/components/sections/HeroAbout";
import { Experience } from "@/components/sections/Experience";
import { Works } from "@/components/sections/Works";
import { SkillsPhilosophy } from "@/components/sections/SkillsPhilosophy";
import { MoreAboutMe } from "@/components/sections/MoreAboutMe";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main" className="relative z-10">
        <HeroAbout />
        <Experience />
        <Works />
        <SkillsPhilosophy />
        <MoreAboutMe />
        <Contact />
      </main>
      <Footer />
    </>
  );
}