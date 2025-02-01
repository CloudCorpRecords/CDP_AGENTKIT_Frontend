import MessageBubble from "./message-bubble";

type Message = {
  id: string;
  content: string;
  type: "user" | "agent" | "tool";
  timestamp: Date;
};

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-col">
      {messages.map(message => (
        <MessageBubble
          key={message.id}
          content={message.content}
          type={message.type}
          timestamp={message.timestamp}
        />
      ))}
      {messages.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No messages yet. Start a conversation!
        </div>
      )}
    </div>
  );
}
