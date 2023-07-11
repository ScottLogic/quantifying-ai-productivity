/// <reference types = "Cypress" />

/*
******************************************
TASK OBJECTIVES:
Retrieve Task 3
Check that the expected field values are equal to the response body
******************************************
*/

describe("API Tasks", () => {
  it("Gets task number three", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34",
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.uuid).to.eq("5c3ec8bc-6099-4cd5-b6da-8e2956db3a34");
      expect(response.body.name).to.eq("Test generative AI");
      expect(response.body.description).to.eq(
        "Use generative AI technology to write a simple web service"
      );
      //Compare value of time in milliseconds since Epoch
      const millisecondsSinceEpoch = new Date(response.body.created).getTime();
      expect(millisecondsSinceEpoch).to.eq(
        new Date("2023-06-23T09:00:00Z").getTime()
      );
      cy.log(millisecondsSinceEpoch);
      expect(response.body.completed).to.eq(null);
      expect(response.body.complete).to.eq(false);
    });
  });
});
