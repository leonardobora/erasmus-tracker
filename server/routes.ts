import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import type { ProgramFilters } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  await storage.seedPrograms();

  app.get("/api/programs", async (req, res) => {
    try {
      const filters: ProgramFilters = {
        field: req.query.field as string | undefined,
        country: req.query.country as string | undefined,
        sortBy: (req.query.sortBy as "deadline" | "name") || "deadline"
      };

      const programs = await storage.getPrograms(filters);
      
      res.json({
        total: programs.length,
        programs,
        filtersApplied: filters
      });
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ error: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:id", async (req, res) => {
    try {
      const program = await storage.getProgram(req.params.id);
      
      if (!program) {
        return res.status(404).json({ error: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      console.error("Error fetching program:", error);
      res.status(500).json({ error: "Failed to fetch program" });
    }
  });

  app.get("/api/deadlines/upcoming", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const programs = await storage.getUpcomingDeadlines(days);
      
      res.json({
        upcomingCount: programs.length,
        programs
      });
    } catch (error) {
      console.error("Error fetching deadlines:", error);
      res.status(500).json({ error: "Failed to fetch deadlines" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.post("/api/programs/seed", async (req, res) => {
    try {
      const count = await storage.seedPrograms();
      res.json({ 
        message: "Programs seeded successfully", 
        programsAdded: count 
      });
    } catch (error) {
      console.error("Error seeding programs:", error);
      res.status(500).json({ error: "Failed to seed programs" });
    }
  });

  return httpServer;
}
