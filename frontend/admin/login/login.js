import { authService } from "../../services/auth-service.js";
import { setButtonLoading } from "../../components/documentos-ui.js";

const form = document.querySelector("#login-form");
const username = document.querySelector("#username");
const password = document.querySelector("#password");
const toggle = document.querySelector("#password-toggle");
const submit = document.querySelector("#login-submit");
const feedback = document.querySelector("#login-feedback");
const usernameError = document.querySelector("#username-error");
const passwordError = document.querySelector("#password-error");

function destinationAfterLogin() {
  const requested = new URLSearchParams(window.location.search).get("redirect");
  if (requested?.startsWith("/") && !requested.startsWith("//")) return requested;
  return "../documentos/";
}

function validate() {
  let valid = true;
  usernameError.textContent = "";
  passwordError.textContent = "";
  username.removeAttribute("aria-invalid");
  password.removeAttribute("aria-invalid");

  if (!username.value.trim()) {
    usernameError.textContent = "Informe o usuário.";
    username.setAttribute("aria-invalid", "true");
    valid = false;
  }
  if (!password.value) {
    passwordError.textContent = "Informe a senha.";
    password.setAttribute("aria-invalid", "true");
    valid = false;
  }
  return valid;
}

toggle.addEventListener("click", () => {
  const show = password.type === "password";
  password.type = show ? "text" : "password";
  toggle.textContent = show ? "Ocultar" : "Mostrar";
  toggle.setAttribute("aria-label", show ? "Ocultar senha" : "Mostrar senha");
  toggle.setAttribute("aria-pressed", String(show));
  password.focus();
});

[username, password].forEach((field) => field.addEventListener("input", () => {
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
    await authService.login({ username: username.value, password: password.value });
    window.location.assign(destinationAfterLogin());
  } catch (error) {
    feedback.textContent = error.status === 401
      ? "Usuário ou senha inválidos. Verifique os dados e tente novamente."
      : "Não foi possível entrar agora. Tente novamente.";
    password.select();
  } finally {
    setButtonLoading(submit, false);
  }
});

authService.me()
  .then(() => window.location.replace(destinationAfterLogin()))
  .catch(() => username.focus());
