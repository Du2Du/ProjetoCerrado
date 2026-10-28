const API_CONFIG = Object.freeze({
  baseUrl: "",
  useMocks: true
});

export const apiConfig = API_CONFIG;

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {}, signal } = options;
  const requestHeaders = { Accept: "application/json", ...headers };
  const isFormData = body instanceof FormData;

  if (body && !isFormData && !requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_CONFIG.baseUrl}${path}`, {
    method,
    credentials: "include",
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    signal
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new ApiError(
      payload?.message || "Não foi possível concluir a solicitação.",
      response.status,
      payload
    );
  }

  return payload;
}

export function wait(milliseconds = 450) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}
