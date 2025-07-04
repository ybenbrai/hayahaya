"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { WebSocketClient } from "@/lib/websocket";
import { ScoreDisplay } from "@/components/ui/score-display";
import { LineupDisplay } from "@/components/ui/lineup";
import { Chat } from "@/components/ui/chat";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Trophy,
  MapPin,
  Clock,
  Users,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { ChatMessage } from "@/types";

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser] = useState({ id: "user-1", username: "FootballFan" });

  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => apiClient.getGame(gameId),
    refetchInterval: 10000,
  });

  const { data: lineup, isLoading: lineupLoading } = useQuery({
    queryKey: ["lineup", gameId],
    queryFn: () => apiClient.getLineup(gameId),
    enabled: !!game,
  });

  const { data: initialChatMessages } = useQuery({
    queryKey: ["chat", gameId],
    queryFn: () => apiClient.getChatMessages(gameId),
    enabled: !!game,
  });

  useEffect(() => {
    if (initialChatMessages) {
      setChatMessages(initialChatMessages);
    }
  }, [initialChatMessages]);

  useEffect(() => {
    if (game && game.status === "live") {
      const client = new WebSocketClient(
        gameId,
        undefined,
        (message) => {
          setChatMessages((prev) => [...prev, message]);
        },
        (connected) => {
          setIsConnected(connected);
        }
      );

      client.connect();
      setWsClient(client);

      return () => {
        client.disconnect();
      };
    }
  }, [gameId, game?.status]);

  const handleSendMessage = (message: string) => {
    if (wsClient) {
      wsClient.sendChatMessage(message, currentUser.id);
    }
  };

  if (gameLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested game could not be found.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Trophy className="h-4 w-4" />
            <span>{game.competition}</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{game.venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(game.startTime)}</span>
            </div>
            {game.status === "live" && (
              <Badge variant="destructive" className="animate-pulse">
                LIVE
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-8">
          <ScoreDisplay game={game} />
        </div>

        <Tabs defaultValue="lineup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lineup" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lineup
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Live Chat
              {!isConnected && game.status === "live" && (
                <Badge variant="outline" className="ml-2">
                  Connecting...
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="lineup" className="space-y-6">
            {lineupLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="h-96 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : lineup ? (
              <LineupDisplay
                lineup={lineup}
                homeTeamName={game.homeTeam.name}
                awayTeamName={game.awayTeam.name}
              />
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Lineup Not Available
                </h3>
                <p className="text-muted-foreground">
                  Team lineups will be available closer to kickoff
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            {game.status === "live" ? (
              <Chat
                messages={chatMessages}
                onSendMessage={handleSendMessage}
                currentUserId={currentUser.id}
              />
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Chat Not Available</h3>
                <p className="text-muted-foreground">
                  Live chat will be available during the match
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
