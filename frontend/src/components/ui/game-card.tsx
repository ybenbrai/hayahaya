"use client";

import { Game } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game;
  onClick?: () => void;
  className?: string;
}

export function GameCard({ game, onClick, className }: GameCardProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = () => {
    switch (game.status) {
      case "live":
        return (
          <Badge variant="destructive" className="animate-pulse">
            LIVE
          </Badge>
        );
      case "scheduled":
        return <Badge variant="secondary">UPCOMING</Badge>;
      case "finished":
        return <Badge variant="outline">FINISHED</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>{game.competition}</span>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: game.homeTeam.primaryColor }}
              >
                {game.homeTeam.shortName}
              </div>
              <span className="font-semibold">{game.homeTeam.name}</span>
            </div>
            <span className="text-2xl font-bold">{game.homeScore}</span>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm text-muted-foreground">VS</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: game.awayTeam.primaryColor }}
              >
                {game.awayTeam.shortName}
              </div>
              <span className="font-semibold">{game.awayTeam.name}</span>
            </div>
            <span className="text-2xl font-bold">{game.awayScore}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(game.startTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{game.venue}</span>
            </div>
          </div>

          {game.status === "live" && game.currentMinute && (
            <div className="text-center">
              <Badge variant="outline">
                {game.isHalfTime ? "HT" : `${game.currentMinute}'`}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
