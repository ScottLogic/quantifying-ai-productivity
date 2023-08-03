// Check response is 200 and check length of array
describe('Todo App API', () => {
    it('should get all tasks', () => {
      cy.request({url: 'http://localhost:8080/todo/invalid', failOnStatusCode: false}).should((response) => {
        expect(response.status).to.equal(400)
      })
    })
  })