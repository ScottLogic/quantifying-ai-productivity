/**
 * Scenarios covered : Put - Complete Task 2
 *  1. Get the list of completed tasks and check that the response code is 200 and that the length
       of the array is equal to 0.
    2. Using a PUT request mark task 2 complete.  Check that the response code is 200, success is 
       true and message has a populated message.
    3. Get the list of completed tasks and check that the response code is 200 and the array has 
       been populated.  Check uuid, name, description, created, completed and complete contain the correct values
 */

describe("Put complete task 2", () => {
  it("PUT complete task -2", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=true",
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(0);
      })
      .then((response) => {
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
            cy.request({
              method: "GET",
              url: "http://localhost:8080/todo?complete=true",
            }).then((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.length).to.eq(1);
              cy.log("The array length is: " + response.body.length);
              expect(response.body[0].uuid).to.eq(
                "fd5ff9df-f194-4c6e-966a-71b38f95e14f"
              );
              expect(response.body[0].name).to.eq("Mow the lawn");
              expect(response.body[0].description).to.eq(
                "Mow the lawn in the back garden"
              );
            });
          });
      });
  });
});
