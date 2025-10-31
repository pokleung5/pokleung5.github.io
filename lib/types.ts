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

export type HeroCopy = {
  name: string;
  headline: string;
  summary: string;
  ctaProjects: string;
  ctaContact: string;
  scrollPrompt: string;
  error: string;
};

export type ProjectsShowcaseCopy = {
  title: string;
  description: string;
  empty: string;
  error: string;
};

export type TimelineCopy = {
  title: string;
  description: string;
  tagline: string;
  showMore: string;
  collapse: string;
  error: string;
};

export type ImpactHighlightsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  error: string;
};

export type TestimonialsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  empty: string;
  error: string;
};

export type FooterCopy = {
  label: string;
  tagline: string;
  craftedWith: string;
  links: {
    github: string;
    linkedin: string;
    email: string;
  };
};

export type PortfolioData = {
  experiences: Experience[];
  projects: Project[];
  impactHighlights: ImpactHighlight[];
  testimonials: Testimonial[];
  contact?: ContactCopy;
};
