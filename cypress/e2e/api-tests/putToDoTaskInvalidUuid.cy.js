/// <reference types = "Cypress" />

/*
******************************************
TASK OBJECTIVES:
Use an invalid UUID
Check that the UUID is invalid based on the field values in the response body
******************************************
*/

describe("API Tasks", () => {
  it("Tests that the task uses an invalid UUID when using a PUT request", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:8080/todo/completed/invalid-uuid",
      failOnStatusCode: false,
    }).then((response) => {
      //Note: cannot test the timestamp as there is a microsecond difference between
      //the request being made and the actual value
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Bad Request");
      expect(response.body.path).to.eq("/todo/completed/invalid-uuid");
    });
  });
});
