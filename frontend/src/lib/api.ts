import {
  Game,
  Lineup,
  ChatMessage,
  LiveScoreUpdate,
  EnhancedGame,
  EnhancedLineup,
  MatchEvent,
  StreamInfo,
  FieldPosition,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

console.log("API_BASE_URL:", API_BASE_URL); // DEBUG

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    console.log("ApiClient instantiated with baseUrl:", this.baseUrl); // DEBUG
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log("API fetch:", url); // DEBUG
    console.log("API fetch options:", options); // DEBUG

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      console.log("API response status:", response.status); // DEBUG

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("API response data:", data); // DEBUG
      return data;
    } catch (error) {
      console.error("API fetch error:", error); // DEBUG
      throw error;
    }
  }

  async getLiveGames(): Promise<Game[]> {
    console.log("getLiveGames called, this:", this); // DEBUG
    return this.request<Game[]>("/games/live");
  }

  async getUpcomingGames(): Promise<Game[]> {
    console.log("getUpcomingGames called, this:", this); // DEBUG
    return this.request<Game[]>("/games/upcoming");
  }

  async getGame(id: string): Promise<Game> {
    return this.request<Game>(`/game/${id}`);
  }

  async getLineup(gameId: string): Promise<Lineup> {
    return this.request<Lineup>(`/lineup/${gameId}`);
  }

  async getChatMessages(gameId: string): Promise<ChatMessage[]> {
    console.log("Fetching chat messages for game:", gameId);
    const response = await fetch(`${this.baseUrl}/chat/${gameId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chat messages: ${response.statusText}`);
    }
    return response.json();
  }

  async sendChatMessage(
    gameId: string,
    message: string,
    userId: string
  ): Promise<ChatMessage> {
    return this.request<ChatMessage>(`/chat/${gameId}`, {
      method: "POST",
      body: JSON.stringify({ message, userId }),
    });
  }

  async getLiveScore(gameId: string): Promise<LiveScoreUpdate> {
    return this.request<LiveScoreUpdate>(`/score/live/${gameId}`);
  }

  async getEnhancedGame(gameId: string): Promise<EnhancedGame> {
    console.log("Fetching enhanced game:", gameId);
    const response = await fetch(`${this.baseUrl}/enhanced-game/${gameId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch enhanced game: ${response.statusText}`);
    }
    return response.json();
  }

  async getEnhancedLineup(gameId: string): Promise<EnhancedLineup> {
    console.log("Fetching enhanced lineup for game:", gameId);
    const response = await fetch(`${this.baseUrl}/enhanced-lineup/${gameId}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch enhanced lineup: ${response.statusText}`
      );
    }
    return response.json();
  }

  async getMatchEvents(gameId: string): Promise<MatchEvent[]> {
    console.log("Fetching match events for game:", gameId);
    const response = await fetch(`${this.baseUrl}/events/${gameId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch match events: ${response.statusText}`);
    }
    return response.json();
  }

  async getStreams(gameId: string): Promise<StreamInfo[]> {
    console.log("Fetching streams for game:", gameId);
    const response = await fetch(`${this.baseUrl}/streams/${gameId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch streams: ${response.statusText}`);
    }
    return response.json();
  }

  async getFieldPositions(gameId: string): Promise<FieldPosition[]> {
    console.log("Fetching field positions for game:", gameId);
    const response = await fetch(`${this.baseUrl}/field-positions/${gameId}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch field positions: ${response.statusText}`
      );
    }
    return response.json();
  }
}

const apiClient = new ApiClient(API_BASE_URL);
console.log("apiClient created:", apiClient); // DEBUG

export { apiClient };
