//request to ChatGpt:
//For a cypress api test, how can I write a PUT request to mark a task called 'Task 2' as complete?
//Response from ChatGpt:
//describe('Mark Task as Complete', () => {
//   it('should mark Task 2 as complete', () => {
//     // Assuming your API endpoint for updating tasks is: https://api.example.com/tasks
//     const apiEndpoint = 'https://api.example.com/tasks';

//     // Data for the task to be updated (assuming the task has an 'id' and 'name' property)
//     const taskToUpdate = {
//       id: 2, // Assuming 'Task 2' has an ID of 2
//       name: 'Task 2',
//       completed: true, // Set 'completed' property to 'true' to mark it as complete
//     };

//     // Send the PUT request to update the task
//     cy.request('PUT', apiEndpoint, taskToUpdate)
//       .then((response) => {
//         // Assert that the request was successful and returned a status code of 200
//         expect(response.status).to.equal(200);

//         // Optionally, you can add further assertions on the response body if needed
//         // For example, you could check that the updated task has the 'completed' property set to 'true'.
//         expect(response.body.completed).to.be.true;
//       });
//   });
// });


describe("Test Experiment GET Task 2", () => {
  it("should check response status is 200 and log response length", () => {
    cy.request({
      method: "GET",
      url: "http://localhost:8080/todo?complete=true", 
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(0)
    });
  });

  it("should give a response of 200 when a PUT request marks Task 2 as Complete", () => {
    //NEED TO FIND TASK 2 (BYUUID) AND MARK IT AS COMPLETE
    cy.request({
      method: "PUT",
      url: "http://localhost:8080/todo/fd5ff9df-f194-4c6e-966a-71b38f95e14f", 
    }).then((response) => {
      expect(response.status).to.equal(200);
      cy.log(response.body.length)
    });
  });
});
