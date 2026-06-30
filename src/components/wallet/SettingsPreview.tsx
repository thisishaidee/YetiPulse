import { NetworkStatusPreview } from "@/components/wallet/NetworkStatusPreview";
import { PreferencesSettings } from "@/components/wallet/PreferencesSettings";
import { SystemConfigurationPreview } from "@/components/wallet/SystemConfigurationPreview";

export function SettingsPreview() {
  return (
    <div className="space-y-8">
      <NetworkStatusPreview />
      <PreferencesSettings />
      <SystemConfigurationPreview />
    </div>
  );
}
