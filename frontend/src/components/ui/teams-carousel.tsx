"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Team {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  league: string;
  position: number;
  points: number;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
}

const topTeams: Team[] = [
  {
    id: "1",
    name: "Manchester City",
    shortName: "MCI",
    logo: "https://example.com/mci.png",
    league: "Premier League",
    position: 1,
    points: 89,
    matches: 38,
    wins: 28,
    draws: 5,
    losses: 5,
  },
  {
    id: "2",
    name: "Arsenal",
    shortName: "ARS",
    logo: "https://example.com/ars.png",
    league: "Premier League",
    position: 2,
    points: 84,
    matches: 38,
    wins: 26,
    draws: 6,
    losses: 6,
  },
  {
    id: "3",
    name: "Manchester United",
    shortName: "MUN",
    logo: "https://example.com/mun.png",
    league: "Premier League",
    position: 3,
    points: 75,
    matches: 38,
    wins: 23,
    draws: 6,
    losses: 9,
  },
  {
    id: "4",
    name: "Liverpool",
    shortName: "LIV",
    logo: "https://example.com/liv.png",
    league: "Premier League",
    position: 4,
    points: 67,
    matches: 38,
    wins: 19,
    draws: 10,
    losses: 9,
  },
  {
    id: "5",
    name: "Real Madrid",
    shortName: "RMA",
    logo: "https://example.com/rma.png",
    league: "La Liga",
    position: 1,
    points: 78,
    matches: 38,
    wins: 24,
    draws: 6,
    losses: 8,
  },
  {
    id: "6",
    name: "Barcelona",
    shortName: "BAR",
    logo: "https://example.com/bar.png",
    league: "La Liga",
    position: 2,
    points: 88,
    matches: 38,
    wins: 28,
    draws: 4,
    losses: 6,
  },
];

export function TeamsCarousel() {
  return (
    <section className="py-12 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">Top Teams</h2>
          <p className="text-muted-foreground">
            Leading teams across major leagues
          </p>
        </motion.div>

        <div className="relative">
          {/* Scroll container */}
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {topTeams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0 w-80"
              >
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
                  <CardContent className="p-6">
                    {/* Team header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg",
                            team.position === 1
                              ? "bg-yellow-500"
                              : team.position === 2
                              ? "bg-gray-400"
                              : team.position === 3
                              ? "bg-amber-600"
                              : "bg-blue-500"
                          )}
                        >
                          {team.shortName}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {team.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {team.league}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={team.position <= 3 ? "default" : "secondary"}
                      >
                        #{team.position}
                      </Badge>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {team.points}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Points
                        </div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {team.wins}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Wins
                        </div>
                      </div>
                    </div>

                    {/* Record */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 font-medium">
                          {team.wins}W
                        </span>
                        <span className="text-yellow-600 font-medium">
                          {team.draws}D
                        </span>
                        <span className="text-red-600 font-medium">
                          {team.losses}L
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">
                          {team.matches} matches
                        </span>
                      </div>
                    </div>

                    {/* Hover effect indicator */}
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Click for details</span>
                        <Star className="h-3 w-3 group-hover:text-yellow-500 transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Scroll indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className="w-2 h-2 rounded-full bg-muted-foreground/30"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
