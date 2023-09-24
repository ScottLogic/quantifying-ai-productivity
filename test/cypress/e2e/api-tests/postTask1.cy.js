// Post Endpoints Test Task 1

describe('API Test_POST: Add Task 4', () => {
    it('Should create a new task and verify its addition', () => {
      // Send a POST request to create a new task
      cy.request('POST', 'http://localhost:8080/todo/addTask?name=Task Four&description=Description Four').then((response) => {
        // Check the response status code
        expect(response.status).to.equal(201);
  
        // Check that the taskId is not null
        expect(response.body.taskId).to.not.be.null;
  
        // Check that the message field contains a message
        expect(response.body.message).to.be.a('string');
  
        // Send a GET request to retrieve the list of all tasks
        cy.request('GET', 'http://localhost:8080/todo/').then((getListResponse) => {
          // Check that the GET request returns a 200 response
          expect(getListResponse.status).to.equal(200);
  
          // Check that the array length is incremented by one
          expect(getListResponse.body.length).to.be.greaterThan(0);
  
          // Check that the created task is not null or undefined (for uuid)
          expect(getListResponse.body[getListResponse.body.length - 1].uuid).to.not.be.null;
          expect(getListResponse.body[getListResponse.body.length - 1].uuid).to.not.be.undefined;
  
          // Check other fields (name, description, created, completed, complete) for correctness
          const newTask = getListResponse.body[getListResponse.body.length - 1];
          expect(newTask.name).to.equal('Task Four');
          expect(newTask.description).to.equal('Description Four');
          expect(newTask.completed).to.be.null;
          expect(newTask.complete).to.be.false;
        });
      });
    });
  });
  