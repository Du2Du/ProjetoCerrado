import {
  apiRequest,
  clearCsrfToken,
  hasCsrfToken,
  setCsrfToken
} from "./api-client.js";

function responseObjects(payload) {
  const root = Array.isArray(payload) ? payload[0] : payload;
  if (!root || typeof root !== "object") return [];
  return [root, root.data, root.session, root.auth]
    .filter((value) => value && typeof value === "object");
}

function captureCsrfToken(payload) {
  for (const object of responseObjects(payload)) {
    const candidate = object.csrfToken
      || object.csrf_token
      || object.tokenCsrf
      || object.token_csrf
      || (typeof object.csrf === "string" ? object.csrf : object.csrf?.token);
    if (typeof candidate === "string" && candidate.trim()) {
      setCsrfToken(candidate);
      return;
    }
  }
}

function normalizeSession(payload) {
  const objects = responseObjects(payload);
  const root = objects[0] || {};
  const data = root.data && typeof root.data === "object" ? root.data : root;
  const userCandidate = data.user || data.usuario || root.user || root.usuario;
  const user = userCandidate && typeof userCandidate === "object" ? userCandidate : {};
  const name = user.name
    || user.nome
    || user.username
    || user.usuario
    || (typeof userCandidate === "string" ? userCandidate : null)
    || data.username
    || (typeof data.usuario === "string" ? data.usuario : null)
    || "Administrador";

  return { ...data, user: { ...user, name } };
}

export const authService = Object.freeze({
  async login({ usuario, senha }) {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { usuario, senha },
      notifyOnUnauthorized: false
    });
    captureCsrfToken(response);
    return response;
  },

  async me({ notifyOnUnauthorized = true } = {}) {
    const response = await apiRequest("/api/auth/me", { notifyOnUnauthorized });
    captureCsrfToken(response);
    return normalizeSession(response);
  },

  async logout() {
    const response = await apiRequest("/api/auth/logout", {
      method: "POST",
      requiresCsrf: true
    });
    clearCsrfToken();
    return response;
  },

  hasCsrfToken
});
