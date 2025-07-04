"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Clock, MapPin, Users, Bell, Eye } from "lucide-react";
import { Game } from "@/types";
import Link from "next/link";

interface HeroSectionProps {
  featuredGame?: Game;
}

export function HeroSection({ featuredGame }: HeroSectionProps) {
  if (!featuredGame) {
    return (
      <section className="relative min-h-[500px] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Football Streaming
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Watch live matches and stay updated with real-time scores
            </p>
            <Button size="lg" className="text-lg px-8 py-6">
              <Play className="mr-2 h-5 w-5" />
              Explore Matches
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[500px] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

      <div className="relative container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <Badge variant="destructive" className="mb-4 animate-pulse">
              <Play className="mr-1 h-3 w-3" />
              LIVE NOW
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {featuredGame.homeTeam.name} vs {featuredGame.awayTeam.name}
            </h1>

            <p className="text-xl mb-8 text-blue-100">
              {featuredGame.competition} • {featuredGame.venue}
            </p>

            {/* Match info */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-300" />
                <span>Minute {featuredGame.currentMinute}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-300" />
                <span>{featuredGame.venue}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-300" />
                <span>12.5K watching</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href={`/game/${featuredGame.id}`}>
                <Button
                  size="lg"
                  className="text-lg px-8 py-6 bg-red-600 hover:bg-red-700"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Live
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10"
              >
                <Bell className="mr-2 h-5 w-5" />
                Set Reminder
              </Button>
            </div>
          </motion.div>

          {/* Right side - Featured game card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-8">
                {/* Live indicator */}
                <div className="flex items-center justify-between mb-6">
                  <Badge variant="destructive" className="animate-pulse">
                    LIVE
                  </Badge>
                  <div className="flex items-center space-x-2 text-sm">
                    <Eye className="h-4 w-4" />
                    <span>12.5K</span>
                  </div>
                </div>

                {/* Teams */}
                <div className="space-y-6">
                  {/* Home team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {featuredGame.homeTeam.shortName}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {featuredGame.homeTeam.name}
                        </h3>
                        <p className="text-sm text-blue-200">Home</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">
                      {featuredGame.homeScore}
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center text-sm text-blue-200">VS</div>

                  {/* Away team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {featuredGame.awayTeam.shortName}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {featuredGame.awayTeam.name}
                        </h3>
                        <p className="text-sm text-blue-200">Away</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold">
                      {featuredGame.awayScore}
                    </div>
                  </div>
                </div>

                {/* Match details */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-200">
                      Minute {featuredGame.currentMinute}
                    </span>
                    <span className="text-blue-200">
                      {featuredGame.competition}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
