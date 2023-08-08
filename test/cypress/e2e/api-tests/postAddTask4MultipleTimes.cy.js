// multiplePostRequests.spec.js

describe('Multiple POST Requests Test', () => {
    let initialRespSize;
    it('should send the POST request four times', () => {
      // Replace 'REQUEST_PAYLOAD' with the payload you want to send in the POST request
      const requestPayload = {
        name: 'Task Four',
        description: 'Description Four',
      };
  
        cy.request({
          method: 'POST',
          url: 'http://localhost:8080/todo/addTask?name=Task Four&description=Description Four',
          body: requestPayload,
        }).then((response) => {
          expect(response.status).to.eq(201); // Check if the response status code is 201 (Created)
          expect(response.body).to.have.property('taskId');
          expect(response.body.message).to.equal('Task Task Four added successfully.');
        });

        cy.request({
            method: 'GET',
            url: 'http://localhost:8080/todo',
          }).then((response) => {
       
             // Save the current response size
             initialResponseSize = response.body.length;
    
            // Assertion example: Check if the response status code is 200 (OK)
            expect(response.status).to.eq(200);
      
             // Check if the response contains at least one user
            expect(response.body).to.have.length.greaterThan(3);
    
            //To run POST API 4 times
            for (let i = 0; i < 4; i++) {
                cy.request('POST', 'http://localhost:8080/todo/addTask?name=Task Four&description=Description Four', requestPayload);
            }
      
          });

          cy.request({
            method: 'GET',
            url: 'http://localhost:8080/todo',
          }).then((response) => {
            // Assertion example: Check if the response status code is 200 (OK)
            expect(response.status).to.eq(200);
            
      
             // Check if the response size is increased by 1
             expect(response.body.length).to.equal(initialResponseSize + 4);
      
          });
      });
    });
  