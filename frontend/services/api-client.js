/**
 * Cliente HTTP comum do frontend.
 *
 * Responsabilidades: serializar corpos JSON, preservar cookies de sessão,
 * anexar CSRF em mutações administrativas, uniformizar erros e avisar a tela
 * administrativa quando a sessão expirar.
 */
const API_CONFIG = Object.freeze({
  baseUrl: "",
  useMocks: false,
  useDocumentMocks: false
});

export const apiConfig = API_CONFIG;
export const AUTH_UNAUTHORIZED_EVENT = "api:unauthorized";

let csrfToken = null;

export class ApiError extends Error {
  // Preserva status e detalhes da API junto da mensagem padrão de `Error`.
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function setCsrfToken(token) {
  csrfToken = typeof token === "string" && token.trim() ? token.trim() : null;
}

export function clearCsrfToken() {
  csrfToken = null;
}

export function hasCsrfToken() {
  return csrfToken !== null;
}

// Identifica operações administrativas que obrigatoriamente exigem CSRF.
function isAdministrativeMutation(path, method) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method)
    && path.startsWith("/api/admin/");
}

// Publica um evento global para a tela decidir como tratar uma sessão expirada.
function notifyUnauthorized(path) {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") return;
  window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT, { detail: { path } }));
}

// Converte o corpo para JSON, texto ou nulo conforme a resposta recebida.
async function readPayload(response) {
  // A resposta é lida uma única vez como texto; depois é convertida conforme o
  // Content-Type. Isso também permite lidar com respostas vazias e texto puro.
  const text = await response.text();
  if (!text) return null;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return text;

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError("A API retornou uma resposta JSON inválida.", response.status, {
      code: "invalid_json_response"
    });
  }
}

export async function apiRequest(path, options = {}) {
  // 1) normaliza método/cabeçalhos; 2) aplica CSRF quando necessário; 3) faz a
  // requisição; 4) interpreta a resposta; 5) converte falhas em `ApiError`.
  const {
    method: requestedMethod = "GET",
    body,
    headers = {},
    signal,
    requiresCsrf,
    notifyOnUnauthorized = true
  } = options;
  const method = requestedMethod.toUpperCase();
  const requestHeaders = { Accept: "application/json", ...headers };
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const shouldSendCsrf = requiresCsrf ?? isAdministrativeMutation(path, method);

  if (body !== undefined && body !== null && !isFormData && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (shouldSendCsrf) {
    if (!csrfToken) {
      throw new ApiError(
        "A API não forneceu o token CSRF necessário para esta operação.",
        0,
        { code: "csrf_token_missing" }
      );
    }
    requestHeaders["X-CSRF-Token"] = csrfToken;
  }

  let response;
  try {
    response = await fetch(`${API_CONFIG.baseUrl}${path}`, {
      method,
      credentials: "include",
      headers: requestHeaders,
      body: body !== undefined && body !== null
        ? (isFormData ? body : JSON.stringify(body))
        : undefined,
      signal
    });
  } catch (cause) {
    if (cause?.name === "AbortError") throw cause;
    const error = new ApiError(
      "Não foi possível conectar ao servidor.",
      0,
      { code: "network_error" }
    );
    error.cause = cause;
    throw error;
  }

  const responseCsrfToken = response.headers.get("x-csrf-token");
  // Algumas rotas renovam o token. Só guardamos o valor vindo de resposta válida.
  if (response.ok && responseCsrfToken) setCsrfToken(responseCsrfToken);

  const payload = await readPayload(response);

  if (!response.ok) {
    // O evento desacopla o cliente HTTP da navegação: a página administrativa
    // decide como e para onde redirecionar quando recebe um 401.
    if (response.status === 401 && notifyOnUnauthorized) notifyUnauthorized(path);
    const responseMessage = typeof payload === "object" && payload !== null
      ? payload.message || payload.error
      : null;
    throw new ApiError(
      responseMessage || "Não foi possível concluir a solicitação.",
      response.status,
      payload
    );
  }

  return payload;
}

export function wait(milliseconds = 450) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}
