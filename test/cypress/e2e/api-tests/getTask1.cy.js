// Get Endpoints Test Task 1

describe('API Test_Get: List All Tasks', () => {
    it('should return a 200 status code and log the array length', () => {
      // Send a GET request to your API endpoint
      cy.request('GET', 'http://localhost:8080/todo') // Replace with your API URL
        .then((response) => {
          // Verify the status code is 200
          expect(response.status).to.eq(200);
  
          // Log the length of the array to the console
          console.log('Array Length:', response.body.length);
        });
    });
  });
  