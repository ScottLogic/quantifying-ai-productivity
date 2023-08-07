// createTask.spec.js

describe('Create Task Test', () => {
    it('should increase the response size by one after creating a new task', () => {
      let initialResponseSize;
      
        // Replace 'YOUR_CREATE_ENDPOINT_URL' with the actual URL of your endpoint to create tasks
      const createEndpointUrl = 'http://localhost:8080/todo/addTask?name=Task Four&description=Description Four';
  
      // Replace 'NEW_TASK_DATA' with the data you want to use for creating a new task (e.g., { name: 'Task Name', description: 'Task Description' })
      const newTaskData = {
        name: 'Task Four',
        description: 'Description Four',
      };

      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/todo',
      }).then((response) => {

        
         // Save the current response size
         initialResponseSize = response.body.length;

        // Assertion example: Check if the response status code is 200 (OK)
        expect(response.status).to.eq(200);
  
         // Check if the response contains at least one user
        expect(response.body).to.have.length.greaterThan(0);
      });
  
      // Send a request to create a new task
      cy.request({
        method: 'POST',
        url: createEndpointUrl,
        body: newTaskData,
      }).then((createResponse) => {
        // Check if the response status code is 201 (Created) for successful task creation
        expect(createResponse.status).to.eq(201);
  
        // Now, fetch the tasks again to get the updated list
        // Replace 'YOUR_FETCH_ENDPOINT_URL' with the actual URL of your endpoint to fetch tasks
        const fetchEndpointUrl = 'http://localhost:8080/todo';
  
        cy.request('GET', fetchEndpointUrl).then((fetchResponse) => {
          // Check if the response status code is 200 (OK) for successful fetch
          expect(fetchResponse.status).to.eq(200);
  
          // Check if the response size has increased by one after creating a new task
          const newSize = createResponse.body.length;
          expect(newSize).to.eq(initialResponseSize + 1);
        });
      });
    });
  });
  