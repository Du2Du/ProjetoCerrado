import { authService } from "../../services/auth-service.js";
import { setButtonLoading } from "../../components/documentos-ui.js";

const form = document.querySelector("#login-form");
const usuario = document.querySelector("#usuario");
const senha = document.querySelector("#senha");
const toggle = document.querySelector("#password-toggle");
const submit = document.querySelector("#login-submit");
const feedback = document.querySelector("#login-feedback");
const usuarioError = document.querySelector("#usuario-error");
const senhaError = document.querySelector("#senha-error");

function destinationAfterLogin() {
  const requested = new URLSearchParams(window.location.search).get("redirect");
  if (requested?.startsWith("/admin/") && !requested.includes("\\")) return requested;
  return "../documentos/";
}

function validate() {
  let valid = true;
  usuarioError.textContent = "";
  senhaError.textContent = "";
  usuario.removeAttribute("aria-invalid");
  senha.removeAttribute("aria-invalid");

  if (!usuario.value.trim()) {
    usuarioError.textContent = "Informe o usuário.";
    usuario.setAttribute("aria-invalid", "true");
    valid = false;
  }
  if (!senha.value) {
    senhaError.textContent = "Informe a senha.";
    senha.setAttribute("aria-invalid", "true");
    valid = false;
  }
  return valid;
}

toggle.addEventListener("click", () => {
  const show = senha.type === "password";
  senha.type = show ? "text" : "password";
  toggle.textContent = show ? "Ocultar" : "Mostrar";
  toggle.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
  toggle.setAttribute("aria-pressed", String(show));
  senha.focus();
});

[usuario, senha].forEach((field) => field.addEventListener("input", () => {
  field.removeAttribute("aria-invalid");
  document.querySelector(`#${field.id}-error`).textContent = "";
  feedback.textContent = "";
}));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  feedback.textContent = "";
  if (!validate()) {
    form.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  setButtonLoading(submit, true, "Entrando…");
  try {
    await authService.login({ usuario: usuario.value.trim(), senha: senha.value });
    window.location.assign(destinationAfterLogin());
  } catch (error) {
    feedback.textContent = error.status === 401
      ? "Usuário ou senha inválidos. Verifique os dados e tente novamente."
      : error.status === 0
        ? "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente."
        : "O servidor não conseguiu concluir o acesso. Tente novamente.";
    senha.select();
  } finally {
    setButtonLoading(submit, false);
  }
});

authService.me({ notifyOnUnauthorized: false })
  .then(() => window.location.replace(destinationAfterLogin()))
  .catch((error) => {
    if (error.status !== 401) {
      feedback.textContent = error.status === 0
        ? "Não foi possível verificar se já existe uma sessão. Você ainda pode tentar entrar."
        : "O servidor não conseguiu verificar a sessão atual. Você ainda pode tentar entrar.";
    }
    usuario.focus();
  });
