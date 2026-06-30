import { RiskSignalsGuide } from "@/components/wallet/RiskSignalsGuide";
import { DemoThreatExamples } from "@/components/wallet/DemoThreatExamples";
import { RiskDetectionCapabilities } from "@/components/wallet/RiskDetectionCapabilities";

export function RiskPreview() {
  return (
    <div className="space-y-8">
      <RiskSignalsGuide />
      <DemoThreatExamples />
      <RiskDetectionCapabilities />
    </div>
  );
}
