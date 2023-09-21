/**
 * Scenarios covered : Get - Task Number 3
    1. Check that the HTTP status of the response is 200
    2. Check the uuid, name, description  fields are equal to the expected values
    3. Check the completed field is equal to null and the complete field is equal to false
 */

describe("Get specific task number", () => {
  it("GET specific task number", () => {
    cy.request({
      method: "GET",

      // Replacing {uuid} with task 3 uid
      url: "http://localhost:8080/todo/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq("Test generative AI");
      expect(response.body.description).to.eq(
        "Use generative AI technology to write a simple web service"
      );
      expect(response.body.completed).to.eq(null);
      expect(response.body.complete).to.eq(false);
    });
  });
});
