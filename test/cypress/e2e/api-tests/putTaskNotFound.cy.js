/**
 * Scenarios covered : Put - Task Not Found
 * 1. Using a PUT request for a task that cannot be found, check that the response code is 200,
 *    success is false and message is populated with an appropriate message.
 */

describe("Put task not found", () => {
  it("PUT - Task not found", () => {
    cy.request({
      method: "PUT",
      url: "http://localhost:8080/todo/completed/5c3ec8bc-6099-1a2b-b6da-8e2956db3a34",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.eq(false);
      expect(response.body.message).to.eq("Task not found.");
    });
  });
});
