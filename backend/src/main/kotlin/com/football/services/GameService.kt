package com.football.services

import com.football.models.*
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.util.*
import kotlin.random.Random
import com.football.services.MatchDto

class GameService(private val footballDataApi: FootballDataApi? = null) {
    private val games = mutableMapOf<String, Game>()
    private val lineups = mutableMapOf<String, Lineup>()
    private val chatMessages = mutableMapOf<String, MutableList<ChatMessage>>()
    private val gameUpdates = MutableStateFlow<Map<String, LiveScoreUpdate>>(emptyMap())
    
    private val scope = CoroutineScope(Dispatchers.Default + SupervisorJob())
    private val updateJobs = mutableMapOf<String, Job>()

    private val fallbackGames = mutableListOf<Game>()

    init {
        initializeMockData()
        initializeFallbackData()
        startLiveGameSimulation()
    }

    private fun initializeMockData() {
        val teams = listOf(
            Team("team-1", "Manchester United", "MUN", "https://example.com/mun.png", "#DA291C"),
            Team("team-2", "Liverpool", "LIV", "https://example.com/liv.png", "#C8102E"),
            Team("team-3", "Arsenal", "ARS", "https://example.com/ars.png", "#EF0107"),
            Team("team-4", "Chelsea", "CHE", "https://example.com/che.png", "#034694"),
            Team("team-5", "Manchester City", "MCI", "https://example.com/mci.png", "#6CABDD"),
            Team("team-6", "Tottenham", "TOT", "https://example.com/tot.png", "#132257"),
            Team("team-7", "Barcelona", "BAR", "https://example.com/bar.png", "#A50044"),
            Team("team-8", "Real Madrid", "RMA", "https://example.com/rma.png", "#FFFFFF"),
            Team("team-9", "Bayern Munich", "BAY", "https://example.com/bay.png", "#DC052D"),
            Team("team-10", "PSG", "PSG", "https://example.com/psg.png", "#004170")
        )

        val players = mutableListOf<Player>()
        teams.forEach { team ->
            for (i in 1..20) {
                players.add(
                    Player(
                        id = "player-${team.id}-$i",
                        name = "Player $i",
                        number = i,
                        position = when {
                            i == 1 -> "GK"
                            i <= 4 -> "DEF"
                            i <= 8 -> "MID"
                            else -> "FWD"
                        },
                        teamId = team.id
                    )
                )
            }
        }

        val now = LocalDateTime.now()
        val formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

        // Live games
        for (i in 1..5) {
            val gameId = "live-game-$i"
            val homeTeam = teams[i - 1]
            val awayTeam = teams[i + 4]
            val startTime = now.minusMinutes(Random.nextInt(30, 90).toLong())
            
            val game = Game(
                id = gameId,
                homeTeam = homeTeam,
                awayTeam = awayTeam,
                startTime = startTime.format(formatter),
                endTime = startTime.plusMinutes(90).format(formatter),
                status = "live",
                homeScore = Random.nextInt(0, 3),
                awayScore = Random.nextInt(0, 3),
                goals = generateGoals(homeTeam, awayTeam),
                venue = "Stadium ${i}",
                competition = "Premier League",
                currentMinute = Random.nextInt(15, 75),
                isHalfTime = false
            )
            
            games[gameId] = game
            lineups[gameId] = generateLineup(homeTeam, awayTeam, players)
            chatMessages[gameId] = generateChatMessages(gameId)
            
            startGameSimulation(gameId)
        }

        // Upcoming games
        for (i in 1..5) {
            val gameId = "upcoming-game-$i"
            val homeTeam = teams[(i + 2) % teams.size]
            val awayTeam = teams[(i + 7) % teams.size]
            val startTime = now.plusHours(Random.nextInt(1, 24).toLong())
            
            val game = Game(
                id = gameId,
                homeTeam = homeTeam,
                awayTeam = awayTeam,
                startTime = startTime.format(formatter),
                endTime = startTime.plusMinutes(90).format(formatter),
                status = "scheduled",
                homeScore = 0,
                awayScore = 0,
                goals = emptyList(),
                venue = "Stadium ${i + 5}",
                competition = "Champions League"
            )
            
            games[gameId] = game
            lineups[gameId] = generateLineup(homeTeam, awayTeam, players)
            chatMessages[gameId] = mutableListOf()
        }
    }

