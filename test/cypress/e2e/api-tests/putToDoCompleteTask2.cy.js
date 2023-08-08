// completeTask.spec.js

describe('Complete Task Test', () => {
    it('should mark task 2 as completed', () => {
      // Replace 'YOUR_TASK_ID' with the actual task ID for 'task 2'
      const taskId = 'f360ba09-4682-448b-b32f-0a9e538502fa';
        
      //Get the response of Task 2 which is already completed
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/todo?complete=true`,
       
      }).then((response) => {
        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
        // Check if the response contains at least one user
        expect(response.body).to.have.length.greaterThan(0);
      });
    

      // Send the request to mark the task as completed
      cy.request({
        method: 'PUT',
        url: `http://localhost:8080/todo/completed/${taskId}`,
        failOnStatusCode: false,
        
      }).then((response) => {
        expect(response.status).to.eq(200); // Check if the response status code is 200 (OK)
        expect(response.body).to.have.property('success',true);
        expect(response.body).to.have.property('message','This task has now been completed.');
        
        // Now, fetch the updated task to verify its completion status
        // Replace 'YOUR_GET_TASK_ENDPOINT_URL' with the actual URL of your GET endpoint for tasks
        const getTaskEndpointUrl = `http://localhost:8080/todo?complete=true`;
  
        cy.request({
            method: 'GET', 
            url: getTaskEndpointUrl
        }).then((response) => {
          // Check if the response status code is 200 (OK)
          expect(response.status).to.eq(200);

          expect(response.body[1]).to.have.property('uuid','f360ba09-4682-448b-b32f-0a9e538502fa');
          expect(response.body).to.have.property('name','Walk the dog');
          expect(response.body).to.have.property('description','Walk the dog for forty five minutes');
          expect(response.body).to.have.property('created','2023-06-23T09:30:00Z');
          expect(response.body).to.have.property('completed','2023-07-27T13:38:12.280Z');
          expect(response.body).to.have.property('complete',true);
        
        });
      });
    });
  });
  