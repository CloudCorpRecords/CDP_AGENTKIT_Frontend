import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Socket, io } from "socket.io-client";
import ModeSelector from "@/components/chat/mode-selector";
import MessageList from "@/components/chat/message-list";
import WalletInfo from "@/components/chat/wallet-info";
import NetworkStatus from "@/components/chat/network-status";
import { Send } from "lucide-react";

type Message = {
  id: string;
  content: string;
  type: "user" | "agent" | "tool";
  timestamp: string | Date;
};

export default function Chat() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"chat" | "auto">("chat");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      toast({
        title: "Connected to server",
        description: "Ready to chat!",
      });
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      toast({
        title: "Disconnected from server",
        description: "Trying to reconnect...",
        variant: "destructive",
      });
    });

    newSocket.on("message", (msg: Message) => {
      // Ensure timestamp is a Date object
      const msgWithDate = {
        ...msg,
        timestamp: new Date(msg.timestamp)
      };
      setMessages(prev => [...prev, msgWithDate]);
      // Reset loading state after receiving a message
      setIsLoading(false);
    });

    newSocket.on("error", (error: string) => {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      setIsLoading(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket || !isConnected || isLoading) return;

    setIsLoading(true);
    const message: Message = {
      id: Date.now().toString(),
      content: input,
      type: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    socket.emit("chat", input);
    setInput("");
  };

  const handleModeChange = (newMode: "chat" | "auto") => {
    setMode(newMode);
    if (socket) {
      socket.emit("mode", newMode);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-col w-full max-w-5xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <ModeSelector mode={mode} onChange={handleModeChange} />
          <NetworkStatus isConnected={isConnected} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="md:col-span-3">
            <ScrollArea className="h-[70vh] rounded-lg border bg-card p-4">
              <MessageList messages={messages} />
            </ScrollArea>
          </div>
          <div className="md:col-span-1">
            <WalletInfo />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={!isConnected || mode === "auto" || isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!isConnected || mode === "auto" || isLoading}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}