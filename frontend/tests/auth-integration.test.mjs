import test from "node:test";
import assert from "node:assert/strict";

if (typeof globalThis.CustomEvent === "undefined") {
  globalThis.CustomEvent = class CustomEvent extends Event {
    constructor(type, options = {}) {
      super(type);
      this.detail = options.detail;
    }
  };
}

globalThis.window = new EventTarget();

const apiClient = await import("../services/api-client.js");
const { authService } = await import("../services/auth-service.js");

function jsonResponse(body, status = 200, headers = {}) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers }
  });
}

test("configura o cliente para usar as APIs da mesma origem", () => {
  assert.deepEqual(apiClient.apiConfig, { baseUrl: "" });
});

test("login envia o contrato do n8n e não publica 401 de credenciais como sessão expirada", async () => {
  let captured;
  let unauthorizedEvents = 0;
  window.addEventListener(apiClient.AUTH_UNAUTHORIZED_EVENT, () => unauthorizedEvents += 1);
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return jsonResponse({ message: "Credenciais inválidas" }, 401);
  };

  await assert.rejects(
    authService.login({ usuario: "guia_user", senha: "incorreta" }),
    (error) => error.status === 401
  );

  assert.equal(captured.url, "/api/auth/login");
  assert.equal(captured.options.credentials, "include");
  assert.deepEqual(JSON.parse(captured.options.body), {
    usuario: "guia_user",
    senha: "incorreta"
  });
  assert.equal(unauthorizedEvents, 0);
});

test("/me normaliza a sessão, guarda CSRF só em memória e logout envia o token", async () => {
  const requests = [];
  const responses = [
    jsonResponse({ usuario: { nome: "Gestor" }, csrf_token: "csrf-da-sessao" }),
    jsonResponse({ success: true })
  ];
  globalThis.fetch = async (url, options) => {
    requests.push({ url, options });
    return responses.shift();
  };

  const session = await authService.me();
  assert.equal(session.user.name, "Gestor");
  assert.equal(authService.hasCsrfToken(), true);

  await authService.logout();
  assert.equal(requests[1].url, "/api/auth/logout");
  assert.equal(requests[1].options.credentials, "include");
  assert.equal(requests[1].options.headers["X-CSRF-Token"], "csrf-da-sessao");
  assert.equal(authService.hasCsrfToken(), false);
});

test("logout não é enviado sem token CSRF", async () => {
  apiClient.clearCsrfToken();
  let called = false;
  globalThis.fetch = async () => {
    called = true;
    return jsonResponse({ success: true });
  };

  await assert.rejects(
    authService.logout(),
    (error) => error.details?.code === "csrf_token_missing"
  );
  assert.equal(called, false);
});

test("falha no logout não apaga o token antes da confirmação do servidor", async () => {
  apiClient.setCsrfToken("csrf-ainda-valido");
  globalThis.fetch = async () => jsonResponse({ message: "Erro interno" }, 500);

  await assert.rejects(authService.logout(), (error) => error.status === 500);
  assert.equal(authService.hasCsrfToken(), true);
});

test("401 de sessão publica o evento centralizado de expiração", async () => {
  let eventDetail;
  window.addEventListener(apiClient.AUTH_UNAUTHORIZED_EVENT, (event) => {
    eventDetail = event.detail;
  }, { once: true });
  globalThis.fetch = async () => jsonResponse({ message: "Sessão expirada" }, 401);

  await assert.rejects(authService.me(), (error) => error.status === 401);
  assert.deepEqual(eventDetail, { path: "/api/auth/me" });
});

test("diferencia falha de rede de erro HTTP 500", async () => {
  globalThis.fetch = async () => {
    throw new TypeError("offline");
  };
  await assert.rejects(
    authService.me(),
    (error) => error.status === 0 && error.details?.code === "network_error"
  );

  globalThis.fetch = async () => jsonResponse({ message: "Erro interno" }, 500);
  await assert.rejects(
    authService.me(),
    (error) => error.status === 500 && error.message === "Erro interno"
  );
});

test("requisições administrativas mutáveis recebem CSRF automaticamente", async () => {
  apiClient.setCsrfToken("csrf-admin");
  let captured;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return jsonResponse({ success: true });
  };

  await apiClient.apiRequest("/api/admin/documentos/42", { method: "DELETE" });
  assert.equal(captured.options.headers["X-CSRF-Token"], "csrf-admin");
});
