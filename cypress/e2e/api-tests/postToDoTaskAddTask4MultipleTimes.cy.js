/// <reference types = "Cypress" />

/*
******************************************
IMPORTANT: This test can only be run if AddTask4 has NOT been run before

TASK OBJECTIVES:
- Check that List All Tasks is greater than or equal to 3
- Add 4 tasks 
- Check that the List All Tasks array contains four records relating to Task 4

Note: corresponding values do not need to be checked because this has been done already 
in the AddTask4 script.
******************************************
*/

describe("API Tasks", () => {
  it("Tests that adding a task multiple times populates the List All Tasks with multiple records", () => {
    function ProduceFourTasks() {
      for (let i = 0; i < 4; i++) {
        cy.request({
          method: "POST",
          url: "http://localhost:8080/todo/addTask?name=Task Four&description=Description Four",
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.taskId).to.not.be.null;
          cy.log("The UUID is: " + response.body.taskId);
          expect(response.body.message).to.eq(
            "Task Task Four added successfully."
          );
        });
      }
    }

    //Check that List All Tasks is greater than or equal to 3
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo",
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.be.gte(3);
        cy.log("The array length is: " + response.body.length);
      })
      .then((response) => {
        //Post four tasks using the function above
        ProduceFourTasks();
      })
      .then((response) => {
        //Check that List All Tasks contains four records relating to Task 4
        cy.request({
          method: "GET",
          url: "http://localhost:8080/todo",
        }).then((response) => {
          expect(response.status).to.eq(200);
          //Searching tasks in the list that match task name "Task Four"
          var createdTasks = response.body.filter((x) => x.name == "Task Four");
          expect(createdTasks.length).to.eq(4);
        });
      });
  });
});
