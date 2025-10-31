export type Experience = {
  title: string;
  company: string;
  period: string;
  description: string;
  focus: string;
  highlights: string[];
  tools: string[];
};

export type ProjectCategory = 'Commerce' | 'Platform' | 'Product Delivery';

export type Project = {
  name: string;
  category: ProjectCategory;
  tagline: string;
  description: string;
  technologies: string[];
  highlight: string;
};

export type ProjectFilter = 'All' | ProjectCategory;

export type ImpactHighlight = {
  metric: string;
  label: string;
  description: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export type ContactCopy = {
  eyebrow?: string;
  title: string;
  description: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  submittingLabel?: string;
  submittedLabel: string;
  successMessage?: string;
  statusMessage: string;
  errorMessage?: string;
  captchaErrorMessage?: string;
  error?: string;
  subject?: string;
};

export type PortfolioData = {
  experiences: Experience[];
  projects: Project[];
  impactHighlights: ImpactHighlight[];
  testimonials: Testimonial[];
  contact?: ContactCopy;
};
