package com.football

import com.football.plugins.*
import io.ktor.server.application.*

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureSerialization()
    configureCORS()
    configureWebSockets()
    configureRouting()
    configureStatusPages()
} 