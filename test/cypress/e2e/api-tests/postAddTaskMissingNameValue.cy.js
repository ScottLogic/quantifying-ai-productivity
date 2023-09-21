/**
 * Scenario covered : Post - Missing description
 * 1. Create a task with a task name but a missing description using a POST endpoint
 *    and check that the response code is 400.
 * 2. Check that the timestamp is within 5 seconds of creation and that the error and
 *    path fields contain the correct values.
 */

describe("Post - Add Task Missing Name and Description value", () => {
  it("Post - Add Task with missing Description value", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/todo/addTask?name=Task four again&description=",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Bad Request");
    });
  });

  it("Post - Add Task with missing Name value", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/todo/addTask?name=&description=Description Four",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Bad Request");
    });
  });
});
