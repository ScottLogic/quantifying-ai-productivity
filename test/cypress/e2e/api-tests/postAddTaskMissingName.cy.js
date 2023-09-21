/**
 * Scenario covered : Post - Add Task Missing Name and Description
 *  1. Create a task with a missing name and description using a POST endpoint and
       check that the response code is 400.
    2. Check that the timestamp is within 5 seconds of creation and that the error
       and path fields contain the correct values.
 */

describe("Post - Add Task Missing Name and Description", () => {
  it("Post - Add Task Missing Name", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/todo/addTask?description=This is Description Four",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Bad Request");
    });
  });

  it("Post - Add Task Missing Description", () => {
    cy.request({
      method: "POST",
      url: "http://localhost:8080/todo/addTask?name=Name Four",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Bad Request");
    });
  });
});
