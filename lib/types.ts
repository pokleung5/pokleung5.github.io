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

export type Skill = {
  name: string;
  emphasis?: boolean;
  description?: string;
};

export type SkillGroup = {
  label: string;
  tagline: string;
  summary: string;
  strengths: string[];
  items: Skill[];
};

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

export type PortfolioData = {
  experiences: Experience[];
  projects: Project[];
  skillGroups: SkillGroup[];
  impactHighlights: ImpactHighlight[];
  testimonials: Testimonial[];
};
