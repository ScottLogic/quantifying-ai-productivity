//Post Endpoints Test Task 3

describe('API Test_POST: Missing Description', () => {
    it('Should return a 400 response with correct error message and path', () => {
      // Send a POST request to create a task with a task name but missing description
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask?name=Missing Description',
        failOnStatusCode: false, // Allows us to check the response even if it's an error
        body: {
          // Missing description
        },
      }).then((response) => {
        // Check that the response status code is 400 (Bad Request)
        expect(response.status).to.equal(400);
  
        // Check that the timestamp is within 5 seconds of creation
        const currentTime = new Date().getTime();
        const responseTime = new Date(response.body.timestamp).getTime();
        const timeDifference = Math.abs(currentTime - responseTime);
        expect(timeDifference).to.be.lessThan(5000); // 5 seconds in milliseconds
  
        // Check that the error and path fields contain the correct values
        expect(response.body.error).to.equal('Bad Request');
        expect(response.body.path).to.equal('/todo/addTask?name=Missing%20Description');
      });
    });
  });
  