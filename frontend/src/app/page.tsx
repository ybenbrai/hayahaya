"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiClient } from "@/lib/api";
import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/ui/hero-section";
import { EnhancedGameCard } from "@/components/ui/enhanced-game-card";
import { TeamsCarousel } from "@/components/ui/teams-carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Clock,
  History,
  Trophy,
  Play,
  Calendar,
  Users,
  Eye,
} from "lucide-react";
import { Game } from "@/types";

export default function HomePage() {
  const { data: liveGames, isLoading: liveLoading } = useQuery({
    queryKey: ["live-games"],
    queryFn: () => {
      return apiClient.getLiveGames();
    },
    refetchInterval: 30000,
  });

  const { data: upcomingGames, isLoading: upcomingLoading } = useQuery({
    queryKey: ["upcoming-games"],
    queryFn: () => {
      return apiClient.getUpcomingGames();
    },
    refetchInterval: 60000,
  });

  // Mock past results for demonstration
  const pastResults: Game[] = [
    {
      id: "past-1",
      homeTeam: {
        id: "team-1",
        name: "Manchester United",
        shortName: "MUN",
        logo: "",
        primaryColor: "#DA291C",
      },
      awayTeam: {
        id: "team-2",
        name: "Liverpool",
        shortName: "LIV",
        logo: "",
        primaryColor: "#C8102E",
      },
      startTime: "2025-07-03T20:00:00",
      endTime: "2025-07-03T21:30:00",
      status: "finished",
      homeScore: 2,
      awayScore: 1,
      goals: [],
      venue: "Old Trafford",
      competition: "Premier League",
      currentMinute: 90,
      isHalfTime: false,
    },
    {
      id: "past-2",
      homeTeam: {
        id: "team-3",
        name: "Arsenal",
        shortName: "ARS",
        logo: "",
        primaryColor: "#EF0107",
      },
      awayTeam: {
        id: "team-4",
        name: "Chelsea",
        shortName: "CHE",
        logo: "",
        primaryColor: "#034694",
      },
      startTime: "2025-07-02T19:45:00",
      endTime: "2025-07-02T21:15:00",
      status: "finished",
      homeScore: 3,
      awayScore: 0,
      goals: [],
      venue: "Emirates Stadium",
      competition: "Premier League",
      currentMinute: 90,
      isHalfTime: false,
    },
  ];

  const featuredGame = liveGames?.[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <HeroSection featuredGame={featuredGame} />

      <main className="container mx-auto px-4 py-8">
        {/* Matches Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">All Matches</h2>
              <p className="text-muted-foreground">
                Live, upcoming, and past results
              </p>
            </div>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              View Calendar
            </Button>
          </div>

          <Tabs defaultValue="live" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
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
              <TabsTrigger value="past" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Past Results
                <Badge variant="outline" className="ml-2">
                  {pastResults.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="live" className="space-y-6">
              {liveLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-80 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : liveGames && liveGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <EnhancedGameCard game={game} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Live Matches</h3>
                  <p className="text-muted-foreground mb-4">
                    Check back later for live games
                  </p>
                  <Button>
                    <Eye className="mr-2 h-4 w-4" />
                    View Upcoming Matches
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="h-80 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : upcomingGames && upcomingGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingGames.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <EnhancedGameCard game={game} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No Upcoming Matches
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    No scheduled games at the moment
                  </p>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Check Schedule
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastResults.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <EnhancedGameCard game={game} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.section>

        {/* Teams Carousel */}
        <TeamsCarousel />

        {/* Quick Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm opacity-90">Active Teams</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg text-white">
              <Play className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm opacity-90">Matches This Season</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
              <Trophy className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm opacity-90">Leagues</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg text-white">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">2.1M</div>
              <div className="text-sm opacity-90">Total Viewers</div>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
