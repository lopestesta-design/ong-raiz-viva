/* Toasts: notificações que aparecem e somem sozinhas.
   Uso em qualquer página que tenha <div class="toast-area" role="status" aria-live="polite"></div>:
   mostrarToast("Mensagem", "sucesso" | "aviso" | "erro" | "info", tempoEmMs) */
(function () {
  "use strict";

  var area = document.querySelector(".toast-area");
  if (!area) return;

  function remover(toast) {
    toast.classList.add("toast--saindo");
    setTimeout(function () { toast.remove(); }, 300);
  }

  function mostrarToast(mensagem, tipo, tempo) {
    var toast = document.createElement("div");
    toast.className = "toast toast--" + (tipo || "info");

    var texto = document.createElement("p");
    texto.textContent = mensagem;

    var fechar = document.createElement("button");
    fechar.type = "button";
    fechar.className = "toast__fechar";
    fechar.setAttribute("aria-label", "Fechar notificação");
    fechar.textContent = "\u00D7";
    fechar.addEventListener("click", function () { remover(toast); });

    toast.appendChild(texto);
    toast.appendChild(fechar);
    area.appendChild(toast);
    setTimeout(function () { if (toast.isConnected) remover(toast); }, tempo || 4500);
  }

  window.mostrarToast = mostrarToast;

  /* botões com data-toast disparam a notificação */
  document.querySelectorAll("[data-toast]").forEach(function (botao) {
    botao.addEventListener("click", function () {
      mostrarToast(botao.dataset.toast, botao.dataset.toastTipo);
    });
  });
})();
