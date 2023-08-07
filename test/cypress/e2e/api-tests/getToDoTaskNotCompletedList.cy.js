describe('GET endpoint for not completed tasks', () => {
    it('returns the correct list of not completed tasks', () => {
      // Replace 'YOUR_ENDPOINT_URL' with the actual URL of your GET endpoint for completed tasks
        cy.request({
			method: 'GET',
			url: 'http://localhost:8080/todo?complete=false'
		}).then((response) => {
            expect(response.status).to.eq(200); // Check if the response status is 200 (OK)

        // Assuming you have a not completedTasks array with the filtered tasks
        expect(response.body).to.have.length.greaterThan(0); // Check that there are completed tasks
        cy.log('Response length: ', response.body.length);
    });
    });
  });