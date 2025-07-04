"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

import {
  Target,
  Zap,
  AlertTriangle,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import { TeamStats } from "@/types";

interface MatchStatsProps {
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  homeTeamName: string;
  awayTeamName: string;
}

export function MatchStats({
  homeTeamStats,
  awayTeamStats,
  homeTeamName,
  awayTeamName,
}: MatchStatsProps) {
  const stats = [
    {
      label: "Possession",
      home: homeTeamStats.possession,
      away: awayTeamStats.possession,
      icon: <TrendingUp className="h-4 w-4" />,
      format: (value: number) => `${value.toFixed(1)}%`,
      color: "bg-blue-500",
    },
    {
      label: "Shots",
      home: homeTeamStats.shots,
      away: awayTeamStats.shots,
      icon: <Target className="h-4 w-4" />,
      format: (value: number) => value.toString(),
      color: "bg-green-500",
    },
    {
      label: "Shots on Target",
      home: homeTeamStats.shotsOnTarget,
      away: awayTeamStats.shotsOnTarget,
      icon: <Target className="h-4 w-4" />,
      format: (value: number) => value.toString(),
      color: "bg-red-500",
    },
    {
      label: "Corners",
      home: homeTeamStats.corners,
      away: awayTeamStats.corners,
      icon: <Target className="h-4 w-4" />,
      format: (value: number) => value.toString(),
      color: "bg-yellow-500",
    },
    {
      label: "Fouls",
      home: homeTeamStats.fouls,
      away: awayTeamStats.fouls,
      icon: <AlertTriangle className="h-4 w-4" />,
      format: (value: number) => value.toString(),
      color: "bg-orange-500",
    },
    {
      label: "Yellow Cards",
      home: homeTeamStats.yellowCards,
      away: awayTeamStats.yellowCards,
      icon: <AlertTriangle className="h-4 w-4" />,
      format: (value: number) => value.toString(),
      color: "bg-yellow-500",
    },
    {
      label: "Red Cards",
      home: homeTeamStats.redCards,
      away: awayTeamStats.redCards,
      icon: <AlertTriangle className="h-4 w-4" />,
      format: (value: number) => value.toString(),
      color: "bg-red-500",
    },
    {
      label: "Offsides",
      home: homeTeamStats.offsides,
      away: awayTeamStats.offsides,
      icon: <Users className="h-4 w-4" />,
      format: (value: number) => value.toString(),
      color: "bg-purple-500",
    },
    {
      label: "Passes",
      home: homeTeamStats.passes,
      away: awayTeamStats.passes,
      icon: <Zap className="h-4 w-4" />,
      format: (value: number) => value.toString(),
      color: "bg-blue-500",
    },
    {
      label: "Pass Accuracy",
      home: homeTeamStats.passAccuracy,
      away: awayTeamStats.passAccuracy,
      icon: <Award className="h-4 w-4" />,
      format: (value: number) => `${value.toFixed(1)}%`,
      color: "bg-green-500",
    },
  ];

  const getMaxValue = (home: number, away: number) => {
    return Math.max(home, away, 1);
  };

  return (
    <div className="space-y-6">
      {/* Possession Chart */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Possession</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1 text-right">
              <div className="font-medium text-sm">{homeTeamName}</div>
              <div className="text-2xl font-bold text-blue-600">
                {homeTeamStats.possession.toFixed(1)}%
              </div>
            </div>

            <div className="flex-1 relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${homeTeamStats.possession}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>

            <div className="flex-1">
              <div className="font-medium text-sm">{awayTeamName}</div>
              <div className="text-2xl font-bold text-green-600">
                {awayTeamStats.possession.toFixed(1)}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats.slice(1).map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`p-1 rounded ${stat.color} text-white`}>
                    {stat.icon}
                  </div>
                  <h4 className="font-medium">{stat.label}</h4>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-1 text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {stat.format(stat.home)}
                    </div>
                  </div>

                  <div className="flex-1 relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (stat.home / getMaxValue(stat.home, stat.away)) * 100
                        }%`,
                      }}
                      transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                      className={`h-full ${stat.color} rounded-full`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="text-lg font-bold text-green-600">
                      {stat.format(stat.away)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {homeTeamStats.shots + awayTeamStats.shots}
              </div>
              <div className="text-sm text-muted-foreground">Total Shots</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {homeTeamStats.yellowCards + awayTeamStats.yellowCards}
              </div>
              <div className="text-sm text-muted-foreground">Yellow Cards</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {homeTeamStats.redCards + awayTeamStats.redCards}
              </div>
              <div className="text-sm text-muted-foreground">Red Cards</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
