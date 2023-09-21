/**
 * Scenarios covered : Get Invalid UUID
    1. Check that the response is 400
 */

describe("Get Invalid UUID", () => {
  it("GET invalid uuid", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo/invalid-uuid",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});
