import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface MessageBubbleProps {
  content: string;
  type: "user" | "agent" | "tool";
  timestamp: Date;
}

export default function MessageBubble({ content, type, timestamp }: MessageBubbleProps) {
  const isUser = type === "user";
  
  return (
    <div className={cn(
      "flex flex-col gap-1 mb-4",
      isUser ? "items-end" : "items-start"
    )}>
      <Card className={cn(
        "max-w-[80%] p-3 text-sm",
        isUser ? "bg-primary text-primary-foreground" : "bg-muted",
        type === "tool" && "border-l-4 border-accent"
      )}>
        {content}
      </Card>
      <span className="text-xs text-muted-foreground">
        {timestamp.toLocaleTimeString()}
      </span>
    </div>
  );
}
