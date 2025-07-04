"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, AlertTriangle, User, Clock, Zap, Award } from "lucide-react";
import { MatchEvent } from "@/types";

interface MatchEventsProps {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
}

export function MatchEvents({
  events,
  homeTeamName,
  awayTeamName,
}: MatchEventsProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <Target className="h-4 w-4 text-green-500" />;
      case "card":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "substitution":
        return <User className="h-4 w-4 text-blue-500" />;
      case "foul":
        return <Zap className="h-4 w-4 text-red-500" />;
      default:
        return <Award className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventColor = (type: string, cardType?: string) => {
    if (type === "goal")
      return "border-green-500 bg-green-50 dark:bg-green-950";
    if (type === "card") {
      return cardType === "red"
        ? "border-red-500 bg-red-50 dark:bg-red-950"
        : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
    }
    if (type === "substitution")
      return "border-blue-500 bg-blue-50 dark:bg-blue-950";
    return "border-gray-500 bg-gray-50 dark:bg-gray-950";
  };

  const getCardBadge = (cardType?: string) => {
    if (!cardType) return null;

    return (
      <Badge
        variant={cardType === "red" ? "destructive" : "secondary"}
        className={cardType === "yellow" ? "bg-yellow-500 text-white" : ""}
      >
        {cardType.toUpperCase()} CARD
      </Badge>
    );
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Events Yet</h3>
            <p>Match events will appear here as they happen</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Match Events</h3>
        <Badge variant="outline">{events.length} events</Badge>
      </div>

      <div className="space-y-3">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: event.isHomeTeam ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              className={`border-l-4 ${getEventColor(
                event.type,
                event.cardType
              )}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(event.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">
                          {event.minute}&apos;
                        </span>
                        <span className="text-sm font-semibold">
                          {event.isHomeTeam ? homeTeamName : awayTeamName}
                        </span>
                        {getCardBadge(event.cardType)}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {event.description}
                      </p>

                      {event.playerName && (
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{event.playerName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 text-xs text-muted-foreground">
                    {formatTime(event.timestamp)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Timeline connector */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        {events.map((event, index) => (
          <motion.div
            key={`timeline-${event.id}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
            className={`absolute left-5 w-3 h-3 rounded-full border-2 border-white ${
              event.type === "goal"
                ? "bg-green-500"
                : event.type === "card"
                ? event.cardType === "red"
                  ? "bg-red-500"
                  : "bg-yellow-500"
                : "bg-blue-500"
            }`}
            style={{ top: `${index * 100 + 50}px` }}
          />
        ))}
      </div>
    </div>
  );
}
