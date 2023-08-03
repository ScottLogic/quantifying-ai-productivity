// Check response is 200 and check length of array
describe('Todo App API', () => {
    it('should get all tasks', () => {
      cy.request('http://localhost:8080/todo/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34').should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('object')
        expect(response.body.uuid).to.equal('5c3ec8bc-6099-4cd5-b6da-8e2956db3a34')
        expect(response.body.name).to.equal('Test generative AI')
        expect(response.body.description).to.equal('Use generative AI technology to write a simple web service')
        expect(response.body.created).to.equal('2023-06-23T09:00:00Z')
        expect(response.body.completed).to.equal(null)
        expect(response.body.complete).to.equal(false)
      })
    })
  })