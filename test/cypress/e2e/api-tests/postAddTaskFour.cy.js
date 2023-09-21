/**
 * Scenarios covered : Post - Add Task 4
 *  1.  Get the list of all tasks and check that it returns a 200 response body and 
       that the array is greater than 0.
    2. Create a new task (task 4) using Post endpoint.  Check that a
       201 response code is returned.  Check that the taskId is not null and check
       that the message field produces a message.
    3. Get the list of all tasks again, check that it returns a 200 response code 
       and that the array length is incremented by one. 
    4. In addition, check that the created task is not null or undefined (for uuid),
       and other fields name description created completed complete contain the correct values 
 */

describe("Post Add task 4", () => {
  it("POST - Add task 4", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo",
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        cy.log("Array length is : " + response.body.length);
        expect(response.body.length).to.be.greaterThan(0);
      })
      .then((response) => {
        cy.request({
          method: "POST",
          url: "http://localhost:8080/todo/addTask?name=Task Four&description=This is Description Four",
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.taskId).to.not.eq(null);
          const uuid = response.body.taskId;
          cy.log("The UUID is: " + uuid);
          expect(response.body.message).to.eq(
            "Task Task Four added successfully."
          );
        });
      });
  });
});
