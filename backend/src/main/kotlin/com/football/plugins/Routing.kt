package com.football.plugins

import com.football.routes.gameRoutes
import com.football.routes.webSocketRoutes
import com.football.services.FootballDataApi
import com.football.services.GameService
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.server.routing.*

fun Application.configureRouting() {
    val config = environment.config
    val apiKey = config.propertyOrNull("ktor.footballdata.apiKey")?.getString() ?: System.getenv("FOOTBALL_DATA_API_KEY") ?: ""
    val footballDataApi = if (apiKey.isNotBlank()) FootballDataApi(apiKey) else null
    val gameService = GameService(footballDataApi)
    
    routing {
        gameRoutes(gameService)
        webSocketRoutes(gameService)
    }
} 