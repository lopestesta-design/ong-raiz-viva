/* Menu responsivo (hambúrguer + dropdown) e modais */
(function () {
  "use strict";

  var botaoMenu = document.querySelector(".menu-toggle");
  var painel = document.getElementById("menu-principal");
  var desktop = window.matchMedia("(min-width: 48rem)");

  function abrirMenu(abrir) {
    painel.classList.toggle("is-open", abrir);
    botaoMenu.setAttribute("aria-expanded", String(abrir));
    botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  }

  function fecharSubmenus() {
    document.querySelectorAll(".has-submenu").forEach(function (item) {
      item.classList.remove("is-open");
      item.querySelector(".submenu-toggle").setAttribute("aria-expanded", "false");
    });
  }

  if (botaoMenu && painel) {
    /* hambúrguer */
    botaoMenu.addEventListener("click", function () {
      abrirMenu(botaoMenu.getAttribute("aria-expanded") !== "true");
    });

    /* seta do submenu (desktop) */
    document.querySelectorAll(".submenu-toggle").forEach(function (seta) {
      seta.addEventListener("click", function () {
        var item = seta.closest(".has-submenu");
        var abrir = !item.classList.contains("is-open");
        fecharSubmenus();
        item.classList.toggle("is-open", abrir);
        seta.setAttribute("aria-expanded", String(abrir));
      });
    });

    /* Esc fecha tudo e devolve o foco ao botão */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      fecharSubmenus();
      if (!desktop.matches && botaoMenu.getAttribute("aria-expanded") === "true") {
        abrirMenu(false);
        botaoMenu.focus();
      }
    });

    /* clique fora fecha o submenu */
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".has-submenu")) fecharSubmenus();
    });

    /* ao mudar de celular para desktop (ou o contrário), volta ao estado inicial */
    desktop.addEventListener("change", function () {
      abrirMenu(false);
      fecharSubmenus();
    });
  }

  /* ---------- Modais (<dialog>) ---------- */
  document.querySelectorAll("[data-abrir-modal]").forEach(function (gatilho) {
    gatilho.addEventListener("click", function () {
      var modal = document.getElementById(gatilho.dataset.abrirModal);
      if (modal && typeof modal.showModal === "function") modal.showModal();
    });
  });

  /* clicar no fundo escuro fecha o modal */
  document.querySelectorAll("dialog.modal").forEach(function (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.close();
    });
  });
})();
