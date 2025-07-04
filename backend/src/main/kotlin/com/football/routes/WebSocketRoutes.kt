package com.football.routes

import com.football.models.*
import com.football.services.GameService
import io.ktor.server.application.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.coroutines.channels.ClosedSendChannelException
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString
import kotlinx.serialization.decodeFromString

fun Route.webSocketRoutes(gameService: GameService) {
    route("/ws") {
        route("/game/{gameId}") {
            webSocket {
                val gameId = call.parameters["gameId"] 
                if (gameId == null) {
                    close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Game ID is required"))
                    return@webSocket
                }
                
                val game = gameService.getGame(gameId)
                if (game == null) {
                    close(CloseReason(CloseReason.Codes.VIOLATED_POLICY, "Game not found"))
                    return@webSocket
                }

                val gameUpdates = gameService.getGameUpdates()
                val job = launch {
                    gameUpdates.collect { updates ->
                        val update = updates[gameId]
                        if (update != null) {
                            try {
                                val message = WebSocketMessage(
                                    type = "score_update",
                                    payload = Json.encodeToString(update)
                                )
                                send(Json.encodeToString(message))
                            } catch (e: ClosedSendChannelException) {
                                return@collect
                            }
                        }
                    }
                }

                try {
                    for (frame in incoming) {
                        when (frame) {
                            is Frame.Text -> {
                                val text = frame.readText()
                                try {
                                    val message = Json.decodeFromString<WebSocketMessage>(text)
                                    
                                    when (message.type) {
                                        "chat_message" -> {
                                            val chatRequest = Json.decodeFromString<ChatMessageRequest>(message.payload)
                                            val chatMessage = gameService.addChatMessage(gameId, chatRequest.message, chatRequest.userId)
                                            
                                            val response = WebSocketMessage(
                                                type = "chat_message",
                                                payload = Json.encodeToString(chatMessage)
                                            )
                                            
                                            send(Json.encodeToString(response))
                                        }
                                        "ping" -> {
                                            val pong = WebSocketMessage(
                                                type = "pong",
                                                payload = ""
                                            )
                                            send(Json.encodeToString(pong))
                                        }
                                    }
                                } catch (e: Exception) {
                                    val error = WebSocketMessage(
                                        type = "error",
                                        payload = "Invalid message format"
                                    )
                                    send(Json.encodeToString(error))
                                }
                            }
                            is Frame.Close -> {
                                break
                            }
                            else -> {
                                // Ignore other frame types
                            }
                        }
                    }
                } finally {
                    job.cancel()
                }
            }
        }
    }
} 