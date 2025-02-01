import type { Server } from "socket.io";
import { initializeAgent } from "../attached_assets/chatbot.js";
import { db } from "@db";
import { messages } from "@db/schema";
import { HumanMessage } from "@langchain/core/messages";

export function setupWebSocket(io: Server) {
  io.on("connection", async (socket) => {
    console.log("Client connected");
    let mode: "chat" | "auto" = "chat";
    let agent: any;
    let config: any;

    try {
      const result = await initializeAgent();
      agent = result.agent;
      config = result.config;
    } catch (error) {
      console.error("Agent initialization error:", error);
      socket.emit("error", "Failed to initialize agent");
      return;
    }

    socket.on("chat", async (message: string) => {
      try {
        const stream = await agent.stream(
          { messages: [new HumanMessage(message)] },
          config
        );

        // Save user message first
        await db.insert(messages).values([{
          content: message,
          type: "user",
          timestamp: new Date()
        }]);

        for await (const chunk of stream) {
          if ("agent" in chunk) {
            const msg = {
              content: chunk.agent.messages[0].content,
              type: "agent" as const,
              timestamp: new Date()
            };
            await db.insert(messages).values([msg]);
            socket.emit("message", { ...msg, id: Date.now().toString() });
          } else if ("tools" in chunk) {
            const msg = {
              content: chunk.tools.messages[0].content,
              type: "tool" as const,
              timestamp: new Date()
            };
            await db.insert(messages).values([msg]);
            socket.emit("message", { ...msg, id: Date.now().toString() });
          }
        }
      } catch (error) {
        console.error("Message processing error:", error);
        socket.emit("error", "Failed to process message");
      }
    });

    socket.on("mode", (newMode: "chat" | "auto") => {
      mode = newMode;
      if (mode === "auto") {
        // Start autonomous mode
        // Implementation similar to runAutonomousMode from chatbot.ts
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}