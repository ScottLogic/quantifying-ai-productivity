/// <reference types = "Cypress" />

/*
******************************************
TASK OBJECTIVES:
- Add a task with a missing description and check the values
******************************************
*/

describe("API Tasks", () => {
  it("Tests that a task with a missing description cannot be added", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/todo/addTask?name=Missing Description",
      failOnStatusCode: false,
    }).then((response) => {
      if (response.body.timestamp) {
        //Compares created time with actual response and does a comparison that it is within now and 5 seconds ago
        var createdSeconds = new Date(response.body.timestamp).getTime() / 1000;
        cy.log(createdSeconds);
        var nowSeconds = new Date().getTime() / 1000;
        cy.log(nowSeconds);
        expect(createdSeconds < nowSeconds && createdSeconds > nowSeconds - 5).to
          .be.true;
      }
      expect(response.status).to.eq(400);
      // The C# web framework does not provide the error or path fields in the response body.
      // Test the response body fields for JavaScript and Spring Boot implementations.
      if (response.body.error) {
        expect(response.body.error).to.eq("Bad Request");
      }
      if (response.body.path) {
        expect(response.body.path).to.be.oneOf([
          "/todo/addTask?name=Missing%20Description",
          "/todo/addTask"
        ]);
      }
    });
  });
});
