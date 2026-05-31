export interface ProposalRecipient {
  name: string; // e.g. "The Executive Governor of Zamfara state"
  headingName: string; // e.g. "His Excellency, Dauda Lawal"
  address: string; // e.g. "Government House, Gusau, Zamfara State."
  attention: string; // e.g. "The Honorable Commissioner for Information and Culture"
  date: string; // e.g. "29th January 2026State"
}

export interface ProposalCompany {
  name: string;
  rc: string;
  tagline: string;
  address: string;
  tel: string;
  email: string;
  web: string;
  ceoName: string;
  ceoTitle: string;
}

export interface PillarItem {
  id: string;
  pillar: string;
  highlight: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  description: string;
  cost: number;
}

export interface JustificationItem {
  id: string;
  num: string; // e.g. "I", "ii", "iii"
  title: string;
  details: string;
  value: string;
}

export interface CostBenefitItem {
  id: string;
  area: string;
  benefit: string;
}

export interface StrategyItem {
  id: string;
  title: string;
  description: string;
}

export interface DistributionItem {
  id: string;
  title: string;
  description: string;
}

export interface TimelineItem {
  id: string;
  phase: string;
  duration: string;
  description: string;
}

export interface ProposalStructure {
  id: string;
  templateName: string;
  // Cover Page fields
  coverTitle: string;
  coverSubtitle: string;
  coverBadge: string;
  coverDescription: string;
  
  // Recipient and Meta
  recipient: ProposalRecipient;
  company: ProposalCompany;
  
  // Transmittal Letter Fields
  letterTitle: string;
  letterBody: string[];
  letterSignoff: string;
  
  // Document Body Fields
  docTitle: string;
  docSubtitle: string;
  execSummary: string;
  objectives: string[];
  
  // Tables / Content Lists
  pillars: PillarItem[];
  strategy: StrategyItem[];
  distribution: DistributionItem[];
  timeline: TimelineItem[];
  budget: BudgetItem[];
  justification: JustificationItem[];
  costBenefit: CostBenefitItem[];
  
  // Conclusion Page Fields
  conclusionTitle: string;
  conclusionParagraphs: string[];
  pathForwardTitle: string;
  pathForwardItems: string[];
  pathForwardClosing: string;
}
