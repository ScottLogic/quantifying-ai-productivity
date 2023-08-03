//request to ChatGpt:
//For a cypress api test, create a POST request that uses a function that allows a new task called 'Task 4' to be added 4 times. There should be a check to check the response status is 201. There should be a check to check the taskId is not null. There should be a check that the 'message' field produces a message each time Task 4 is added

//response from ChatGpt: (Part 1)
//describe('Add Task API Test', () => {
    // it('should add Task 4 four times', () => {
    //     cy.visit('/'); // Assuming you need to visit a specific page first
    
    //     // Perform the POST request 4 times and check the response
    //     for (let i = 0; i < 4; i++) {
    //       cy.request({
    //         method: 'POST',
    //         url: 'https://api.example.com/tasks',
    //         body: {
    //           taskName: 'Task 4',
    //         },
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //       }).then((response) => {
    //         // Check the response status is 201
    //         expect(response.status).to.equal(201);
    
    //         // Check taskId is not null
    //         expect(response.body.taskId).not.to.be.null;
    
    //         // Check the message field contains the expected message
    //         expect(response.body.message).to.contain('Task 4');
    //       });
    //     }
    //   });
    // });

//request to ChatGpt: (Part 2)
//following on from this, get a list of all tasks and check the response is 200 and that the response body is greater than 3. Create a variable to check the current size of the array and then call the function to create 4 tasks
//response from ChatGpt: (Part 2)
//describe('Add Task API Test', () => {
//     let initialTasksCount;

//     beforeEach(() => {
//       // Get the initial count of tasks before adding new ones
//       cy.request('GET', 'https://api.example.com/tasks').then((response) => {
//         expect(response.status).to.equal(200);
//         initialTasksCount = response.body.length;
//       });
//     });
  
//     it('should add Task 4 four times', () => {
//       cy.visit('/'); // Assuming you need to visit a specific page first
  
//       // Perform the POST request 4 times and check the response
//       for (let i = 0; i < 4; i++) {
//         cy.request({
//           method: 'POST',
//           url: 'https://api.example.com/tasks',
//           body: {
//             taskName: 'Task 4',
//           },
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         }).then((response) => {
//           // Check the response status is 201
//           expect(response.status).to.equal(201);
  
//           // Check taskId is not null
//           expect(response.body.taskId).not.to.be.null;
  
//           // Check the message field contains the expected message
//           expect(response.body.message).to.contain('Task 4');
//         });
//       }
//     });
  
//     it('should get a list of all tasks and check response body size is greater than 3', () => {
//       cy.request('GET', 'https://api.example.com/tasks').then((response) => {
//         // Check the response status is 200
//         expect(response.status).to.equal(200);
  
//         // Check the response body size is greater than 3
//         expect(response.body.length).to.be.greaterThan(3 + initialTasksCount);
//       });
//     });
//   });
  

    describe('POST add Task 5', () => {
        it('should add Task 4 four times', () => {
                
          // Perform the POST request 4 times and check the response
          for (let i = 0; i < 4; i++) {
            cy.request({
              method: 'POST',
              url: 'http://localhost:8080/todo/addTask?name=Task 4&description=Description of Task 4',}).

            then((response) => {
              // Check the response status is 201
              expect(response.status).to.equal(201);
      
              // Check taskId is not null
              expect(response.body.taskId).not.to.be.null;
      
              // Check the message field contains the expected message
              expect(response.body.message).to.contain('Task Task 4 added successfully.');
            });
          }
        });
      });
      
    
