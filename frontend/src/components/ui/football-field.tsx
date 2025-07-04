"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Zap, TrendingUp, Award } from "lucide-react";
import { FieldPosition, PlayerStats, EnhancedLineup } from "@/types";
import { useState } from "react";

interface FootballFieldProps {
  fieldPositions: FieldPosition[];
  lineup: EnhancedLineup;
  homeTeamName: string;
  awayTeamName: string;
}

export function FootballField({
  fieldPositions,
  lineup,
  homeTeamName,
  awayTeamName,
}: FootballFieldProps) {
  const [hoveredPlayer, setHoveredPlayer] = useState<PlayerStats | null>(null);

  const getPlayerStats = (playerId: string): PlayerStats | null => {
    const allPlayers = [
      ...lineup.homeTeam.starting,
      ...lineup.homeTeam.substitutes,
      ...lineup.awayTeam.starting,
      ...lineup.awayTeam.substitutes,
    ];
    return allPlayers.find((p) => p.id === playerId) || null;
  };

  const getPlayerColor = (playerId: string) => {
    const player = getPlayerStats(playerId);
    if (!player) return "bg-gray-400";

    const isHomeTeam =
      lineup.homeTeam.starting.some((p) => p.id === playerId) ||
      lineup.homeTeam.substitutes.some((p) => p.id === playerId);

    return isHomeTeam ? "bg-blue-500" : "bg-green-500";
  };

  const getPlayerPosition = (position: string) => {
    switch (position) {
      case "GK":
        return "Goalkeeper";
      case "DEF":
        return "Defender";
      case "MID":
        return "Midfielder";
      case "FWD":
        return "Forward";
      default:
        return position;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="relative w-full h-96 bg-gradient-to-b from-green-400 to-green-600 rounded-lg border-4 border-white shadow-lg">
          {/* Field markings */}
          <div className="absolute inset-0">
            {/* Center circle */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

            {/* Center line */}
            <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white transform -translate-x-1/2"></div>

            {/* Penalty areas */}
            <div className="absolute top-4 left-4 w-32 h-48 border-2 border-white rounded-lg"></div>
            <div className="absolute bottom-4 right-4 w-32 h-48 border-2 border-white rounded-lg"></div>

            {/* Goal areas */}
            <div className="absolute top-8 left-6 w-24 h-32 border-2 border-white rounded-lg"></div>
            <div className="absolute bottom-8 right-6 w-24 h-32 border-2 border-white rounded-lg"></div>

            {/* Corner arcs */}
            <div className="absolute top-2 left-2 w-4 h-4 border-2 border-white rounded-full"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-2 border-white rounded-full"></div>
          </div>

          {/* Team names */}
          <div className="absolute top-2 left-2 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded">
            {homeTeamName}
          </div>
          <div className="absolute top-2 right-2 text-white font-bold text-sm bg-black/50 px-2 py-1 rounded">
            {awayTeamName}
          </div>

          {/* Players and ball */}
          {fieldPositions.map((position, index) => {
            const player = getPlayerStats(position.playerId);

            return (
              <motion.div
                key={position.playerId}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                  position.isBall ? "z-20" : "z-10"
                }`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
                onMouseEnter={() => setHoveredPlayer(player)}
                onMouseLeave={() => setHoveredPlayer(null)}
              >
                {position.isBall ? (
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-6 h-6 bg-white rounded-full border-2 border-black shadow-lg flex items-center justify-center"
                  >
                    <div className="w-4 h-4 bg-black rounded-full"></div>
                  </motion.div>
                ) : (
                  <div
                    className={`w-8 h-8 ${getPlayerColor(
                      position.playerId
                    )} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold relative group`}
                  >
                    {player?.number || "?"}

                    {/* Player name tooltip */}
                    {player && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                        {player.name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Player stats tooltip */}
          {hoveredPlayer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute z-30 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 min-w-64"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
                    <img
                      src={hoveredPlayer.photo}
                      alt={hoveredPlayer.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          hoveredPlayer.name
                        )}&background=3b82f6&color=fff&size=48`;
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{hoveredPlayer.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {getPlayerPosition(hoveredPlayer.position)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-red-500" />
                    <span>Goals: {hoveredPlayer.goals}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span>Assists: {hoveredPlayer.assists}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Rating: {hoveredPlayer.rating.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Minutes: {hoveredPlayer.minutesPlayed}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {hoveredPlayer.yellowCards > 0 && (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-500 text-white"
                    >
                      {hoveredPlayer.yellowCards} Yellow
                    </Badge>
                  )}
                  {hoveredPlayer.redCards > 0 && (
                    <Badge variant="destructive">
                      {hoveredPlayer.redCards} Red
                    </Badge>
                  )}
                </div>

                <div className="text-xs text-muted-foreground">
                  <div>Shots: {hoveredPlayer.shots}</div>
                  <div>
                    Passes: {hoveredPlayer.passes} (
                    {hoveredPlayer.passAccuracy.toFixed(0)}%)
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Formation info */}
        <div className="mt-4 flex justify-between text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Home Formation:</span>{" "}
            {lineup.homeTeam.formation}
          </div>
          <div>
            <span className="font-medium">Away Formation:</span>{" "}
            {lineup.awayTeam.formation}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
