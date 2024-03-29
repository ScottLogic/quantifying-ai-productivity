/// <reference types = "Cypress" />

/*
******************************************
TASK OBJECTIVES:
- Retrieve the tasks that are listed as not completed
- Check the length of the array
******************************************
*/

describe("API Tasks", () => {
  it("Gets a list of tasks that have not been completed", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=false",
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log("The array length is: " + response.body.length);
    });
  });
});
