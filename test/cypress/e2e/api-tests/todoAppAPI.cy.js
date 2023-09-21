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

    it('should get all completed tasks', () => {
      cy.request('http://localhost:8080/todo?complete').should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(3)
        })
      })
    
    it('should get all incompleted tasks', () => {
      cy.request('http://localhost:8080/todo?complete=false').should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(3)
        })
      })

    it('should get task number 3', () => {
      const taskUuid = '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34';
      cy.request(`http://localhost:8080/todo/${taskUuid}`).should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('uuid', taskUuid);
        expect(response.body).to.have.property('name', 'Test generative AI');
        expect(response.body).to.have.property('description', 'Use generative AI technology to write a simple web service');
      })
    })

    it('should search for tasks with name or description as "Unknown Task"', () => {
      const searchTerm = 'Unknown Task';
      cy.request('http://localhost:8080/todo').should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
  
        // Filter tasks that have name or description equal to the search term
        const matchingTasks = response.body.filter(
          (task) =>
            task.name === searchTerm || task.description === searchTerm
        );
  
        // Assert that at least one task matches the search criteria
        expect(matchingTasks.length).to.be.equal(0);
      })
    })

    it('should handle Invalid UUID', () => {
      const invalidUuid = 'invalid-uuid';
      cy.request({
        url: `http://localhost:8080/todo/${invalidUuid}`,
        failOnStatusCode: false, // Allow the test to continue even if the response status is not 2xx
      }).should((response) => {
        expect(response.status).to.equal(400); // Expecting a 400 Bad Request status code
  
        // Assert individual properties of the response body
        expect(response.body).to.have.property('timestamp').to.be.a('string');
        expect(response.body).to.have.property('status').to.equal(400);
        expect(response.body).to.have.property('error').to.equal('Bad Request');
        expect(response.body).to.have.property('path').to.equal('/todo/invalid-uuid');
        })
      })
  })