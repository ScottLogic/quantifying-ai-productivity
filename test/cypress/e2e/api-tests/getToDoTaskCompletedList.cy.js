describe('GET endpoint for completed tasks', () => {
    it('returns the correct list of completed tasks', () => {
      // Replace 'YOUR_ENDPOINT_URL' with the actual URL of your GET endpoint for completed tasks
        cy.request({
			method: 'GET',
			url: 'http://localhost:8080/todo?complete=true'
		}).then((response) => {
            expect(response.status).to.eq(200); // Check if the response status is 200 (OK)
  
        // Assuming the response body contains an array of tasks with a 'completed' property
        // Replace 'completed' with the actual property name returned by your endpoint
        //const completedTasks = response.body.filter((task) => task.completed === true);
  
        // Assuming you have a completedTasks array with the filtered tasks
        expect(response.body).to.have.length.greaterThan(0); // Check that there are completed tasks
        cy.log('Response length: ', response.body.length);
    });
    });
  });