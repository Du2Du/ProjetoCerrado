import {
  apiRequest,
  clearCsrfToken,
  hasCsrfToken,
  setCsrfToken
} from "./api-client.js";

/**
 * Fachada de autenticação do painel administrativo.
 * Aceita pequenas variações no contrato do backend, captura o token CSRF e
 * entrega às telas uma sessão com `user.name` sempre disponível.
 */

function responseObjects(payload) {
  const root = Array.isArray(payload) ? payload[0] : payload;
  if (!root || typeof root !== "object") return [];
  return [root, root.data, root.session, root.auth]
    .filter((value) => value && typeof value === "object");
}

// Localiza e guarda o token CSRF mesmo quando a API varia o nome do campo.
function captureCsrfToken(payload) {
  // Procura nomes de campo usados por versões diferentes da API para manter a
  // camada de interface independente dessas variações.
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

// Normaliza formatos de sessão para sempre oferecer `session.user.name`.
function normalizeSession(payload) {
  // Converte os formatos conhecidos para um único contrato consumido pelo painel.
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
  // Autentica credenciais e captura o CSRF para as operações seguintes.
  async login({ usuario, senha }) {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      body: { usuario, senha },
      notifyOnUnauthorized: false
    });
    captureCsrfToken(response);
    return response;
  },

  // Consulta e normaliza a sessão; também renova o CSRF quando disponível.
  async me({ notifyOnUnauthorized = true } = {}) {
    const response = await apiRequest("/api/auth/me", { notifyOnUnauthorized });
    captureCsrfToken(response);
    return normalizeSession(response);
  },

  // Encerra a sessão e só então descarta o token mantido em memória.
  async logout() {
    const response = await apiRequest("/api/auth/logout", {
      method: "POST",
      requiresCsrf: true
    });
    // O token pertence à sessão encerrada e não pode ser reaproveitado.
    clearCsrfToken();
    return response;
  },

  hasCsrfToken
});
