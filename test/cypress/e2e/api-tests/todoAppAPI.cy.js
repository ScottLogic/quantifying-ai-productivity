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