import { Game, Lineup, ChatMessage, LiveScoreUpdate } from "@/types";

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
    return this.request<ChatMessage[]>(`/chat/${gameId}`);
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
}

const apiClient = new ApiClient(API_BASE_URL);
console.log("apiClient created:", apiClient); // DEBUG

export { apiClient };
