/**
 * Scenarios covered : Get - Task Not Found
    1. Check that the the HTTP status of response is 200
    2. When no task is found the server should return UNKNOWN_TASK
    3. Check all fields equal the expected values
 */

describe("Get task not found", () => {
  it("GET task not found", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo/5c3ec8bc-6099-1a2b-b6da-8e2956db3a34",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq("Unknown Task");
      expect(response.body.description).to.eq("Unknown Task");
      expect(response.body.created).to.eq("1970-01-01T00:00:00.000Z");
      expect(response.body.completed).to.eq(null);
      expect(response.body.complete).to.eq(false);
    });
  });
});
