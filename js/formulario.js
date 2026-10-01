/* Máscaras e validações complementares do formulário de cadastro */
(function () {
  "use strict";

  /* ---------- Máscaras ---------- */
  function apenasDigitos(valor) {
    return valor.replace(/\D/g, "");
  }

  function mascaraCPF(valor) {
    var d = apenasDigitos(valor).slice(0, 11);
    if (d.length > 9) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    if (d.length > 6) return d.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    if (d.length > 3) return d.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    return d;
  }

  function mascaraTelefone(valor) {
    var d = apenasDigitos(valor).slice(0, 11);
    if (d.length > 10) return d.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
    if (d.length > 6) return d.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
    if (d.length > 2) return d.replace(/(\d{2})(\d{1,5})/, "($1) $2");
    return d ? "(" + d : "";
  }

  function mascaraCEP(valor) {
    var d = apenasDigitos(valor).slice(0, 8);
    if (d.length > 5) return d.replace(/(\d{5})(\d{1,3})/, "$1-$2");
    return d;
  }

  var mascaras = { cpf: mascaraCPF, telefone: mascaraTelefone, cep: mascaraCEP };

  document.querySelectorAll("[data-mask]").forEach(function (campo) {
    var aplicar = mascaras[campo.dataset.mask];
    campo.addEventListener("input", function () {
      campo.value = aplicar(campo.value);
    });
  });

  /* ---------- Validação do CPF (dígitos verificadores) ---------- */
  function cpfValido(cpf) {
    var d = apenasDigitos(cpf);
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    for (var t = 9; t < 11; t++) {
      var soma = 0;
      for (var i = 0; i < t; i++) soma += Number(d[i]) * (t + 1 - i);
      var digito = ((soma * 10) % 11) % 10;
      if (digito !== Number(d[t])) return false;
    }
    return true;
  }

  var cpf = document.getElementById("cpf");
  cpf.addEventListener("input", function () {
    var completo = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf.value);
    cpf.setCustomValidity(completo && !cpfValido(cpf.value) ? "CPF inválido. Confira os números digitados." : "");
  });

  /* ---------- Maioridade ---------- */
  var nascimento = document.getElementById("nascimento");
  var hoje = new Date();
  var limite = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());
  nascimento.max = limite.toISOString().slice(0, 10);

  /* ---------- Regras condicionais: doador / voluntário ---------- */
  var valor = document.getElementById("valor");
  var disponibilidade = document.getElementById("disponibilidade");
  var tipos = document.querySelectorAll('input[name="tipo"]');

  function atualizarObrigatorios() {
    var escolhido = document.querySelector('input[name="tipo"]:checked');
    var tipo = escolhido ? escolhido.value : "";
    var doa = tipo === "doador" || tipo === "ambos";
    var voluntaria = tipo === "voluntario" || tipo === "ambos";
    valor.required = doa;
    disponibilidade.required = voluntaria;
  }
  tipos.forEach(function (r) { r.addEventListener("change", atualizarObrigatorios); });

  /* ---------- Mensagens de erro em português ---------- */
  var mensagens = {
    valueMissing: "Preencha este campo.",
    typeMismatch: "Informe um valor no formato correto.",
    patternMismatch: "O formato não está correto.",
    tooShort: "O texto está muito curto.",
    rangeUnderflow: "O valor está abaixo do permitido.",
    rangeOverflow: "O valor está acima do permitido."
  };

  document.getElementById("form-cadastro").addEventListener("invalid", function (evento) {
    var campo = evento.target;
    if (campo.validity.customError) return;
    campo.setCustomValidity("");
    for (var tipo in mensagens) {
      if (campo.validity[tipo]) {
        var extra = campo.title && tipo === "patternMismatch" ? " " + campo.title + "." : "";
        campo.setCustomValidity(mensagens[tipo] + extra);
        break;
      }
    }
  }, true);

  document.getElementById("form-cadastro").addEventListener("input", function (evento) {
    var campo = evento.target;
    if (campo.id !== "cpf") campo.setCustomValidity("");
  });

  /* ---------- Envio ---------- */
  var form = document.getElementById("form-cadastro");
  var modalSucesso = document.getElementById("modal-sucesso");

  form.addEventListener("submit", function (evento) {
    evento.preventDefault(); // não há servidor neste trabalho: simulamos o envio
    var primeiroNome = document.getElementById("nome").value.trim().split(" ")[0];
    document.getElementById("sucesso-texto").textContent =
      "Obrigado, " + primeiroNome + "! Seu cadastro foi recebido e entraremos em contato em breve.";
    modalSucesso.showModal();
    form.reset();
    atualizarObrigatorios();
  });
})();
