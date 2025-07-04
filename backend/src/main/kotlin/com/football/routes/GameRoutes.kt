package com.football.routes

import com.football.models.*
import com.football.services.GameService
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.json.Json

fun Route.gameRoutes(gameService: GameService) {
    route("/games") {
        get("/live") {
            try {
                val games = gameService.getLiveGames()
                call.respond(games)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch live games")
            }
        }

        get("/upcoming") {
            try {
                val games = gameService.getUpcomingGames()
                call.respond(games)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch upcoming games")
            }
        }
    }

    route("/game/{id}") {
        get {
            try {
                val gameId = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Game ID is required")
                val game = gameService.getGame(gameId)
                
                if (game != null) {
                    call.respond(game)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Game not found")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch game")
            }
        }
    }

    route("/lineup/{gameId}") {
        get {
            try {
                val gameId = call.parameters["gameId"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Game ID is required")
                val lineup = gameService.getLineup(gameId)
                
                if (lineup != null) {
                    call.respond(lineup)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Lineup not found")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch lineup")
            }
        }
    }

    route("/score/live/{gameId}") {
        get {
            try {
                val gameId = call.parameters["gameId"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Game ID is required")
                val score = gameService.getLiveScore(gameId)
                
                if (score != null) {
                    call.respond(score)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Live score not found")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch live score")
            }
        }
    }

    route("/chat/{gameId}") {
        get {
            try {
                val gameId = call.parameters["gameId"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Game ID is required")
                val messages = gameService.getChatMessages(gameId)
                call.respond(messages)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch chat messages")
            }
        }

        post {
            try {
                val gameId = call.parameters["gameId"] ?: return@post call.respond(HttpStatusCode.BadRequest, "Game ID is required")
                val request = call.receive<ChatMessageRequest>()
                
                val message = gameService.addChatMessage(gameId, request.message, request.userId)
                call.respond(HttpStatusCode.Created, message)
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to send chat message")
            }
        }
    }

    route("/enhanced-game/{id}") {
        get {
            try {
                val gameId = call.parameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Game ID is required")
                val game = gameService.getEnhancedGame(gameId)
                
                if (game != null) {
                    call.respond(game)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Game not found")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch enhanced game")
            }
        }
    }

    route("/enhanced-lineup/{gameId}") {
        get {
            try {
                val gameId = call.parameters["gameId"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Game ID is required")
                val lineup = gameService.getEnhancedLineup(gameId)
                
                if (lineup != null) {
                    call.respond(lineup)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Lineup not found")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch enhanced lineup")
            }
        }
    }

    route("/events/{gameId}") {
        get {
            try {
                val gameId = call.parameters["gameId"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Game ID is required")
                val game = gameService.getEnhancedGame(gameId)
                
                if (game != null) {
                    call.respond(game.events)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Game not found")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch match events")
            }
        }
    }

    route("/streams/{gameId}") {
        get {
            try {
                val gameId = call.parameters["gameId"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Game ID is required")
                val game = gameService.getEnhancedGame(gameId)
                
                if (game != null) {
                    call.respond(game.streams)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Game not found")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch streams")
            }
        }
    }

    route("/field-positions/{gameId}") {
        get {
            try {
                val gameId = call.parameters["gameId"] ?: return@get call.respond(HttpStatusCode.BadRequest, "Game ID is required")
                val game = gameService.getEnhancedGame(gameId)
                
                if (game != null) {
                    call.respond(game.fieldPositions)
                } else {
                    call.respond(HttpStatusCode.NotFound, "Game not found")
                }
            } catch (e: Exception) {
                call.respond(HttpStatusCode.InternalServerError, "Failed to fetch field positions")
            }
        }
    }
} 