    private fun initializeFallbackData() {
        val teams = listOf(
            Team("team-1", "Manchester United", "MUN", "https://example.com/mun.png", "#DA291C"),
            Team("team-2", "Liverpool", "LIV", "https://example.com/liv.png", "#C8102E"),
            Team("team-3", "Arsenal", "ARS", "https://example.com/ars.png", "#EF0107"),
            Team("team-4", "Chelsea", "CHE", "https://example.com/che.png", "#034694"),
            Team("team-5", "Manchester City", "MCI", "https://example.com/mci.png", "#6CABDD"),
            Team("team-6", "Tottenham", "TOT", "https://example.com/tot.png", "#132257"),
            Team("team-7", "Barcelona", "BAR", "https://example.com/bar.png", "#A50044"),
            Team("team-8", "Real Madrid", "RMA", "https://example.com/rma.png", "#FFFFFF"),
            Team("team-9", "Bayern Munich", "BAY", "https://example.com/bay.png", "#DC052D"),
            Team("team-10", "PSG", "PSG", "https://example.com/psg.png", "#004170")
        )

        val now = LocalDateTime.now()
        val formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME

        // Live games (fallback)
        for (i in 1..3) {
            val gameId = "live-game-$i"
            val homeTeam = teams[i - 1]
            val awayTeam = teams[i + 4]
            val startTime = now.minusMinutes(Random.nextInt(30, 90).toLong())
            
            val game = Game(
                id = gameId,
                homeTeam = homeTeam,
                awayTeam = awayTeam,
                startTime = startTime.format(formatter),
                endTime = startTime.plusMinutes(90).format(formatter),
                status = "live",
                homeScore = Random.nextInt(0, 3),
                awayScore = Random.nextInt(0, 3),
                goals = emptyList(),
                venue = "Stadium ${i}",
                competition = "Premier League",
                currentMinute = Random.nextInt(15, 75),
                isHalfTime = false
            )
            
            fallbackGames.add(game)
        }

        // Upcoming games (fallback)
        for (i in 1..5) {
            val gameId = "upcoming-game-$i"
            val homeTeam = teams[(i + 2) % teams.size]
            val awayTeam = teams[(i + 7) % teams.size]
            val startTime = now.plusHours(Random.nextInt(1, 24).toLong())
            
            val game = Game(
                id = gameId,
                homeTeam = homeTeam,
                awayTeam = awayTeam,
                startTime = startTime.format(formatter),
                endTime = startTime.plusMinutes(90).format(formatter),
                status = "scheduled",
                homeScore = 0,
                awayScore = 0,
                goals = emptyList(),
                venue = "Stadium ${i + 5}",
                competition = "Champions League"
            )
            
            fallbackGames.add(game)
        }
    }

    private fun generateGoals(homeTeam: Team, awayTeam: Team): List<Goal> {
        val goals = mutableListOf<Goal>()
        val homeScore = Random.nextInt(0, 3)
        val awayScore = Random.nextInt(0, 3)
        
        for (i in 0 until homeScore) {
            goals.add(
                Goal(
                    id = "goal-${homeTeam.id}-$i",
                    playerId = "player-${homeTeam.id}-${Random.nextInt(9, 20)}",
                    playerName = "Home Player ${i + 1}",
                    minute = Random.nextInt(1, 45),
                    teamId = homeTeam.id,
                    isOwnGoal = false
                )
            )
        }
        
        for (i in 0 until awayScore) {
            goals.add(
                Goal(
                    id = "goal-${awayTeam.id}-$i",
                    playerId = "player-${awayTeam.id}-${Random.nextInt(9, 20)}",
                    playerName = "Away Player ${i + 1}",
                    minute = Random.nextInt(1, 45),
                    teamId = awayTeam.id,
                    isOwnGoal = false
                )
            )
        }
        
        return goals.sortedBy { it.minute }
    }

