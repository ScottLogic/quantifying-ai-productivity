/// <reference types = "Cypress" />

/*
******************************************
TASK OBJECTIVES:
- Use a UUID that cannot be found
- Check that the expected field values are equal to the response body
******************************************
*/

describe("API Tasks", () => {
  it("Gets a task that cannot be found", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo/5c3ec8bc-6099-1a2b-b6da-8e2956db3a34",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.uuid).to.eq("00000000-0000-0000-0000-000000000000");
      expect(response.body.name).to.eq("Unknown Task");
      expect(response.body.description).to.eq("Unknown Task");
      const millisecondsSinceEpoch = new Date(response.body.created).getTime();
      expect(millisecondsSinceEpoch).to.eq(0);
      cy.log(millisecondsSinceEpoch);
      expect(response.body.completed).to.eq(null);
      expect(response.body.complete).to.eq(false);
    });
  });
});
