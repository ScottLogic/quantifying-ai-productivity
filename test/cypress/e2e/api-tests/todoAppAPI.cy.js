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
      // Define the UUID of the task you want to retrieve
      const taskUuid = '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34';
  
      cy.request(`http://localhost:8080/todo/${taskUuid}`).should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('uuid', taskUuid);
        expect(response.body).to.have.property('name', 'Test generative AI');
        expect(response.body).to.have.property('description', 'Use generative AI technology to write a simple web service');
      });
    });
  })