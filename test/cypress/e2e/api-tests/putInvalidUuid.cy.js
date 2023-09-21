/**
 * Scenarios covered : Put - Invalid UUID
 * 1. Using a PUT request for a task that has an invalid UUID, check that the response code is 400 and that
 *    the error and path fields contain the correct values.
 */

describe("Put Invalid UUID", () => {
  it("PUT - Invalid UUID", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:8080/todo/completed/invalid-uuid",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Bad Request");
      expect(response.body.path).to.eq("/todo/completed/invalid-uuid");
    });
  });
});
