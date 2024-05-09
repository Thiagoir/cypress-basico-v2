/// <reference types="cypress"" />

describe("Central de atentimento ao Cliente TAT", () => {
  beforeEach(() => {
    cy.visit("./src/index.html");
  });
  it.only("Verifique o titulo da aplicação", () => {
    cy.title().should("include", "Central de Atendimento ao Cliente TAT");
  });
  it("Preenche os campos obrigatorios e envia o formulario", () => {
    const longText =
      "Teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste";

    cy.clock();

    cy.get("#firstName").click().type("Thiago");
    cy.get("#lastName").click().type("Rodrigues");
    cy.get("#email").click().type("thiago@qa.com");
    cy.get("#open-text-area").click().type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");
    cy.tick(3000);

    cy.get(".success").should("not.be.visible");
  });
  it("Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.get("#firstName").click().type("Thiago");
    cy.get("#lastName").click().type("Rodrigues");
    cy.get("#email").click().type("thiago.qa.com");
    cy.get("#open-text-area").click().type("Test");
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });
  it("Campo telefone continua vazio quando preenchido com valor não numerico", () => {
    cy.get("#phone").click().type("abcdef").should("have.value", "");
  });
  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.get("#phone-checkbox").click();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });
  it("Preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .click()
      .type("Thiago")
      .should("have.value", "Thiago")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .click()
      .type("Rodrigues")
      .should("have.value", "Rodrigues")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .click()
      .type("thiago@qa.com")
      .should("have.value", "thiago@qa.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .click()
      .type("123456789")
      .should("have.value", "123456789")
      .clear()
      .should("have.value", "");
  });
  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });
  it("Envia o formulário com sucesso usando um comando customizado", () => {
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");
  });
  it("seleciona um produto (Youtube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });
  it("seleciona um produto (Mentoria) por seu (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });
  it("seleciona um produto (Blog) por seu indice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });
  it("marca o tipo de atendimento 'Feedback'", () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("be.checked");
  });
  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(function ($radio) {
        cy.wrap($radio).check().should("be.checked");
      });
  });
  it("Selecione um arquivo da pasta fixtures", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json")
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });
  it("Selecione um arquivo simulando um drag-and-drop", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json", { action: "drag-drop" })
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });
  it("Selecione um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json").as("sampleFile");
    cy.get('input[type="file"]')
      .selectFile("@sampleFile")
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });
  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });
  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.get("#privacy a").invoke("removeAttr", "target").click();

    cy.contains("Talking About Testing").should("be.visible");
  });
  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });
  it("preenche a area de texto usando o comando invoke", () => {
    const longText = Cypress._.repeat("0123456789", 20);
    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });
  it("faz uma requisição HTTP", () => {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should(function (response) {
      const { status, statusText, body } = response;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });
  it("encontra o gato escondido", () => {
    cy.get("#cat").invoke("show").should("be.visible");
    cy.get("#title").invoke("text", "CAT TAT");
    cy.get("#title").invoke("text", "Eu amo gatos");
  });
});
