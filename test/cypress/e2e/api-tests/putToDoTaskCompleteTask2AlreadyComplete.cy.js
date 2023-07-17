/// <reference types = "Cypress" />

/*
******************************************
IMPORTANT: 
This script can only be executed if Test 2 has ALREADY been executed.

TASK OBJECTIVES:
- Check that completed list is equal to 1
- Mark the test as completed
- Check that the completed list is still equal to 1
Note: there is no need to check the values as this is completed in a previous script
******************************************
*/

describe("API Tasks", () => {
  it("Tests that a completed task cannot be completed again", () => {
    //Check that the completed list is equal to 1
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=true",
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(1);
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
            expect(response.body.success).to.eq(false);
            expect(response.body.message).to.eq(
              "Task already marked complete."
            );
          })
          .then((repsonse) => {
            //Check that the completed list is still equal to 1
            cy.request({
              method: "GET",
              url: "http://localhost:8080/todo?complete=true",
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.length).to.eq(1);
            });
          });
      });
  });
});
