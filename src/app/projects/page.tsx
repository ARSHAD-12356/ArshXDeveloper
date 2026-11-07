import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AllProjects } from "@/components/sections/AllProjects";

export const metadata: Metadata = {
  title: "All Projects",
  description: "Every development and analytics project by Md Arshad Raza.",
};

export default function AllProjectsPage() {
  return (
    <>
      <Header />
      <main id="main" className="relative z-10">
        <AllProjects />
      </main>
      <Footer />
    </>
  );
}
