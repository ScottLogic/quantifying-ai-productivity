//Post Endpoints Test Task 5


describe('Create Task 4 Four Times', () => {
    let initialTasksLength = 0;
  
    before(() => {
      // Get the current list of tasks to check the initial length
      cy.request('GET', 'http://localhost:8080/todo/').then((response) => {
        initialTasksLength = response.body.length;
      });
    });
  
    it('Should create task 4 four times and check responses', () => {
      // Define a function to create a new task
      function createTask4() {
        return cy.request({
          method: 'POST',
          url: 'http://localhost:8080/todo/addTask?name=Task Four&description=Description Four',
        });
      }
  
      // Create task 4 four times and check the responses
      for (let i = 0; i < 4; i++) {
        createTask4().then((response) => {
          // Check that the response status code is 201 (Created)
          expect(response.status).to.equal(201);
  
          // Check that taskId is not null
          expect(response.body.taskId).to.not.be.null;
  
          // Check that the message field produces a message
          expect(response.body.message).to.be.a('string');
  
          // Log the message from the response
          cy.log(response.body.message);
        });
      }
    });
  
    it('Should verify that the list of tasks has increased by 4', () => {
      // Get the list of all tasks again
      cy.request('GET', 'http://localhost:8080/todo/').then((response) => {
        // Check that the response code is 200 (OK)
        expect(response.status).to.equal(200);
  
        // Check that the response body length has increased by 4
        expect(response.body.length).to.equal(initialTasksLength + 4);
      });
    });
  });
  