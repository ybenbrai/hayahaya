"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock,
  MapPin,
  Users,
  Calendar,
  Trophy,
  Cloud,
  User,
} from "lucide-react";
import { EnhancedGame } from "@/types";

interface MatchHeaderProps {
  game: EnhancedGame;
}

export function MatchHeader({ game }: MatchHeaderProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (
    status: string
  ): "destructive" | "secondary" | "default" => {
    switch (status) {
      case "live":
        return "destructive";
      case "finished":
        return "secondary";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "LIVE";
      case "finished":
        return "FINISHED";
      case "scheduled":
        return "UPCOMING";
      default:
        return status.toUpperCase();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Competition and Match Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>{game.competition}</span>
          </div>
          {game.weather && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Cloud className="h-4 w-4" />
              <span>{game.weather}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {game.attendance && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{game.attendance.toLocaleString()}</span>
            </div>
          )}
          {game.referee && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{game.referee}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Match Display */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-2">
        <CardContent className="p-8">
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Home Team */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                {game.homeTeam.shortName}
              </div>
              <h2 className="text-xl font-bold mb-2">{game.homeTeam.name}</h2>
              <div className="text-3xl font-bold text-blue-600">
                {game.homeScore}
              </div>
            </motion.div>

            {/* Score and Status */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center space-y-4"
            >
              <div className="text-6xl font-bold text-gray-800 dark:text-gray-200">
                {game.homeScore} - {game.awayScore}
              </div>

              <div className="space-y-2">
                <Badge
                  variant={getStatusColor(game.status)}
                  className={`text-lg px-4 py-2 ${
                    game.status === "live" ? "animate-pulse" : ""
                  }`}
                >
                  {getStatusText(game.status)}
                </Badge>

                {game.status === "live" && game.currentMinute && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-2xl font-bold text-red-600"
                  >
                    {game.currentMinute}&apos;
                  </motion.div>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                {formatDate(game.startTime)}
              </div>
            </motion.div>

            {/* Away Team */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold text-2xl">
                {game.awayTeam.shortName}
              </div>
              <h2 className="text-xl font-bold mb-2">{game.awayTeam.name}</h2>
              <div className="text-3xl font-bold text-green-600">
                {game.awayScore}
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Match Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg"
        >
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">Venue</div>
            <div className="text-sm text-muted-foreground">{game.venue}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg"
        >
          <Clock className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">Kickoff</div>
            <div className="text-sm text-muted-foreground">
              {formatTime(game.startTime)}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg"
        >
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <div>
            <div className="font-medium">Date</div>
            <div className="text-sm text-muted-foreground">
              {formatDate(game.startTime).replace("'", "&apos;")}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
