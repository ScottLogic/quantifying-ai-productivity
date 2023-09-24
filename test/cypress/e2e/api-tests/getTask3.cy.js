// Get Endpoints Test Task 3

describe('API Test_Get: Not Completed List', () => {
    it('Should make a GET request and check response for complete=false', () => {
      // Send a GET request to the specified endpoint
      cy.request('GET', 'http://localhost:8080/todo?complete=false').then((response) => {
        // Check if the HTTP status is 200 (OK)
        expect(response.status).to.eq(200);
  
        // Log the response body to the console
        cy.log('Response Body:', response.body);
  
        // Log the length of the array to the console
        cy.log(`Array Length: ${response.body.length}`);
      });
    });
  });
  