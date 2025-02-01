import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Wifi, WifiOff } from "lucide-react";

interface NetworkStatusProps {
  isConnected: boolean;
}

export default function NetworkStatus({ isConnected }: NetworkStatusProps) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant={isConnected ? "default" : "destructive"}>
          {isConnected ? (
            <Wifi className="h-4 w-4 mr-1" />
          ) : (
            <WifiOff className="h-4 w-4 mr-1" />
          )}
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>WebSocket connection status</p>
      </TooltipContent>
    </Tooltip>
  );
}
