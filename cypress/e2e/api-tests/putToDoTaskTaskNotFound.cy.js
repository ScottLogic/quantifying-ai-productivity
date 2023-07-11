/// <reference types = "Cypress" />

/*
******************************************
TASK OBJECTIVES:
Use a UUID assigned to task not found
Check that the task cannot be found
******************************************
*/

describe("API Tasks", () => {
  it("Tests that the task cannot be found when using PUT request", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:8080/todo/completed/fd5ff9df-f194-1a3b-966a-71b38f95e14f",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.eq(false);
      expect(response.body.message).to.eq("Task not found.");
    });
  });
});
