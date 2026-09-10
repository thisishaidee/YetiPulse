import { LandingHero } from "@/components/landing/LandingHero";
import { LandingPreview } from "@/components/landing/LandingPreview";

export function LandingStage() {
  return (
    <div className="landing-stage">
      <div className="landing-hero-pin">
        <LandingHero />
      </div>
      <div className="landing-preview-pin">
        <LandingPreview />
      </div>
    </div>
  );
}
