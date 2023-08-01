//request to chat Gpt:
// write a cypress api test to obtain a list of all tasks and that it returns a response of 200 and that the length of the returned response is greater than zero. Then, write a cypress api test using a POST endpoint and check that the response is 201. Then add tests to check that the 'task id' is not null and that the 'message' field contains a message. Then write anothe cypress api test to retrieve the list of all tasks again and that a response of 200 is received. Another cypress api test should check that the length of the returned response is now increments by 1. Also check that the created task is not null or undefined for the UUID and that the fields name, description, created, completed and complete all contain the correct values. Checks should also be included to make sure the 'created' field was actually created within 5ms of submission and that the field 'completed' must not be null.

//Response from chat Gpt:

// describe("GET /tasks", () => {
//     it("should return a response of 200 and the length of the response should be greater than zero", () => {
//       cy.request("GET", "/tasks").then((response) => {
//         expect(response.status).to.eq(200);
//         expect(response.body.length).to.be.greaterThan(0);
//       });
//     });
//   });
  
// describe("POST /tasks", () => {
//     it("should return a response of 201", () => {
//       const taskData = {
//         // Provide the necessary task data in this object
//         name: "New Task",
//         description: "Task description",
//         // ...
//       };
  
//       cy.request("POST", "/tasks", taskData).then((response) => {
//         expect(response.status).to.eq(201);
//       });
//     });
  
//     it("should have a non-null 'task id' and the 'message' field should contain a message", () => {
//       const taskData = {
//         // Provide the necessary task data in this object
//         name: "New Task",
//         description: "Task description",
//         // ...
//       };
  
//       cy.request("POST", "/tasks", taskData).then((response) => {
//         expect(response.body.taskId).to.not.be.null;
//         expect(response.body.message).to.contain("message"); // Replace "message" with the expected message
//       });
//     });
//   });
  
// describe("GET /tasks after creation", () => {
//     it("should return a response of 200 and the length of the response should increment by 1", () => {
//       cy.request("GET", "/tasks").then((response) => {
//         const initialLength = response.body.length;
//         expect(response.status).to.eq(200);
  
//         const taskData = {
//           // Provide the necessary task data in this object
//           name: "New Task",
//           description: "Task description",
//           // ...
//         };
  
//         cy.request("POST", "/tasks", taskData);
  
//         cy.request("GET", "/tasks").then((response) => {
//           expect(response.status).to.eq(200);
//           expect(response.body.length).to.eq(initialLength + 1);
//         });
//       });
//     });
//   });
  
// describe("Task Details", () => {
//     let createdTaskId;
  
//     before(() => {
//       const taskData = {
//         // Provide the necessary task data in this object
//         name: "New Task",
//         description: "Task description",
//         // ...
//       };
  
//       cy.request("POST", "/tasks", taskData).then((response) => {
//         createdTaskId = response.body.taskId;
//       });
//     });
  
//     it("should have a non-null or undefined UUID and all fields should contain the correct values", () => {
//       cy.request("GET", `/tasks/${createdTaskId}`).then((response) => {
//         const task = response.body;
  
//         expect(task).to.not.be.null;
//         expect(task).to.not.be.undefined;
  
//         // Check that fields contain correct values (replace with actual expected values)
//         expect(task.name).to.eq("New Task");
//         expect(task.description).to.eq("Task description");
//         // ...
  
//         // Check that 'created' field was created within 5ms of submission
//         const createdTimestamp = new Date(task.created).getTime();
//         const submissionTime = new Date().getTime();
//         expect(submissionTime - createdTimestamp).to.be.lessThan(5);
  
//         // Check that 'completed' field is not null
//         expect(task.completed).to.not.be.null;
//       });
//     });
//   });
  
describe("POST Add Task 4", () => {
    //initial checks
    it("should return a response of 200 and the length of the response should be greater than zero when initially checking responses", () => {
      cy.request("GET", "http://localhost:8080/todo").then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.length).to.be.greaterThan(0);
      });
    });

    //add task
    it("should return a response of 201", () => {
              const taskData = {
                // Provide the necessary task data in this object
                name: "New Task",
                description: "Task description",
                // ...
              };
          
              cy.request("POST", "/tasks", taskData).then((response) => {
                expect(response.status).to.eq(201);
              });
        });
          
            it("should have a non-null 'task id' and the 'message' field should contain a message", () => {
              const taskData = {
                // Provide the necessary task data in this object
                name: "New Task",
                description: "Task description",
                // ...
              };
          
              cy.request("POST", "/tasks", taskData).then((response) => {
                expect(response.body.taskId).to.not.be.null;
                expect(response.body.message).to.contain("message"); // Replace "message" with the expected message
              });
        });
});

  
