import { apiConfig, apiRequest, ApiError, wait } from "./api-client.js";

const SESSION_KEY = "projeto-cerrado:mock-session";

function readMockSession() {
  try {
    return JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function saveMockSession(session) {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export const authService = Object.freeze({
  async login({ username, password }) {
    if (!apiConfig.useMocks) {
      return apiRequest("/api/auth/login", {
        method: "POST",
        body: { username, password }
      });
    }

    await wait(650);
    const simulateInvalidCredentials = new URLSearchParams(window.location.search)
      .get("simularErro") === "credenciais";

    if (simulateInvalidCredentials || !username.trim() || !password) {
      throw new ApiError("Usuário ou senha inválidos.", 401);
    }

    const session = {
      user: { name: username.trim() },
      createdAt: new Date().toISOString(),
      mock: true
    };
    saveMockSession(session);
    return session;
  },

  async me() {
    if (!apiConfig.useMocks) return apiRequest("/api/auth/me");
    await wait(180);
    const session = readMockSession();
    if (!session) throw new ApiError("Sessão não encontrada.", 401);
    return session;
  },

  async logout() {
    if (!apiConfig.useMocks) {
      return apiRequest("/api/auth/logout", { method: "POST" });
    }
    await wait(250);
    window.sessionStorage.removeItem(SESSION_KEY);
    return { success: true };
  }
});
