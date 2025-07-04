"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api";
import { WebSocketClient } from "@/lib/websocket";
import { MatchHeader } from "@/components/ui/match-header";
import { FootballField } from "@/components/ui/football-field";
import { VideoPlayer } from "@/components/ui/video-player";
import { MatchEvents } from "@/components/ui/match-events";
import { MatchStats } from "@/components/ui/match-stats";
import { EnhancedLineupDisplay } from "@/components/ui/enhanced-lineup-display";
import { Chat } from "@/components/ui/chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Users,
  MessageCircle,
  BarChart3,
  Play,
  Target,
  Share2,
  Heart,
  Bell,
  Eye,
} from "lucide-react";
import { ChatMessage } from "@/types";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function GamePage() {
  const params = useParams();
  const gameId = params.id as string;
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser] = useState({ id: "user-1", username: "FootballFan" });
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: game, isLoading: gameLoading } = useQuery({
    queryKey: ["enhanced-game", gameId],
    queryFn: () => apiClient.getEnhancedGame(gameId),
    refetchInterval: 10000,
  });

  const { data: lineup, isLoading: lineupLoading } = useQuery({
    queryKey: ["enhanced-lineup", gameId],
    queryFn: () => apiClient.getEnhancedLineup(gameId),
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
  }, [gameId, game?.status, game]);

  const handleSendMessage = (message: string) => {
    if (wsClient) {
      wsClient.sendChatMessage(message, currentUser.id);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${game?.homeTeam.name} vs ${game?.awayTeam.name}`,
        text: `Watch live: ${game?.homeTeam.name} ${game?.homeScore} - ${game?.awayScore} ${game?.awayTeam.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (gameLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading match details...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Match Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested match could not be found.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Navigation */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Match Header */}
        <MatchHeader game={game} />

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <Button
            onClick={() => setIsFavorite(!isFavorite)}
            variant={isFavorite ? "default" : "outline"}
          >
            <Heart
              className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`}
            />
            {isFavorite ? "Favorited" : "Favorite"}
          </Button>

          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>

          {game.status === "live" && (
            <Badge variant="destructive" className="animate-pulse">
              <Eye className="h-4 w-4 mr-2" />
              LIVE
            </Badge>
          )}
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="lineup" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lineup
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stats
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="stream" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Stream
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
              {!isConnected && game.status === "live" && (
                <Badge variant="outline" className="ml-2">
                  Connecting...
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-6" key="overview">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Football Field */}
                {lineup && game.fieldPositions.length > 0 && (
                  <FootballField
                    fieldPositions={game.fieldPositions}
                    lineup={lineup}
                    homeTeamName={game.homeTeam.name}
                    awayTeamName={game.awayTeam.name}
                  />
                )}

                {/* Match Stats Summary */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Possession
                        </span>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">
                            {game.homeTeamStats.possession.toFixed(1)}%
                          </span>
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${game.homeTeamStats.possession}%`,
                              }}
                            />
                          </div>
                          <span className="font-medium">
                            {game.awayTeamStats.possession.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Shots
                        </span>
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">
                            {game.homeTeamStats.shots}
                          </span>
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{
                                width: `${
                                  (game.homeTeamStats.shots /
                                    Math.max(
                                      game.homeTeamStats.shots +
                                        game.awayTeamStats.shots,
                                      1
                                    )) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                          <span className="font-medium">
                            {game.awayTeamStats.shots}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="lineup" className="space-y-6" key="lineup">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
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
                  <EnhancedLineupDisplay
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
              </motion.div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6" key="stats">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MatchStats
                  homeTeamStats={game.homeTeamStats}
                  awayTeamStats={game.awayTeamStats}
                  homeTeamName={game.homeTeam.name}
                  awayTeamName={game.awayTeam.name}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="events" className="space-y-6" key="events">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <MatchEvents
                  events={game.events}
                  homeTeamName={game.homeTeam.name}
                  awayTeamName={game.awayTeam.name}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="stream" className="space-y-6" key="stream">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {game.streams.length > 0 ? (
                  <VideoPlayer streams={game.streams} />
                ) : (
                  <div className="text-center py-12">
                    <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Stream Available
                    </h3>
                    <p className="text-muted-foreground">
                      Live stream will be available during the match
                    </p>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6" key="chat">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {game.status === "live" ? (
                  <Chat
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    currentUserId={currentUser.id}
                  />
                ) : (
                  <div className="text-center py-12">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      Chat Not Available
                    </h3>
                    <p className="text-muted-foreground">
                      Live chat will be available during the match
                    </p>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
