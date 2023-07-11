/// <reference types = "Cypress" />

/*
******************************************
TASK OBJECTIVES:
Retrieve the completed list
Check the length of the array
******************************************
*/

describe("API Tasks", () => {
  it("Gets a list of completed tasks", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=true",
    }).then((response) => {
      expect(response.status).to.eq(200);
      //cy.log(JSON.stringify(response.body));
      cy.log("The array length is: " + response.body.length);
    });
  });
});
