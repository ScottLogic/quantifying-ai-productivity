describe('Create new task', () => {
  it('should create a new task with the given name and description', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/todo/addTask',
      qs: {
        name: 'Use Gen Ai',
        description: 'test with gen AI'
      }
    })
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('taskId');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.match(/Task Use Gen Ai added successfully/);
        expect(response.body.taskId).not.to.be.null;

        // Get the taskId from the previous request
        const taskId = response.body.taskId;

        // Send a GET request to the taskId
        cy.request('http://localhost:8080/todo/' + taskId)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('description');
            expect(response.body.name).to.equal('Use Gen Ai');
            expect(response.body.description).to.equal('test with gen AI');
          });
      });
  });
});
describe('Validate created timestamp', () => {
    it('should match the time the request was sent', () => {
      const requestTime = new Date().toISOString();
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask',
        qs: {
          name: 'Time Test',
          description: 'This task will check the created timestamp is allocated correctly'
        }
      })
        .then((response) => {
          // Get the taskId from the previous request
          const taskId = response.body.taskId;
          const nowWithoutMs = requestTime.slice(0,19);
        
  
          // Send a GET request to the taskId
          cy.request('http://localhost:8080/todo/' + taskId)
            .then((response) => {
              expect(response.status).to.equal(200);
              cy.log(response)
              expect(response.body.uuid).to.equal(taskId);
              expect(response.body).to.have.property('created');
              
              expect(response.body.created.slice(0,19)).to.equal(nowWithoutMs);
            });
        });
    });
  });
  