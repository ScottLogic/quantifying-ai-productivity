/**
 * Scenarios covered : Put - Complete Task 2 (Already Completed)
 *  1. Get the list of completed tasks and check that the response code is 200 and that
 *     the length of the array is equal to 1.
    2. Using a PUT request mark task 2 complete.  Check that the response code is 200, 
       success is false and message has a populated message.
    3. Get the list of completed tasks and check that the response code is 200 and the 
       array length is 1.
 */

describe("Put complete task 2 Already completed", () => {
  it("PUT complete task 2 Already completed", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=true",
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(1);
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
          .then((repsonse) => {
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