    private fun generateLineup(homeTeam: Team, awayTeam: Team, allPlayers: List<Player>): Lineup {
        val homePlayers = allPlayers.filter { it.teamId == homeTeam.id }
        val awayPlayers = allPlayers.filter { it.teamId == awayTeam.id }
        
        return Lineup(
            homeTeam = TeamLineup(
                starting = homePlayers.take(11),
                substitutes = homePlayers.drop(11).take(7),
                coach = "Coach ${homeTeam.name}"
            ),
            awayTeam = TeamLineup(
                starting = awayPlayers.take(11),
                substitutes = awayPlayers.drop(11).take(7),
                coach = "Coach ${awayTeam.name}"
            )
        )
    }

    private fun generateChatMessages(gameId: String): MutableList<ChatMessage> {
        val messages = mutableListOf<ChatMessage>()
        val usernames = listOf("FootballFan", "SoccerLover", "MatchWatcher", "GoalHunter", "TeamSupporter")
        
        for (i in 1..10) {
            messages.add(
                ChatMessage(
                    id = "msg-$gameId-$i",
                    userId = "user-$i",
                    username = usernames[i % usernames.size],
                    message = "Great match so far! ${if (i % 2 == 0) "Come on!" else "Amazing play!"}",
                    timestamp = LocalDateTime.now().minusMinutes(Random.nextInt(1, 30).toLong()).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                    gameId = gameId
                )
            )
        }
        
        return messages
    }

    private fun startLiveGameSimulation() {
        // This method is called from init but doesn't need to do anything specific
        // The individual game simulations are started in initializeMockData()
    }

    private fun startGameSimulation(gameId: String) {
        val job = scope.launch {
            while (isActive) {
                delay(30000) // Update every 30 seconds
                updateGame(gameId)
            }
        }
        updateJobs[gameId] = job
    }

    private fun updateGame(gameId: String) {
        val game = games[gameId] ?: return
        
        if (game.status != "live") return
        
        val currentMinute = (game.currentMinute ?: 0) + 1
        var homeScore = game.homeScore
        var awayScore = game.awayScore
        val goals = game.goals.toMutableList()
        
        // Simulate goals
        if (Random.nextDouble() < 0.1) { // 10% chance of goal
            val isHomeGoal = Random.nextBoolean()
            val team = if (isHomeGoal) game.homeTeam else game.awayTeam
            
            goals.add(
                Goal(
                    id = "goal-${team.id}-${System.currentTimeMillis()}",
                    playerId = "player-${team.id}-${Random.nextInt(9, 20)}",
                    playerName = "${team.name} Player",
                    minute = currentMinute,
                    teamId = team.id,
                    isOwnGoal = false
                )
            )
            
            if (isHomeGoal) homeScore++ else awayScore++
        }
        
        val updatedGame = game.copy(
            homeScore = homeScore,
            awayScore = awayScore,
            goals = goals,
            currentMinute = currentMinute,
            isHalfTime = currentMinute == 45,
            status = if (currentMinute >= 90) "finished" else "live"
        )
        
        games[gameId] = updatedGame
        
        val update = LiveScoreUpdate(
            gameId = gameId,
            homeScore = homeScore,
            awayScore = awayScore,
            currentMinute = currentMinute,
            goals = goals,
            isHalfTime = currentMinute == 45
        )
        
        gameUpdates.value = gameUpdates.value + (gameId to update)
        
        if (currentMinute >= 90) {
            updateJobs[gameId]?.cancel()
            updateJobs.remove(gameId)
        }
    }

