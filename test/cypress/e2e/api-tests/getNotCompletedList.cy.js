/**
 * Scenarios covered : Get - Not completed List
    1. Check that the HTTP status of the response is 200
    2. Log the length of the array to the console
 */

describe("Get list of not completed tasks", () => {
  it("GET not completed tasks", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=false",
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log("Array length is : " + response.body.length);
    });
  });
});
