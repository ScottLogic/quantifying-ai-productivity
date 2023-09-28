//example Cypress API tests generated using Google Bard
describe('Todo App API', () => {
    it('should get all tasks', () => {
      cy.request('http://localhost:8080/todo').should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(3)
      })
    })
  
    it('should get a specific task by uuid', () => {
      const taskId = 'f360ba09-4682-448b-b32f-0a9e538502fa'
      cy.request('http://localhost:8080/todo/' + taskId).should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('uuid', taskId)
        expect(response.body).to.have.property('name', 'Walk the dog')

      })
    })
  })

  //JS ChatGPT
  describe('Tests on data', () => {
    it('Status code is 200', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/todo/',
      }).then((response) => {
        expect(response.status).to.equal(200);
      });
    });
  
    it('Data Comparison for GET task not found', () => {
      const expected = {
        uuid: '00000000-0000-0000-0000-000000000000',
        name: 'Unknown Task',
        description: 'Unknown Task',
        created: '1970-01-01T00:00:00Z',
        completed: null,
        complete: false,
      };
  
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/todo/', // Replace with your API endpoint
      }).then((response) => {
        const jsonData = response.body;
        expect(jsonData.uuid).to.not.equal(expected.uuid);
        expect(jsonData.name).to.not.equal(expected.name);
        expect(jsonData.description).to.not.equal(expected.description);
        expect(new Date(jsonData.created).getTime()).to.not.equal(new Date(expected.created).getTime());
        expect(jsonData.completed).to.not.equal(expected.completed);
        expect(jsonData.complete).to.not.equal(expected.complete);
      });
    });
});

describe('Put request tests', () => {
  it('Data Comparison for PUT task completion', () => {
    const expectedOutcome = {
      success: true,
      message: 'This task has now been completed.',
    };

    // Make a PUT request to your API endpoint
    cy.request({
      method: 'PUT',
      url: 'http://localhost:8080/todo/completed/fd5ff9df-f194-4c6e-966a-71b38f95e14f', // Replace with your API endpoint
      body: {
        // Include the request payload if needed
      },
    }).then((response) => {
      const jsonData = response.body;
      expect(jsonData.success).to.equal(expectedOutcome.success);
      expect(jsonData.message).to.equal(expectedOutcome.message);

    });
  });
});

  
