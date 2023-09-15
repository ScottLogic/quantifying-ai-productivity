describe('GET all tasks', () => {
  afterEach(() => {
    // Log the API response before each test
    cy.logApiResponse('http://localhost:8080/todo');
  });

  it('should return an array of objects with a status code of 200', () => {
    cy.request('GET', 'http://localhost:8080/todo').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');

      response.body.forEach((item) => {
        expect(item).to.have.property('uuid');
        expect(item).to.have.property('name');
        expect(item).to.have.property('description');
        expect(item).to.have.property('created');
        expect(item).to.have.property('completed');
        expect(item).to.have.property('complete');
      });
    });
  });
});
