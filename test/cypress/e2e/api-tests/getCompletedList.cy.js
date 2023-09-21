/**
 * Scenarios covered : Get - Completed List
    1. Check that the HTTP status of the response is 200
    2. Log the length of the array to the console
 */

describe("Get list of completed tasks", () => {
  it("GET completed tasks", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=true",
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log("Array length is : " + response.body.length);
    });
  });
});
