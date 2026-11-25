export function createTableAction(label, iconName, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "icon-button";
  button.classList.toggle("icon-button--danger", iconName === "delete");
  button.setAttribute("aria-label", label);
  button.title = label;

  const icon = document.createElement("span");
  icon.className = "material-symbol";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = iconName;
  button.append(icon);
  button.addEventListener("click", handler);
  return button;
}
