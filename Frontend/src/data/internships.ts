export interface Internship {
  id: number;
  company: string;
  role: string;
  location: string;
  type: "Remote" | "On-site" | "Hybrid";
  category: string;
  postedDate: string;
  logo: string;
  applyLink: string; 
  stipend?: string;
  description?: string;
  skills?: string[];
}

export const internships: Internship[] = [
  { id: 1, company: "Google", role: "Frontend Developer Intern", location: "Bangalore", type: "Hybrid", category: "Frontend", postedDate: "2 days ago", logo: "G", applyLink: "https://careers.google.com" },
  { id: 2, company: "Microsoft", role: "Backend Engineer Intern", location: "Hyderabad", type: "On-site", category: "Backend", postedDate: "1 day ago", logo: "M", applyLink: "https://careers.microsoft.com" },
  { id: 3, company: "Amazon", role: "AI/ML Research Intern", location: "Remote", type: "Remote", category: "AI", postedDate: "3 days ago", logo: "A", applyLink: "https://amazon.jobs" },
  { id: 4, company: "Meta", role: "Full Stack Developer Intern", location: "Mumbai", type: "Hybrid", category: "Frontend", postedDate: "5 days ago", logo: "M", applyLink: "https://www.metacareers.com" },
  { id: 5, company: "Netflix", role: "Data Science Intern", location: "Remote", type: "Remote", category: "AI", postedDate: "1 week ago", logo: "N", applyLink: "https://jobs.netflix.com" },
  { id: 6, company: "Apple", role: "iOS Developer Intern", location: "Chennai", type: "On-site", category: "Frontend", postedDate: "4 days ago", logo: "A", applyLink: "https://jobs.apple.com" },
  { id: 7, company: "Stripe", role: "Backend Developer Intern", location: "Pune", type: "Remote", category: "Backend", postedDate: "6 days ago", logo: "S", applyLink: "https://stripe.com/jobs" },
  { id: 8, company: "Spotify", role: "UI/UX Design Intern", location: "Delhi", type: "Hybrid", category: "Frontend", postedDate: "2 days ago", logo: "S", applyLink: "https://www.lifeatspotify.com/jobs" },
  { id: 9, company: "Uber", role: "DevOps Intern", location: "Bangalore", type: "On-site", category: "Backend", postedDate: "3 days ago", logo: "U", applyLink: "https://www.uber.com/careers" },
  { id: 10, company: "Figma", role: "Product Design Intern", location: "Remote", type: "Remote", category: "Frontend", postedDate: "1 day ago", logo: "F", applyLink: "https://www.figma.com/careers" },
  { id: 11, company: "OpenAI", role: "ML Engineer Intern", location: "Remote", type: "Remote", category: "AI", postedDate: "Just now", logo: "O", applyLink: "https://openai.com/careers" },
  { id: 12, company: "Slack", role: "Frontend Engineer Intern", location: "Hyderabad", type: "Hybrid", category: "Frontend", postedDate: "4 days ago", logo: "S", applyLink: "https://slack.com/careers" },
];

export const locations = [...new Set(internships.map((i) => i.location))];
export const companies = [...new Set(internships.map((i) => i.company))];
export const categories = ["Frontend", "Backend", "AI"];
export const workTypes = ["Remote", "On-site", "Hybrid"];