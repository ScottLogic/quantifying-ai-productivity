// Get Endpoints Test Task 2

describe('API Test_Get: Completed List', () => {
    it('Should make a GET request and check response', () => {
      // Send a GET request to the specified endpoint
      cy.request('GET', 'http://localhost:8080/todo?complete=true').then((response) => {
        // Check if the HTTP status is 200 (OK)
        expect(response.status).to.eq(200);
  
        // Log the response body to the console
        cy.log('Response Body:', response.body);
  
        // Log the length of the array to the console
        cy.log(`Array Length: ${response.body.length}`);
      });
    });
  });
  