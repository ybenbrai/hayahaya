"use client";

import { Lineup, Player } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User } from "lucide-react";

interface LineupProps {
  lineup: Lineup;
  homeTeamName: string;
  awayTeamName: string;
  className?: string;
}

export function LineupDisplay({
  lineup,
  homeTeamName,
  awayTeamName,
  className,
}: LineupProps) {
  const PlayerCard = ({
    player,
    isSubstitute = false,
  }: {
    player: Player;
    isSubstitute?: boolean;
  }) => (
    <div
      className={`flex items-center gap-2 p-2 rounded-lg ${
        isSubstitute ? "bg-muted/50" : "bg-muted"
      }`}
    >
      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
        {player.number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{player.name}</div>
        <div className="text-xs text-muted-foreground">{player.position}</div>
      </div>
    </div>
  );

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {homeTeamName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Coach:</span>
              <span>{lineup.homeTeam.coach}</span>
            </div>
          </div>

          <div>
            <Badge variant="outline" className="mb-2">
              Starting XI
            </Badge>
            <div className="space-y-2">
              {lineup.homeTeam.starting.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>

          <div>
            <Badge variant="secondary" className="mb-2">
              Substitutes
            </Badge>
            <div className="space-y-2">
              {lineup.homeTeam.substitutes.map((player) => (
                <PlayerCard key={player.id} player={player} isSubstitute />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {awayTeamName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              <span className="font-medium">Coach:</span>
              <span>{lineup.awayTeam.coach}</span>
            </div>
          </div>

          <div>
            <Badge variant="outline" className="mb-2">
              Starting XI
            </Badge>
            <div className="space-y-2">
              {lineup.awayTeam.starting.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>

          <div>
            <Badge variant="secondary" className="mb-2">
              Substitutes
            </Badge>
            <div className="space-y-2">
              {lineup.awayTeam.substitutes.map((player) => (
                <PlayerCard key={player.id} player={player} isSubstitute />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
