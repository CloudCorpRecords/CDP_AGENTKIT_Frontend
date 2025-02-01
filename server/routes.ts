import type { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupWebSocket } from "./socket.js";
import { db } from "@db";
import { messages } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express) {
  const httpServer = createServer(app);
  const io = new Server(httpServer);

  // Setup WebSocket
  setupWebSocket(io);

  // API Routes
  app.get("/api/messages", async (req, res) => {
    try {
      const result = await db.query.messages.findMany({
        orderBy: (messages, { asc }) => [asc(messages.timestamp)],
        limit: 100
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.get("/api/wallet", async (req, res) => {
    try {
      // Get wallet info from CDP AgentKit
      res.json({
        network: process.env.NETWORK_ID || "base-sepolia",
        address: "0x..." // Get from CDP wallet provider
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wallet info" });
    }
  });

  return httpServer;
}