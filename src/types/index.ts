export interface FlowNode {
  id: number;
  name: string;
  lane: 'Video Data Plane' | 'Event & Business Plane' | 'Storage & Evidence Plane';
  input: string;
  process: string;
  output: string;
  keyTechnology: string;
  failureMode: string;
  designNote: string;
}

export interface TechItem {
  name: string;
  status?: 'core' | 'optional' | 'future';
  description: string;
  whyNeeded: string;
  architecturePosition: string;
  costNote: string;
  alternative?: string;
  sourceType: string;
}

export interface TechCategory {
  id: string;
  name: string;
  items: TechItem[];
}

export interface CoreStackItem {
  name: string;
  role: string;
}

export interface OptionalBenchmarkItem {
  name: string;
  when: string;
  reason: string;
}

export interface FutureResearchItem {
  name: string;
  reason: string;
}

export interface AiModule {
  id: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  flow: string[];
  detectionGoal: string;
  eventOutput: string;
  coreStack: CoreStackItem[];
  whyChoose: string[];
  benchmarkNotes: string[];
  optionalBenchmarks: OptionalBenchmarkItem[];
  futureResearch: FutureResearchItem[];
  warning?: string;
  note?: string;
}


export interface HardwareItem {
  id: string;
  name: string;
  role: string;
  why: string;
  estimatedCost: string;
  note?: string;
  recommended?: string;
}

export interface HardwareGroup {
  id: string;
  title: string;
  description: string;
  components: HardwareItem[];
}

export type HardwareExplorerGroupId =
  | 'ai-server'
  | 'nas-storage'
  | 'network-components'
  | 'ups-components';

export type HardwareDiagramType = 'server' | 'nas' | 'network' | 'power';

export type HardwareCalculatorType = 'storage' | 'ups-poe';

export interface HardwarePart {
  id: string;
  label: string;
  shortLabel?: string;
  icon?: string;
  role: string;
  why: string;
  recommended?: string;
  estimatedCost?: string;
  note?: string;
  risk?: string;
  ctaLabel?: string;
  operatingRequirement?: string;
  acceptanceCriteria?: string;
  procurementNote?: string;
  dependencies?: string;
  warning?: string;
}

export interface HardwareExplorerGroup {
  id: HardwareExplorerGroupId;
  title: string;
  description: string;
  diagramType: HardwareDiagramType;
  defaultPartId: string;
  parts: HardwarePart[];
  calculator?: HardwareCalculatorType;
}

export interface VendorRow {
  id: string;
  component: string;
  recommendedSpec: string;
  estimatedRange: string;
  lowPrice: number; // in million VND
  highPrice: number; // in million VND
  sourceType: string;
  vendorName: string;
  vendorUrl: string;
  notes: string;
  lastChecked: string;
  confidence: 'Low' | 'Medium' | 'High';
}

export interface RiskItem {
  id: number;
  title: string;
  impact: 'Low' | 'Medium' | 'High';
  whyItMatters: string;
  control: string;
}
