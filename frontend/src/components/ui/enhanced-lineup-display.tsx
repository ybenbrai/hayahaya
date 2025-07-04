"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Crown,
} from "lucide-react";
import { EnhancedLineup, PlayerStats } from "@/types";
import { useState } from "react";

interface EnhancedLineupDisplayProps {
  lineup: EnhancedLineup;
  homeTeamName: string;
  awayTeamName: string;
}

export function EnhancedLineupDisplay({
  lineup,
  homeTeamName,
  awayTeamName,
}: EnhancedLineupDisplayProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(
    null
  );

  const getPositionColor = (position: string) => {
    switch (position) {
      case "GK":
        return "bg-purple-500";
      case "DEF":
        return "bg-blue-500";
      case "MID":
        return "bg-green-500";
      case "FWD":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPositionName = (position: string) => {
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

  const TeamLineup = ({
    team,
    teamName,
    isHome,
  }: {
    team: { starting: PlayerStats[]; substitutes: PlayerStats[]; coach: string; formation: string };
    teamName: string;
    isHome: boolean;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">{teamName}</h3>
            <p className="text-sm text-muted-foreground">
              Formation: {team.formation}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">Coach</p>
            <p className="text-sm text-muted-foreground">{team.coach}</p>
          </div>
        </div>

        {/* Starting XI */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Crown className="h-4 w-4 text-yellow-500" />
            <h4 className="font-semibold">Starting XI</h4>
            <Badge variant="outline">{team.starting.length} players</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {team.starting.map((player: PlayerStats, index: number) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 ${
                    isHome ? "border-l-blue-500" : "border-l-green-500"
                  }`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 ${getPositionColor(
                          player.position
                        )} rounded-full flex items-center justify-center text-white font-bold text-sm`}
                      >
                        {player.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">
                          {player.name}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {getPositionName(player.position)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">
                          {player.goals}
                        </div>
                        <div className="text-muted-foreground">Goals</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">
                          {player.assists}
                        </div>
                        <div className="text-muted-foreground">Assists</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-purple-600">
                          {player.rating.toFixed(1)}
                        </div>
                        <div className="text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Substitutes */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-4 w-4 text-gray-500" />
            <h4 className="font-semibold">Substitutes</h4>
            <Badge variant="outline">{team.substitutes.length} players</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {team.substitutes.map((player: PlayerStats, index: number) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: (index + team.starting.length) * 0.05,
                }}
              >
                <Card
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-l-4 border-l-gray-400 opacity-75`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 ${getPositionColor(
                          player.position
                        )} rounded-full flex items-center justify-center text-white font-bold text-xs`}
                      >
                        {player.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">
                          {player.name}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {getPositionName(player.position)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamLineup
          team={lineup.homeTeam}
          teamName={homeTeamName}
          isHome={true}
        />
        <TeamLineup
          team={lineup.awayTeam}
          teamName={awayTeamName}
          isHome={false}
        />
      </div>

      {/* Player Details Modal */}
      {selectedPlayer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPlayer(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div
                className={`w-16 h-16 ${getPositionColor(
                  selectedPlayer.position
                )} rounded-full flex items-center justify-center text-white font-bold text-xl`}
              >
                {selectedPlayer.number}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedPlayer.name}</h3>
                <p className="text-muted-foreground">
                  {getPositionName(selectedPlayer.position)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {selectedPlayer.goals}
                </div>
                <div className="text-sm text-muted-foreground">Goals</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {selectedPlayer.assists}
                </div>
                <div className="text-sm text-muted-foreground">Assists</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {selectedPlayer.rating.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {selectedPlayer.minutesPlayed}
                </div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Shots</span>
                <span className="font-medium">{selectedPlayer.shots}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Passes</span>
                <span className="font-medium">{selectedPlayer.passes}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Pass Accuracy
                </span>
                <span className="font-medium">
                  {selectedPlayer.passAccuracy.toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Yellow Cards
                </span>
                <span className="font-medium">
                  {selectedPlayer.yellowCards}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Red Cards</span>
                <span className="font-medium">{selectedPlayer.redCards}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPlayer(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
