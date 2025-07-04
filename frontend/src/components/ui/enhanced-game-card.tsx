"use client";

import { motion } from "framer-motion";
import { Game } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  MapPin,
  Trophy,
  Play,
  Eye,
  Bell,
  Calendar,
  Users,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EnhancedGameCardProps {
  game: Game;
  className?: string;
}

export function EnhancedGameCard({ game, className }: EnhancedGameCardProps) {
  const isLive = game.status === "live";
  const isUpcoming = game.status === "scheduled";
  const isFinished = game.status === "finished";

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn("group", className)}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/20">
        {/* Header with status and competition */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-muted-foreground">
                {game.competition}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {isLive && (
                <Badge variant="destructive" className="animate-pulse">
                  <Play className="mr-1 h-3 w-3" />
                  LIVE
                </Badge>
              )}
              {isUpcoming && (
                <Badge variant="secondary">
                  <Calendar className="mr-1 h-3 w-3" />
                  UPCOMING
                </Badge>
              )}
              {isFinished && <Badge variant="outline">FINISHED</Badge>}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Teams section */}
          <div className="space-y-4 mb-6">
            {/* Home team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {game.homeTeam.shortName}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {game.homeTeam.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Home</span>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">
                {game.homeScore}
              </div>
            </div>

            {/* VS divider */}
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-border" />
              <div className="px-4 text-sm font-medium text-muted-foreground">
                {isLive ? `Minute ${game.currentMinute}` : "VS"}
              </div>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Away team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {game.awayTeam.shortName}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    {game.awayTeam.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Away</span>
                  </div>
                </div>
              </div>
              <div className="text-3xl font-bold text-primary">
                {game.awayScore}
              </div>
            </div>
          </div>

          {/* Match details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {isLive ? `Live` : formatTime(game.startTime)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{game.venue}</span>
              </div>
            </div>

            {isUpcoming && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(game.startTime)}</span>
              </div>
            )}

            {isLive && (
              <div className="flex items-center space-x-2 text-sm">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">
                  12.5K watching
                </span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {isLive ? (
              <Link href={`/game/${game.id}`} className="flex-1">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Live
                </Button>
              </Link>
            ) : isUpcoming ? (
              <>
                <Link href={`/game/${game.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Details
                  </Button>
                </Link>
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link href={`/game/${game.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
