// Get Endpoints Test Task 4


describe('API Test_Get: Get an non Completed task', () => {
    it('should retrieve a specific todo item', () => {
        // Send a GET request to the specified endpoint
        cy.request('GET', 'http://localhost:8080/todo/f360ba09-4682-448b-b32f-0a9e538502fa')
          .then((response) => {
        // Check if the HTTP status is 200 (OK)
            expect(response.status).to.eq(200);
        // Check the response body against the expected data
            expect(response.body.uuid).to.eq('f360ba09-4682-448b-b32f-0a9e538502fa');
            expect(response.body.name).to.eq('Walk the dog');
            expect(response.body.description).to.eq('Walk the dog for forty five minutes');
            expect(response.body.completed).to.eq(null);
            expect(response.body.complete).to.eq(false);
          });
      });
    });
  