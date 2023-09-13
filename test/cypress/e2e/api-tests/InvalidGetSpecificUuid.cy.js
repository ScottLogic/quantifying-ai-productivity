describe('Invalid Get Task By UUID', () => {
    it('Invalid UUID', () => {
      const invalidUUID = '1';
      cy.request({
        method: 'GET',
        url: `http://localhost:8080/todo/${invalidUUID}`,
        failOnStatusCode: false, 
      }).then((response) => {
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Bad Request');
      });
    });
});