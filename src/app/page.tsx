import { LandingStage } from "@/components/landing/LandingStage";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingTrust } from "@/components/landing/LandingTrust";

export default function HomePage() {
  return (
    <>
      <LandingStage />
      <LandingHowItWorks />
      <LandingTrust />
    </>
  );
}
