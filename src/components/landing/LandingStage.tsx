import { LandingHero } from "@/components/landing/LandingHero";
import { LandingPreview } from "@/components/landing/LandingPreview";

export function LandingStage() {
  return (
    <div className="landing-stage">
      <div className="landing-hero-pin">
        <div className="landing-hero-inner landing-recede">
          <LandingHero />
        </div>
      </div>
      <div className="landing-preview-pin">
        <div className="landing-preview-inner landing-preview-motion">
          <LandingPreview />
        </div>
      </div>
    </div>
  );
}
