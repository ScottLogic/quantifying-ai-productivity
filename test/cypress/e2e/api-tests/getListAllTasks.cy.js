/**
 * Scenarios covered : Get List All Tasks
    1. Check that the HTTP status of the response is 200
    2. Log the length of the array to the console
 */

describe("Get list of all tasks", () => {
  it("GET all tasks", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo",
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log("Array length is : " + response.body.length);
    });
  });
});
