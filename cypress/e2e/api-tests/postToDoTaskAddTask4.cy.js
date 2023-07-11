/// <reference types = "Cypress" />

const { create } = require("combined-stream");

/*
******************************************
IMPORTANT: This script can only be executed if Test 2 has NEVER been completed before.

TASK OBJECTIVES:
Check that list all tasks is equal to 3
Add a task and check the data
Check that the list all tasks is now equal to 4 and check the corresponding values
******************************************
*/

describe("API Tasks", () => {
  it("Tests that adding a task populates the list all tasks", () => {
    var uuid = null;

    //Check that the list all tasks is equal to 3
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo",
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.be.greaterThan(0);
        cy.log("The array length is: " + response.body.length);
      })
      .then((response) => {
        //Add the task
        cy.request({
          method: "POST",
          url: "http://localhost:8080/todo/addTask?name=Task Four&description=Description Four",
        })
          .then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.taskId).to.not.be.null;
            uuid = response.body.taskId;
            cy.log("The UUID is: " + uuid);
            expect(response.body.message).to.eq(
              "Task Task Four added successfully."
            );
          })
          .then((response) => {
            //Check that the list all tasks is equal to 4
            cy.request({
              method: "GET",
              url: "http://localhost:8080/todo",
            }).then((response) => {
              expect(response.status).to.eq(200);
              //Check key value pairs
              //Assigns the UUID as null -> changes it in post -> check that whatever is in
              //the post is now in the response body.  Then we find the related field values
              var createdTask = response.body.find((x) => x.uuid == uuid);
              cy.log(createdTask.uuid);
              expect(createdTask).to.not.be.null;
              expect(createdTask).to.not.be.undefined;
              expect(createdTask.name).to.eq("Task Four");
              expect(createdTask.description).to.eq("Description Four");
              //Comparing created time with actual response and do comparison that it is within now and 5 seconds ago
              var createdSeconds =
                new Date(createdTask.created).getTime() / 1000;
              cy.log(createdSeconds);
              var nowSeconds = new Date().getTime() / 1000;
              cy.log(nowSeconds);
              expect(
                createdSeconds < nowSeconds && createdSeconds > nowSeconds - 5
              ).to.be.true;

              expect(createdTask.completed).to.be.null;
              expect(createdTask.complete).to.eq(false);
            });
          });
      });
  });
});
