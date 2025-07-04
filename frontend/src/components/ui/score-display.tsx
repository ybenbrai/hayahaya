"use client";

import { Game } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface ScoreDisplayProps {
  game: Game;
  className?: string;
}

export function ScoreDisplay({ game, className }: ScoreDisplayProps) {
  return (
    <div className={`flex items-center justify-center space-x-8 ${className}`}>
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2"
          style={{ backgroundColor: game.homeTeam.primaryColor }}
        >
          {game.homeTeam.shortName}
        </div>
        <div className="font-semibold text-lg">{game.homeTeam.name}</div>
      </div>

      <div className="text-center">
        <div className="text-4xl font-bold mb-2">
          {game.homeScore} - {game.awayScore}
        </div>
        {game.status === "live" && (
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            <Badge variant="destructive" className="animate-pulse">
              {game.isHalfTime ? "HALF TIME" : `${game.currentMinute}'`}
            </Badge>
          </div>
        )}
      </div>

      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mb-2"
          style={{ backgroundColor: game.awayTeam.primaryColor }}
        >
          {game.awayTeam.shortName}
        </div>
        <div className="font-semibold text-lg">{game.awayTeam.name}</div>
      </div>
    </div>
  );
}
