/// <reference types = "Cypress" />

/*
******************************************
IMPORTANT: This test can only be run if AddTask4 has NOT been run before

TASK OBJECTIVES:
- Check that List All Tasks is equal to 3
- Add 4 tasks 
- Check that the List All Tasks is now equal to 7

Note: corresponding values do not need to be checked because this has been done already 
in the AddTask4 script.
******************************************
*/

describe("API Tasks", () => {
  it("Tests that adding a task multiple times populates the List All Tasks with multiple records", () => {
    var uuid = null;

    //Check that the list all tasks is equal to 3
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo",
    })
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(3);
        cy.log("The array length is: " + response.body.length);
      })
      .then((response) => {
        //Add the task (making it 4)
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
            //Add the task (making it 5)
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
                //Add the task (making it 6)
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
                    //Add the task (making it 7)
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
                        //GET = Check that the List All Tasks array is equal to 7
                        cy.request({
                          method: "GET",
                          url: "http://localhost:8080/todo",
                        }).then((response) => {
                          expect(response.status).to.eq(200);
                          expect(response.body.length).to.eq(7);
                          cy.log(
                            "The array length is: " + response.body.length
                          );
                        });
                      });
                  });
              });
          });
      });
  });
});
