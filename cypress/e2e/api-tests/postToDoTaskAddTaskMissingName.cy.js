/// <reference types = "Cypress" />

/*
******************************************
TASK OBJECTIVES:
- Add a task with a missing name and check the values
******************************************
*/

describe("API Tasks", () => {
  it("Tests that a task with a missing name cannot be added", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/todo/addTask?description=Missing Name",
      failOnStatusCode: false,
    }).then((response) => {
      //Compares created time with actual response and does a comparison that it is within now and 5 seconds ago
      var createdSeconds = new Date(response.body.timestamp).getTime() / 1000;
      cy.log(createdSeconds);
      var nowSeconds = new Date().getTime() / 1000;
      cy.log(nowSeconds);
      expect(createdSeconds < nowSeconds && createdSeconds > nowSeconds - 5).to
        .be.true;
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Bad Request");
      expect(response.body.path).to.eq(
        "/todo/addTask?description=Missing%20Name"
      );
    });
  });
});
