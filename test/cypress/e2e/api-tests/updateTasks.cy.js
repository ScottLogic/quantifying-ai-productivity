describe('Put: Complete Task 2', () => {
  it('should mark Task 2 as completed and verify completion time`', () => {
    const uuid = 'fd5ff9df-f194-4c6e-966a-71b38f95e14f';
    let beforeUpdateTime;
    let afterUpdateTime;

    cy.request('GET', 'http://localhost:8080/todo?complete=true').then(
      (getResponse) => {
        cy.fixture('tasks.json').then((tasks) => {
          const expectedData = tasks.find((task) => task.uuid === uuid);

          expect(getResponse.status).to.equal(200);
          expect(getResponse.body).to.be.an('array');
          expect(getResponse.body).to.have.lengthOf(0);

          // Record the current time before sending the PUT request
          beforeUpdateTime = Date.now();

          cy.request(
            'PUT',
            `http://localhost:8080/todo/completed/${uuid}`
          ).then((putResponse) => {
            expect(putResponse.status).to.equal(200);
            expect(putResponse.body).to.have.property('success', true);
            expect(putResponse.body)
              .to.have.property('message')
              .that.is.a('string').and.not.empty;

            // Record the current time after receiving the PUT response
            afterUpdateTime = Date.now();

            cy.request('GET', 'http://localhost:8080/todo?complete=true').then(
              (updatedGetResponse) => {
                expect(updatedGetResponse.status).to.equal(200);
                expect(updatedGetResponse.body).to.be.an('array');
                expect(updatedGetResponse.body).to.not.be.empty;

                const updatedTask = updatedGetResponse.body.find(
                  (task) => task.uuid === expectedData.uuid
                );
                expect(updatedTask).to.not.be.undefined;
                expect(updatedTask.uuid).to.equal(expectedData.uuid);
                expect(updatedTask.name).to.equal(expectedData.name);
                expect(updatedTask.description).to.equal(
                  expectedData.description
                );
                expect(updatedTask.created).to.equal(expectedData.created);

                // Parse the 'completed' property as a date object
                const completedDate = new Date(updatedTask.completed);

                // Check if the 'completed' property is within a 1-second margin of the PUT response time
                expect(completedDate).to.be.within(
                  new Date(beforeUpdateTime),
                  new Date(beforeUpdateTime + 1000)
                );
                expect(updatedTask.complete).to.equal(true);
              }
            );
          });
        });
      }
    );
  });
});

describe('Put: Complete Task 2 (Already Completed)', () => {
  it('should not mark Task 2 as completed again', () => {
    const uuid = 'fd5ff9df-f194-4c6e-966a-71b38f95e14f';

    // GET Completed Tasks and verify response
    cy.request('GET', 'http://localhost:8080/todo?complete=true').then(
      (getCompletedResponse) => {
        expect(getCompletedResponse.status).to.equal(200);
        expect(getCompletedResponse.body).to.be.an('array');
        expect(getCompletedResponse.body).to.have.lengthOf(1);

        // PUT: Mark Task 2 as complete and verify response
        cy.request('PUT', `http://localhost:8080/todo/completed/${uuid}`).then(
          (putResponse) => {
            expect(putResponse.status).to.equal(200);
            expect(putResponse.body).to.have.property('success', false);
            expect(putResponse.body)
              .to.have.property('message')
              .that.is.a('string').and.not.empty;

            // GET Completed Tasks again and verify response
            cy.request('GET', 'http://localhost:8080/todo?complete=true').then(
              (getCompletedResponseAgain) => {
                expect(getCompletedResponseAgain.status).to.equal(200);
                expect(getCompletedResponseAgain.body).to.be.an('array');
                expect(getCompletedResponseAgain.body).to.have.lengthOf(1);
              }
            );
          }
        );
      }
    );
  });
});

describe('Put: Task Not Found', () => {
  it('should return an error when trying to complete a non-existent task', () => {
    const uuid = '5c3ec8bc-6099-1a2b-b6da-8e2956db3a34';

    cy.request('PUT', `http://localhost:8080/todo/completed/${uuid}`).then(
      (putResponse) => {
        expect(putResponse.status).to.equal(200);
        expect(putResponse.body).to.have.property('success', false);
        expect(putResponse.body).to.have.property('message', 'Task not found.');
      }
    );
  });
});

describe('Put: Invalid UUID', () => {
  it('should return a 400 Bad Request for an invalid UUID', () => {
    const invalidUuid = 'invalid-uuid';

    cy.request({
      method: 'PUT',
      url: `http://localhost:8080/todo/completed/${invalidUuid}`,
      failOnStatusCode: false,
    }).then((putResponse) => {
      expect(putResponse.status).to.equal(400);
      expect(putResponse.body).to.have.property('error', 'Bad Request');
      expect(putResponse.body).to.have.property(
        'path',
        `/todo/completed/${invalidUuid}`
      );
    });
  });
});
