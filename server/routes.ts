import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProgramSchema, type ProgramFilters } from "@shared/schema";
import { z } from "zod";

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

  // CRUD: Create program
  app.post("/api/programs", async (req, res) => {
    try {
      // Validate required fields first
      const { name, url, consortium, countries, field, deadline, durationMonths } = req.body;
      
      if (!name || !url || !consortium || !countries || !field || !deadline || !durationMonths) {
        return res.status(400).json({ 
          error: "Missing required fields",
          required: ["name", "url", "consortium", "countries", "field", "deadline", "durationMonths"]
        });
      }

      // Validate deadline is a valid date
      const parsedDeadline = new Date(deadline);
      if (isNaN(parsedDeadline.getTime())) {
        return res.status(400).json({ error: "Invalid deadline date format" });
      }

      const parsed = insertProgramSchema.safeParse({
        ...req.body,
        deadline: parsedDeadline
      });
      
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid program data", 
          details: parsed.error.flatten() 
        });
      }
      
      const program = await storage.createProgram(parsed.data);
      res.status(201).json(program);
    } catch (error) {
      console.error("Error creating program:", error);
      res.status(500).json({ error: "Failed to create program" });
    }
  });

  // CRUD: Update program
  app.put("/api/programs/:id", async (req, res) => {
    try {
      const updates: Record<string, unknown> = { ...req.body };
      
      // Validate deadline if provided
      if (updates.deadline) {
        const parsedDeadline = new Date(updates.deadline as string);
        if (isNaN(parsedDeadline.getTime())) {
          return res.status(400).json({ error: "Invalid deadline date format" });
        }
        updates.deadline = parsedDeadline;
      }
      
      // Remove undefined/null fields
      Object.keys(updates).forEach(key => {
        if (updates[key] === undefined || updates[key] === null || updates[key] === "") {
          delete updates[key];
        }
      });
      
      const program = await storage.updateProgram(req.params.id, updates);
      
      if (!program) {
        return res.status(404).json({ error: "Program not found" });
      }
      
      res.json(program);
    } catch (error) {
      console.error("Error updating program:", error);
      res.status(500).json({ error: "Failed to update program" });
    }
  });

  // CRUD: Delete program
  app.delete("/api/programs/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteProgram(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Program not found" });
      }
      
      res.json({ message: "Program deleted successfully" });
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ error: "Failed to delete program" });
    }
  });

  // Webhook endpoint for n8n/Zapier integration
  const webhookProgramSchema = z.object({
    action: z.enum(["create", "update", "delete"]),
    program: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
      url: z.string().optional(),
      consortium: z.string().optional(),
      countries: z.array(z.string()).optional(),
      field: z.string().optional(),
      deadline: z.string().optional(),
      durationMonths: z.number().optional(),
      tuitionCovered: z.boolean().optional(),
      monthlyAllowance: z.number().optional(),
      englishRequirement: z.string().optional(),
      description: z.string().optional(),
    }).optional(),
  });

  app.post("/api/webhooks/programs", async (req, res) => {
    try {
      const parsed = webhookProgramSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          error: "Invalid webhook payload", 
          details: parsed.error.flatten() 
        });
      }

      const { action, program: programData } = parsed.data;

      switch (action) {
        case "create": {
          if (!programData?.name || !programData?.url || !programData?.consortium || 
              !programData?.countries || !programData?.field || !programData?.deadline || 
              !programData?.durationMonths) {
            return res.status(400).json({ 
              error: "Missing required fields for create action",
              required: ["name", "url", "consortium", "countries", "field", "deadline", "durationMonths"]
            });
          }

          // Validate deadline is a valid date
          const parsedDeadline = new Date(programData.deadline);
          if (isNaN(parsedDeadline.getTime())) {
            return res.status(400).json({ error: "Invalid deadline date format" });
          }
          
          const newProgram = await storage.createProgram({
            name: programData.name,
            url: programData.url,
            consortium: programData.consortium,
            countries: programData.countries,
            field: programData.field,
            deadline: parsedDeadline,
            durationMonths: programData.durationMonths,
            tuitionCovered: programData.tuitionCovered ?? true,
            monthlyAllowance: programData.monthlyAllowance,
            englishRequirement: programData.englishRequirement,
            description: programData.description,
          });
          
          return res.status(201).json({ 
            success: true, 
            action: "created", 
            program: newProgram 
          });
        }
        
        case "update": {
          if (!programData?.id) {
            return res.status(400).json({ error: "Program ID required for update action" });
          }
          
          const updates: Record<string, unknown> = { ...programData };
          delete updates.id;
          if (updates.deadline) {
            const parsedDeadline = new Date(updates.deadline as string);
            if (isNaN(parsedDeadline.getTime())) {
              return res.status(400).json({ error: "Invalid deadline date format" });
            }
            updates.deadline = parsedDeadline;
          }
          
          const updated = await storage.updateProgram(programData.id, updates);
          
          if (!updated) {
            return res.status(404).json({ error: "Program not found" });
          }
          
          return res.json({ 
            success: true, 
            action: "updated", 
            program: updated 
          });
        }
        
        case "delete": {
          if (!programData?.id) {
            return res.status(400).json({ error: "Program ID required for delete action" });
          }
          
          const deleted = await storage.deleteProgram(programData.id);
          
          if (!deleted) {
            return res.status(404).json({ error: "Program not found" });
          }
          
          return res.json({ 
            success: true, 
            action: "deleted", 
            id: programData.id 
          });
        }
        
        default:
          return res.status(400).json({ error: "Invalid action" });
      }
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  return httpServer;
}
