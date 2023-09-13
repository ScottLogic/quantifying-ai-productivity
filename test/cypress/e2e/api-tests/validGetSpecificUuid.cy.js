describe('Valid Get Task By UUID', () => {
    it('Valid UUID', () => {
      const validUUID = 'f360ba09-4682-448b-b32f-0a9e538502fa';
      cy.request('GET', `http://localhost:8080/todo/${validUUID}`).then((response) => {
        expect(response.status).to.equal(200);
        const task = response.body;
        expect(task.name).to.equal('Walk the dog');
        expect(task.description).to.equal('Walk the dog for forty five minutes');
      });
    });

  it('Invalid UUID but correct format', () => {
    cy.request('http://localhost:8080/todo/5c3ec8bc-6099-1a2b-b6da-8e2956db3a34')
      .should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('uuid');
        expect(response.body).to.have.property('name');
        expect(response.body).to.have.property('complete');
        expect(response.body.name).to.equal('Unknown Task');
        expect(response.body.complete).to.be.false;
      });
  });
});
  


  

  