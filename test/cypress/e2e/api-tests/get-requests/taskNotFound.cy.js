// Check response is 200 and check length of array
describe('Todo App API', () => {
    it('should get all tasks', () => {
      cy.request('http://localhost:8080/todo/00000000-0000-0000-0000-000000000000').should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('object')
        expect(response.body.uuid).to.equal('00000000-0000-0000-0000-000000000000')
        expect(response.body.name).to.equal('Unknown Task')
        expect(response.body.description).to.equal('Unknown Task')
        expect(response.body.created).to.equal('1970-01-01T00:00:00.000Z')
        expect(response.body.completed).to.equal(null)
        expect(response.body.complete).to.equal(false)
      })
    })
  })