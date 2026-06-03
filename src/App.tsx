import { AppShell } from "./components/layout/AppShell";
import { ExecutiveSnapshot } from "./components/sections/ExecutiveSnapshot";
import { HowItWorks } from "./components/sections/HowItWorks";
import { ArchitectureOverview } from "./components/sections/ArchitectureOverview";
import { FullTechStackMatrix } from "./components/sections/FullTechStackMatrix";
import { DetailedOperationalFlow } from "./components/sections/DetailedOperationalFlow";
import { CameraNetworkStack } from "./components/sections/CameraNetworkStack";
import { VideoAiPipeline } from "./components/sections/VideoAiPipeline";
import { AiModelStack } from "./components/sections/AiModelStack";
import { BackendDataStack } from "./components/sections/BackendDataStack";
import { SecurityMonitoring } from "./components/sections/SecurityMonitoring";
import { HardwareBlueprint } from "./components/sections/HardwareBlueprint";
import { CostRecommendation } from "./components/sections/CostRecommendation";

function App() {
  return (
    <AppShell>
      <ExecutiveSnapshot />
      <HowItWorks />
      <ArchitectureOverview />
      <FullTechStackMatrix />
      <DetailedOperationalFlow />
      <CameraNetworkStack />
      <VideoAiPipeline />
      <AiModelStack />
      <BackendDataStack />
      <SecurityMonitoring />
      <HardwareBlueprint />
      <CostRecommendation />
    </AppShell>
  );
}

export default App;
