/// <reference types = "Cypress" />

/*
******************************************
IMPORTANT: This script can only be executed if Test 2 has NEVER been completed before.

TASK OBJECTIVES:
Check that completed list is equal to 0
Mark the test as completed
Check that the completed list is now equal to 1 and check the corresponding values
******************************************
*/

describe("API Tasks", () => {
  it("Tests that the completing a task populates the completed list", () => {
    //Check that the completed list is equal to 0
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=true",
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        //cy.log(JSON.stringify(response.body));
        expect(response.body.length).to.eq(0);
        cy.log("The array length is: " + response.body.length);
      })
      .then((response) => {
        //Mark the test as completed
        cy.request({
          method: "PUT",
          url: "http://localhost:8080/todo/completed/fd5ff9df-f194-4c6e-966a-71b38f95e14f",
        })
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.success).to.eq(true);
            expect(response.body.message).to.eq(
              "This task has now been completed."
            );
          })
          .then((response) => {
            //Check that the completed list is equal to 1 and check values
            cy.request({
              method: "GET",
              url: "http://localhost:8080/todo?complete=true",
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.length).to.eq(1);
              //cy.log("The array length is: " + response.body.length);

              //Check key value pairs
              expect(response.body[0].uuid).to.eq(
                "fd5ff9df-f194-4c6e-966a-71b38f95e14f"
              );
              expect(response.body[0].name).to.eq("Mow the lawn");
              expect(response.body[0].description).to.eq(
                "Mow the lawn in the back garden"
              );
              //Compare value of time in milliseconds since Epoch
              const millisecondsSinceEpoch = new Date(
                response.body[0].created
              ).getTime();
              expect(millisecondsSinceEpoch).to.eq(
                new Date("2023-06-23T09:00:00Z").getTime()
              );
              cy.log(millisecondsSinceEpoch);

              //Cannot test completed time as there will be milliseconds difference between
              //result and date time of now so just checking it is not null
              expect(response.body[0].completed).to.not.be.null;
              expect(response.body[0].complete).to.eq(true);
            });
          });
      });
  });
});
