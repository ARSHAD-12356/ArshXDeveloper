import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BrandIntroduction } from "@/components/sections/BrandIntroduction";
import { HeroAbout } from "@/components/sections/HeroAbout";
import { Experience } from "@/components/sections/Experience";
import { Works } from "@/components/sections/Works";
import { SkillsPhilosophy } from "@/components/sections/SkillsPhilosophy";
import { MoreAboutMe } from "@/components/sections/MoreAboutMe";
import { Contact } from "@/components/sections/Contact";
import { HomeScrollRestore } from "@/components/providers/HomeScrollRestore";

export default function Home() {
  return (
    <>
      <HomeScrollRestore />
      <Header />
      <main id="main" className="relative z-10">
        <BrandIntroduction />
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