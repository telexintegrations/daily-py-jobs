export interface ITelexSettings {
  label: string;
  type: string;
  required: boolean;
  default: string;
  options?: string[];
}

export interface IJobQuerySettings {
  interval: string;
  location: string;
  experience_level: string;
  employment_type: string;
  prefered_framework: string;
}

export interface IJobQuery {
  title: string;
  created_at_gte: string;
  application_active: boolean;
  keyword_description?: string;
  location?: string;
  seniority?: string;
  employment_type?: string;
}

export interface IJobResponse {
  created_at_gte: "string";
  created_at_lte: "string";
  last_updated_gte: "string";
  last_updated_lte: "string";
  title: "string";
  keyword_description: "string";
  employment_type: "string";
  location: "string";
  company_id: 0;
  company_name: "string";
  company_domain: "string";
  company_exact_website: "string";
  company_professional_network_url: "string";
  deleted: true;
  application_active: true;
  country: "string";
  industry: "string";
}
