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