describe('GET endpoint for tasks', () => {
	it('should return the correct list of tasks', () => {
	// Replace 'YOUR_ENDPOINT_URL' with the actual URL of your GET endpoint for tasks
		cy.request({
			method: 'GET',
			url: 'http://localhost:8080/todo'
		}).then((response) => {
			expect(response.status).to.eq(200); // Check if the response status is 200 (OK)

		// Assuming the response body contains an array of tasks with properties like 'id', 'title', and 'description'
		// Replace these properties with the actual properties returned by your endpoint
			expect(response.body[0]).to.have.property('uuid');
			expect(response.body[0]).to.have.property('name');
		});
	});
});
