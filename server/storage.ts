import { type User, type InsertUser, type Program, type InsertProgram, type ProgramWithDaysUntil, type ProgramStats, type ProgramFilters } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getPrograms(filters?: ProgramFilters): Promise<ProgramWithDaysUntil[]>;
  getProgram(id: string): Promise<ProgramWithDaysUntil | undefined>;
  getUpcomingDeadlines(days: number): Promise<ProgramWithDaysUntil[]>;
  getStats(): Promise<ProgramStats>;
  createProgram(program: InsertProgram): Promise<Program>;
  seedPrograms(): Promise<number>;
}

function calculateDaysUntilDeadline(deadline: Date): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function addDaysUntil(program: Program): ProgramWithDaysUntil {
  return {
    ...program,
    daysUntilDeadline: calculateDaysUntilDeadline(program.deadline)
  };
}

const samplePrograms: InsertProgram[] = [
  {
    name: "META4.0 - Machine Learning for Advanced Manufacturing",
    url: "https://master-meta4-0.eu",
    consortium: "KTH Royal Institute of Technology + Chalmers + Politecnico di Milano",
    countries: ["Sweden", "Italy", "Germany"],
    field: "AI/ML",
    deadline: new Date("2026-02-15"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.5 or TOEFL 90",
    description: "The META4.0 master program focuses on applying machine learning and AI techniques to advanced manufacturing processes. Students will learn to develop intelligent systems for Industry 4.0 applications."
  },
  {
    name: "EMJMD in Data Science (EIT Data)",
    url: "https://www.eit.europa.eu/data",
    consortium: "TU Eindhoven + Aalto University + UPM Madrid",
    countries: ["Netherlands", "Finland", "Spain"],
    field: "Data Science",
    deadline: new Date("2026-01-31"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.5",
    description: "A comprehensive data science program covering machine learning, big data analytics, and business intelligence."
  },
  {
    name: "MARIHE - Research and Innovation in Higher Education",
    url: "https://www.marihe.eu",
    consortium: "Danube University Krems + Beijing Normal University + Tampere University",
    countries: ["Austria", "China", "Finland"],
    field: "Social Sciences",
    deadline: new Date("2026-03-15"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.5 or equivalent",
    description: "MARIHE prepares students for leadership roles in higher education management and research policy."
  },
  {
    name: "EMJMD Sustainable Transportation and Electrical Power Systems",
    url: "https://www.stepsprogramme.eu",
    consortium: "University of Oviedo + Nottingham + Roma Sapienza",
    countries: ["Spain", "UK", "Italy"],
    field: "Engineering",
    deadline: new Date("2026-02-28"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.5",
    description: "Focus on sustainable transportation systems, electric vehicles, and renewable energy integration."
  },
  {
    name: "MEDfOR - Mediterranean Forestry and Natural Resources",
    url: "https://www.medfor.eu",
    consortium: "University of Lisbon + University of Padova + University of Lleida",
    countries: ["Portugal", "Italy", "Spain", "Turkey"],
    field: "Sustainability",
    deadline: new Date("2026-01-20"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.0",
    description: "Focused on sustainable management of Mediterranean forest ecosystems and natural resources."
  },
  {
    name: "EMJMD Digital Communication Leadership",
    url: "https://www.dcl-master.eu",
    consortium: "Aalborg University + Salzburg University + VU Amsterdam",
    countries: ["Denmark", "Austria", "Netherlands"],
    field: "Business",
    deadline: new Date("2026-02-10"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 7.0",
    description: "Prepares future leaders in digital communication and media management."
  },
  {
    name: "EUROPHOTONICS - Engineering of Light",
    url: "https://www.europhotonics.org",
    consortium: "Aix-Marseille + Karlsruhe + Barcelona + Florence",
    countries: ["France", "Germany", "Spain", "Italy"],
    field: "Engineering",
    deadline: new Date("2026-03-01"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.5",
    description: "Advanced photonics engineering covering optical technologies and laser science."
  },
  {
    name: "IMLEX - Imaging and Light in Extended Reality",
    url: "https://imlex.org",
    consortium: "University of Eastern Finland + KU Leuven + Toyohashi",
    countries: ["Finland", "Belgium", "Japan"],
    field: "AI/ML",
    deadline: new Date("2026-02-20"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.5",
    description: "Combines imaging science with extended reality (VR/AR) technologies."
  },
  {
    name: "Global Health Master",
    url: "https://globalhealthmaster.eu",
    consortium: "University of Copenhagen + Maastricht + Barcelona",
    countries: ["Denmark", "Netherlands", "Spain"],
    field: "Health",
    deadline: new Date("2026-01-25"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 7.0",
    description: "Comprehensive program covering global health challenges, epidemiology, and health policy."
  },
  {
    name: "EMJMD Choreomundus - Dance Knowledge, Practice and Heritage",
    url: "https://choreomundus.org",
    consortium: "NTNU Norway + Clermont Auvergne + Roehampton + Szeged",
    countries: ["Norway", "France", "UK", "Hungary"],
    field: "Arts & Humanities",
    deadline: new Date("2026-03-10"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.5",
    description: "Interdisciplinary program exploring dance as intangible cultural heritage."
  },
  {
    name: "EMQAL - European Master in Quality Analytical Laboratories",
    url: "https://emqal.org",
    consortium: "University of Barcelona + Lisbon + Cadiz + Bergen",
    countries: ["Spain", "Portugal", "Norway"],
    field: "Engineering",
    deadline: new Date("2026-02-05"),
    durationMonths: 18,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.0",
    description: "Training in analytical chemistry and quality management for laboratories."
  },
  {
    name: "PIONEER - Personalized Healthcare with Big Data",
    url: "https://pioneer-master.eu",
    consortium: "Maastricht + Karolinska + Oxford",
    countries: ["Netherlands", "Sweden", "UK"],
    field: "Health",
    deadline: new Date("2026-01-30"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 7.0",
    description: "Combining healthcare with big data analytics for personalized medicine."
  },
  {
    name: "CDE - Coastal and Delta Environments",
    url: "https://cde-master.eu",
    consortium: "University of Bordeaux + Venice + Southampton",
    countries: ["France", "Italy", "UK"],
    field: "Sustainability",
    deadline: new Date("2026-02-25"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.5",
    description: "Environmental science program focused on coastal ecosystems and climate change adaptation."
  },
  {
    name: "EDISS - Engineering of Data-intensive Intelligent Software Systems",
    url: "https://ediss-master.eu",
    consortium: "TU Eindhoven + UPC Barcelona + TU Kaiserslautern",
    countries: ["Netherlands", "Spain", "Germany"],
    field: "Data Science",
    deadline: new Date("2026-02-12"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.5",
    description: "Software engineering with focus on AI and data-intensive applications."
  },
  {
    name: "SERP+ Surface and Interface Science",
    url: "https://serp.eu",
    consortium: "Paris-Saclay + TU Dresden + Genova",
    countries: ["France", "Germany", "Italy"],
    field: "Engineering",
    deadline: new Date("2026-03-05"),
    durationMonths: 24,
    tuitionCovered: true,
    monthlyAllowance: 1400,
    englishRequirement: "IELTS 6.0",
    description: "Advanced materials science covering surface physics and nanotechnology."
  }
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private programs: Map<string, Program>;
  private seeded: boolean = false;

  constructor() {
    this.users = new Map();
    this.programs = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPrograms(filters?: ProgramFilters): Promise<ProgramWithDaysUntil[]> {
    let programs = Array.from(this.programs.values());

    if (filters?.field) {
      programs = programs.filter(p => p.field === filters.field);
    }

    if (filters?.country) {
      programs = programs.filter(p => 
        p.countries.some(c => c.toLowerCase().includes(filters.country!.toLowerCase()))
      );
    }

    const programsWithDays = programs.map(addDaysUntil);

    if (filters?.sortBy === "name") {
      programsWithDays.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      programsWithDays.sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
    }

    return programsWithDays;
  }

  async getProgram(id: string): Promise<ProgramWithDaysUntil | undefined> {
    const program = this.programs.get(id);
    if (!program) return undefined;
    return addDaysUntil(program);
  }

  async getUpcomingDeadlines(days: number): Promise<ProgramWithDaysUntil[]> {
    const programs = Array.from(this.programs.values())
      .map(addDaysUntil)
      .filter(p => p.daysUntilDeadline >= 0 && p.daysUntilDeadline <= days)
      .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);
    
    return programs;
  }

  async getStats(): Promise<ProgramStats> {
    const programs = Array.from(this.programs.values());
    const allCountries = new Set<string>();
    const allFields = new Set<string>();
    let totalDays = 0;
    let activeCount = 0;

    programs.forEach(p => {
      p.countries.forEach(c => allCountries.add(c));
      allFields.add(p.field);
      const daysUntil = calculateDaysUntilDeadline(p.deadline);
      if (daysUntil >= 0) {
        totalDays += daysUntil;
        activeCount++;
      }
    });

    return {
      totalPrograms: programs.length,
      totalCountries: allCountries.size,
      fields: Array.from(allFields).sort(),
      avgDeadlineDays: activeCount > 0 ? Math.round(totalDays / activeCount) : 0
    };
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const id = randomUUID();
    const now = new Date();
    const program: Program = {
      ...insertProgram,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.programs.set(id, program);
    return program;
  }

  async seedPrograms(): Promise<number> {
    if (this.seeded) {
      return this.programs.size;
    }

    for (const programData of samplePrograms) {
      await this.createProgram(programData);
    }

    this.seeded = true;
    return samplePrograms.length;
  }
}

export const storage = new MemStorage();
