/**
 * Scenarios covered : Post - Add Task 4 Multiple Times
 * 1. Create a Post request using a function that allows a new task (task 4) to
 *    be added 4 times.  Check that a 201 response code is returned. Check that the
 *    taskId is not null and check that the message field produces a message each time it is added.
 * 2. Get a list of all tasks and check that the response code is 200 and that the response body is
 *    greater than 3.  Create a variable to check the current size of the array and then call the function
 *    to create 4 tasks.
 * 3. Get a list of all tasks (again) and check the response code is 200 and that the array count
 *    has added the 4 tasks.
 */

describe("Post - Add task 4 multiple times", () => {
  it("Post - Add task 4 multiple times", () => {
    let currentSize = 0;
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo",
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.be.gte(3);
        cy.log("The array length is: " + response.body.length);
        currentSize = response.body.filter((x) => x.name == "Task Four").length;
      })
      .then((response) => {
        generateTaskFourTimes();
      })
      .then((response) => {
        cy.request({
          method: "GET",
          url: "http://localhost:8080/todo",
        }).then((response) => {
          expect(response.status).to.eq(200);
          var createdTasks = response.body.filter((x) => x.name == "Task Four");
          expect(createdTasks.length).to.eq(currentSize + 4);
        });
      });

    function generateTaskFourTimes() {
      for (let i = 0; i < 4; i++) {
        cy.request({
          method: "POST",
          url: "http://localhost:8080/todo/addTask?name=Task Four&description=This is Description Four",
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.taskId).to.not.eq(null);
          cy.log("The UUID is: " + response.body.taskId);
          expect(response.body.message).to.eq(
            "Task Task Four added successfully."
          );
        });
      }
    }
  });
});
