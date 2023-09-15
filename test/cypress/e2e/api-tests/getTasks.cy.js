describe('GET all tasks', () => {
  it('Return an array of all tasks, and have HTTP status code 200', () => {
    cy.request('GET', 'http://localhost:8080/todo').then((response) => {
      response.body.forEach((item) => {
        expect(item).to.have.property('uuid');
        expect(item).to.have.property('name');
        expect(item).to.have.property('description');
        expect(item).to.have.property('created');
        expect(item).to.have.property('completed');
        expect(item).to.have.property('complete');
      });
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.length(3);
      cy.logApiRequestGET('GET', 'http://localhost:8080/todo');
    });
  });
});

describe('GET tasks by property "complete"', () => {
  it('Return an array of COMPLETE tasks, and have HTTP status 200', () => {
    cy.request('GET', 'http://localhost:8080/todo?complete=true').then(
      (response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');

        if (response.body.length > 0) {
          response.body.forEach((item) => {
            expect(item).to.have.property('complete', true);
          });
        }
        cy.logApiRequestGET('GET', 'http://localhost:8080/todo?complete=true');
      }
    );
  });

  it('Return an array of INCOMPLETE tasks, and have HTTP status 200', () => {
    cy.request('GET', 'http://localhost:8080/todo?complete=false').then(
      (response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');

        if (response.body.length > 0) {
          response.body.forEach((item) => {
            expect(item).to.have.property('complete', false);
          });
        }
        cy.logApiRequestGET('GET', 'http://localhost:8080/todo?complete=false');
      }
    );
  });
});
