package com.football.services

import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json

class FootballDataApi(private val apiKey: String) {
    private val client = HttpClient(CIO) {
        install(ContentNegotiation) {
            json(Json { ignoreUnknownKeys = true })
        }
    }
    private val baseUrl = "https://api.football-data.org/v4"

    suspend fun getLiveMatches(): List<MatchDto> {
        // Football-Data.org does not provide true live scores on free tier, so we fetch scheduled and in-play
        val response: MatchesResponse = client.get("$baseUrl/matches") {
            headers { append("X-Auth-Token", apiKey) }
        }.body()
        return response.matches
    }

    suspend fun getUpcomingMatches(): List<MatchDto> {
        val response: MatchesResponse = client.get("$baseUrl/matches?status=SCHEDULED") {
            headers { append("X-Auth-Token", apiKey) }
        }.body()
        return response.matches
    }

    suspend fun getMatch(id: String): MatchDto? {
        return try {
            client.get("$baseUrl/matches/$id") {
                headers { append("X-Auth-Token", apiKey) }
            }.body<MatchDetailResponse>().match
        } catch (e: Exception) {
            null
        }
    }

    suspend fun getLineup(matchId: String): LineupDto? {
        // Football-Data.org does not provide lineups on free tier, so return null
        return null
    }
}

@Serializable
data class MatchesResponse(val matches: List<MatchDto> = emptyList())

@Serializable
data class MatchDetailResponse(val match: MatchDto)

@Serializable
data class MatchDto(
    val id: Int,
    val utcDate: String,
    val status: String,
    val matchday: Int? = null,
    val stage: String? = null,
    val group: String? = null,
    val homeTeam: TeamDto,
    val awayTeam: TeamDto,
    val score: ScoreDto,
    val competition: CompetitionDto,
    val venue: String? = null
)

@Serializable
data class TeamDto(val id: Int, val name: String, val shortName: String? = null)

@Serializable
data class ScoreDto(
    val fullTime: ScoreValueDto? = null,
    val halfTime: ScoreValueDto? = null,
    val winner: String? = null
)

@Serializable
data class ScoreValueDto(val home: Int? = null, val away: Int? = null)

@Serializable
data class CompetitionDto(val id: Int, val name: String)

@Serializable
data class LineupDto(
    val home: List<String> = emptyList(),
    val away: List<String> = emptyList()
) 