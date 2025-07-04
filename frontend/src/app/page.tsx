"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { GameCard } from "@/components/ui/game-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  console.log("HomePage component rendering"); // DEBUG
  console.log("apiClient in HomePage:", apiClient); // DEBUG

  const {
    data: liveGames,
    isLoading: liveLoading,
    error: liveError,
  } = useQuery({
    queryKey: ["live-games"],
    queryFn: () => {
      console.log("queryFn called, apiClient:", apiClient); // DEBUG
      return apiClient.getLiveGames();
    },
    refetchInterval: 30000,
  });

  const {
    data: upcomingGames,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useQuery({
    queryKey: ["upcoming-games"],
    queryFn: () => {
      console.log("queryFn called for upcoming, apiClient:", apiClient); // DEBUG
      return apiClient.getUpcomingGames();
    },
    refetchInterval: 60000,
  });

  console.log("HomePage state:", {
    liveGames,
    liveLoading,
    liveError,
    upcomingGames,
    upcomingLoading,
    upcomingError,
  }); // DEBUG

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Football Streaming</h1>
          <p className="text-muted-foreground">
            Watch live matches and stay updated with real-time scores
          </p>
        </div>

        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Live Matches
              {liveGames && liveGames.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {liveGames.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Upcoming
              {upcomingGames && upcomingGames.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {upcomingGames.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Live Matches
              </h2>
            </div>

            {liveLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : liveGames && liveGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveGames.map((game) => (
                  <Link key={game.id} href={`/game/${game.id}`}>
                    <GameCard game={game} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Live Matches</h3>
                <p className="text-muted-foreground">
                  Check back later for live games
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Clock className="h-6 w-6" />
                Upcoming Matches
              </h2>
            </div>

            {upcomingLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-muted animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : upcomingGames && upcomingGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingGames.map((game) => (
                  <Link key={game.id} href={`/game/${game.id}`}>
                    <GameCard game={game} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Upcoming Matches
                </h3>
                <p className="text-muted-foreground">
                  No scheduled games at the moment
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
