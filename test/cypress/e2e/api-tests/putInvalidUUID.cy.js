describe('PUT API Test Suite', () => {
    it('should update user information via PUT request', () => {
     cy.request({
        method: 'PUT',
        url: 'http://localhost:8080/todo/completed/invalid-uuid',
        failOnStatusCode: false,
      
         }).then((response) => {
         // Extract the timestamp from the API response
          const actualTimestampMillis =response.body.timestamp;

        // Assertion example: Check if the response status code is 400 (Bad Request)
        expect(response.status).to.eq(400);
        expect(response.body).to.have.property('timestamp',actualTimestampMillis);
        expect(response.body).to.have.property('error','Bad Request');
        expect(response.body).to.have.property('path','/todo/completed/invalid-uuid');
      });
    });
});