    suspend fun getLiveGames(): List<Game> {
        footballDataApi?.let { api ->
            try {
                val matches = api.getLiveMatches().filter { it.status == "IN_PLAY" || it.status == "PAUSED" }
                if (matches.isNotEmpty()) {
                    return matches.map { matchDtoToGame(it) }
                }
            } catch (e: Exception) {
                println("API Error: ${e.message}")
            }
        }
        // Fallback to mock data
        return fallbackGames.filter { it.status == "live" }
    }

    suspend fun getUpcomingGames(): List<Game> {
        footballDataApi?.let { api ->
            try {
                val matches = api.getUpcomingMatches()
                if (matches.isNotEmpty()) {
                    return matches.map { matchDtoToGame(it) }
                }
            } catch (e: Exception) {
                println("API Error: ${e.message}")
            }
        }
        // Fallback to mock data
        return fallbackGames.filter { it.status == "scheduled" }
    }

    suspend fun getGame(id: String): Game? {
        footballDataApi?.let { api ->
            try {
                val match = api.getMatch(id)
                return match?.let { matchDtoToGame(it) }
            } catch (e: Exception) {
                println("API Error: ${e.message}")
            }
        }
        // Fallback to mock data
        return fallbackGames.find { it.id == id }
    }

    private fun matchDtoToGame(dto: MatchDto): Game {
        return Game(
            id = dto.id.toString(),
            homeTeam = Team(
                id = dto.homeTeam.id.toString(),
                name = dto.homeTeam.name,
                shortName = dto.homeTeam.shortName ?: dto.homeTeam.name.take(3).uppercase(),
                logo = "", // Football-Data.org does not provide logos on free tier
                primaryColor = "#222"
            ),
            awayTeam = Team(
                id = dto.awayTeam.id.toString(),
                name = dto.awayTeam.name,
                shortName = dto.awayTeam.shortName ?: dto.awayTeam.name.take(3).uppercase(),
                logo = "",
                primaryColor = "#222"
            ),
            startTime = dto.utcDate,
            endTime = dto.utcDate, // Not available
            status = when (dto.status) {
                "IN_PLAY", "PAUSED" -> "live"
                "SCHEDULED" -> "scheduled"
                "FINISHED" -> "finished"
                else -> "scheduled"
            },
            homeScore = dto.score.fullTime?.home ?: 0,
            awayScore = dto.score.fullTime?.away ?: 0,
            goals = emptyList(), // Not available on free tier
            venue = dto.venue ?: "",
            competition = dto.competition.name,
            currentMinute = null,
            isHalfTime = false
        )
    }

    fun getLineup(gameId: String): Lineup? {
        return lineups[gameId]
    }

    fun getChatMessages(gameId: String): List<ChatMessage> {
        return chatMessages[gameId] ?: emptyList()
    }

    fun addChatMessage(gameId: String, message: String, userId: String): ChatMessage {
        val chatMessage = ChatMessage(
            id = "msg-$gameId-${System.currentTimeMillis()}",
            userId = userId,
            username = "User $userId",
            message = message,
            timestamp = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
            gameId = gameId
        )
        
        chatMessages.getOrPut(gameId) { mutableListOf() }.add(chatMessage)
        return chatMessage
    }

    fun getGameUpdates(): StateFlow<Map<String, LiveScoreUpdate>> {
        return gameUpdates.asStateFlow()
    }

    fun getLiveScore(gameId: String): LiveScoreUpdate? {
        val game = games[gameId] ?: return null
        if (game.status != "live") return null
        
        return LiveScoreUpdate(
            gameId = gameId,
            homeScore = game.homeScore,
            awayScore = game.awayScore,
            currentMinute = game.currentMinute ?: 0,
            goals = game.goals,
            isHalfTime = game.isHalfTime
        )
    }
} 