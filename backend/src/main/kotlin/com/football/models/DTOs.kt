package com.football.models

import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class Team(
    val id: String,
    val name: String,
    val shortName: String,
    val logo: String,
    val primaryColor: String
)

@Serializable
data class Player(
    val id: String,
    val name: String,
    val number: Int,
    val position: String,
    val teamId: String
)

@Serializable
data class Goal(
    val id: String,
    val playerId: String,
    val playerName: String,
    val minute: Int,
    val teamId: String,
    val isOwnGoal: Boolean
)

@Serializable
data class Game(
    val id: String,
    val homeTeam: Team,
    val awayTeam: Team,
    val startTime: String,
    val endTime: String,
    val status: String,
    val homeScore: Int,
    val awayScore: Int,
    val goals: List<Goal>,
    val venue: String,
    val competition: String,
    val currentMinute: Int? = null,
    val isHalfTime: Boolean = false
)

@Serializable
enum class GameStatus {
    SCHEDULED, LIVE, FINISHED
}

@Serializable
data class Lineup(
    val homeTeam: TeamLineup,
    val awayTeam: TeamLineup
)

@Serializable
data class TeamLineup(
    val starting: List<Player>,
    val substitutes: List<Player>,
    val coach: String
)

@Serializable
data class ChatMessage(
    val id: String,
    val userId: String,
    val username: String,
    val message: String,
    val timestamp: String,
    val gameId: String
)

@Serializable
data class LiveScoreUpdate(
    val gameId: String,
    val homeScore: Int,
    val awayScore: Int,
    val currentMinute: Int,
    val goals: List<Goal>,
    val isHalfTime: Boolean
)

@Serializable
data class ChatMessageRequest(
    val message: String,
    val userId: String
)

@Serializable
data class WebSocketMessage(
    val type: String,
    val payload: String
)

@Serializable
data class PlayerStats(
    val id: String,
    val name: String,
    val number: Int,
    val position: String,
    val teamId: String,
    val photo: String,
    val goals: Int = 0,
    val assists: Int = 0,
    val rating: Double = 0.0,
    val minutesPlayed: Int = 0,
    val yellowCards: Int = 0,
    val redCards: Int = 0,
    val shots: Int = 0,
    val passes: Int = 0,
    val passAccuracy: Double = 0.0
)

@Serializable
data class MatchEvent(
    val id: String,
    val type: String, // "goal", "card", "substitution", "foul", "corner", "free_kick"
    val minute: Int,
    val playerId: String?,
    val playerName: String?,
    val teamId: String,
    val description: String,
    val cardType: String? = null, // "yellow", "red"
    val isHomeTeam: Boolean,
    val timestamp: String
)

@Serializable
data class StreamInfo(
    val id: String,
    val url: String,
    val type: String, // "hls", "youtube", "rtmp"
    val quality: String, // "hd", "sd", "4k"
    val language: String,
    val isLive: Boolean,
    val fallbackImage: String
)

@Serializable
data class FieldPosition(
    val x: Double, // 0-100 percentage
    val y: Double, // 0-100 percentage
    val playerId: String,
    val isBall: Boolean = false
)

@Serializable
data class EnhancedGame(
    val id: String,
    val homeTeam: Team,
    val awayTeam: Team,
    val startTime: String,
    val endTime: String,
    val status: String,
    val homeScore: Int,
    val awayScore: Int,
    val goals: List<Goal>,
    val venue: String,
    val competition: String,
    val currentMinute: Int? = null,
    val isHalfTime: Boolean = false,
    val events: List<MatchEvent> = emptyList(),
    val streams: List<StreamInfo> = emptyList(),
    val homeTeamStats: TeamStats = TeamStats(),
    val awayTeamStats: TeamStats = TeamStats(),
    val fieldPositions: List<FieldPosition> = emptyList(),
    val attendance: Int? = null,
    val weather: String? = null,
    val referee: String? = null
)

@Serializable
data class TeamStats(
    val possession: Double = 0.0,
    val shots: Int = 0,
    val shotsOnTarget: Int = 0,
    val corners: Int = 0,
    val fouls: Int = 0,
    val yellowCards: Int = 0,
    val redCards: Int = 0,
    val offsides: Int = 0,
    val passes: Int = 0,
    val passAccuracy: Double = 0.0
)

@Serializable
data class EnhancedLineup(
    val homeTeam: EnhancedTeamLineup,
    val awayTeam: EnhancedTeamLineup
)

@Serializable
data class EnhancedTeamLineup(
    val starting: List<PlayerStats>,
    val substitutes: List<PlayerStats>,
    val coach: String,
    val formation: String = "4-4-2"
) 