const API_CONFIG = Object.freeze({
  baseUrl: "",
  useMocks: false,
  useDocumentMocks: false
});

export const apiConfig = API_CONFIG;
export const AUTH_UNAUTHORIZED_EVENT = "api:unauthorized";

let csrfToken = null;

export class ApiError extends Error {
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

function isAdministrativeMutation(path, method) {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method)
    && path.startsWith("/api/admin/");
}

function notifyUnauthorized(path) {
  if (typeof window === "undefined" || typeof window.dispatchEvent !== "function") return;
  window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT, { detail: { path } }));
}

async function readPayload(response) {
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
  if (response.ok && responseCsrfToken) setCsrfToken(responseCsrfToken);

  const payload = await readPayload(response);

  if (!response.ok) {
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
