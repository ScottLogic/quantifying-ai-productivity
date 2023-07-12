/// <reference types = "Cypress" />

/*
******************************************
TASK OBJECTIVES:
- Use an invalid UUID
- Check the expected field values are equal to the response body
******************************************
*/

describe("API Tasks", () => {
  it("Gets a task that has an invalid UUID", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo/invalid-uuid",
      //Need this line to ensure it does not fail on a bad status code
      failOnStatusCode: false,
    }).then((response) => {
      //Note: cannot test the timestamp as there is a microsecond difference between
      //the request being made and the actual value
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Bad Request");
      expect(response.body.path).to.eq("/todo/invalid-uuid");
    });
  });
});
