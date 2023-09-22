import chai from 'chai';
import chaiDatetime from 'chai-datetime';

chai.use(chaiDatetime);

//example Cypress API tests generated using Google Bard
describe('Todo App API', () => {
    let task4Uuid; '5606433b-edea-498d-b6e4-ba5a9d25ae89';
    it('should get all tasks', () => {
      cy.request('http://localhost:8080/todo').should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(3)
      })
    })
  
    it('should get a specific task by uuid', () => {
      const taskId = 'f360ba09-4682-448b-b32f-0a9e538502fa'
      cy.request('http://localhost:8080/todo/' + taskId).should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.have.property('uuid', taskId)
        expect(response.body).to.have.property('name', 'Walk the dog')
      })
    })

//example Cypress API tests generated using ChatGPT
    it('should get all completed tasks', () => {
      cy.request('http://localhost:8080/todo?complete=true').should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(0)
      })
    })
    
    it('should get all incompleted tasks', () => {
      cy.request('http://localhost:8080/todo?complete=false').should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(3)
      })
    })

    it('should get Task number 3', () => {
      const taskUuid = '5c3ec8bc-6099-4cd5-b6da-8e2956db3a34';
      cy.request(`http://localhost:8080/todo/${taskUuid}`).should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('uuid', taskUuid);
        expect(response.body).to.have.property('name', 'Test generative AI');
        expect(response.body).to.have.property('description', 'Use generative AI technology to write a simple web service');
      })
    })

    it('should search for tasks with name or description as "Unknown Task"', () => {
      const searchTerm = 'Unknown Task';
      cy.request('http://localhost:8080/todo').should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
  
        // Filter tasks that have name or description equal to the search term
        const matchingTasks = response.body.filter(
          (task) =>
            task.name === searchTerm || task.description === searchTerm
        );
  
        // Assert that at least one task matches the search criteria
        expect(matchingTasks.length).to.be.equal(0);
      })
    })

    it('should handle Invalid UUID', () => {
      const invalidUuid = 'invalid-uuid';
      cy.request({
        url: `http://localhost:8080/todo/${invalidUuid}`,
        failOnStatusCode: false, // Allow the test to continue even if the response status is not 2xx
      }).should((response) => {
        expect(response.status).to.equal(400);
  
        // Assert individual properties of the response body
        expect(response.body).to.have.property('timestamp').to.be.a('string');
        expect(response.body).to.have.property('status').to.equal(400);
        expect(response.body).to.have.property('error').to.equal('Bad Request');
        expect(response.body).to.have.property('path').to.equal('/todo/invalid-uuid');
        })
      })

    it('should complete Task number 2', () => {
      const task2Uuid = 'fd5ff9df-f194-4c6e-966a-71b38f95e14f';
    
      // Send a GET request to verify that there are no completed tasks initially
      cy.request('http://localhost:8080/todo/?complete=true').then((initialResponse) => {
        expect(initialResponse.status).to.equal(200);
        expect(initialResponse.body).to.be.an('array');
        expect(initialResponse.body).to.have.length(0);
    
      // Send a PUT request to complete Task number 2
      cy.request({
        method: 'PUT',
        url: `http://localhost:8080/todo/completed/${task2Uuid}`,
        body: {
          complete: true,
        },
      }).then((completeResponse) => {
        expect(completeResponse.status).to.equal(200);
        expect(completeResponse.body).to.have.property('success', true);
        expect(completeResponse.body).to.have.property('message', 'This task has now been completed.');

      cy.wait(1000);

      // Send a GET request to retrieve completed tasks
      cy.request('http://localhost:8080/todo?complete=true').then((completedResponse) => {
        expect(completedResponse.status).to.equal(200);
        expect(completedResponse.body).to.be.an('array').and.to.not.be.empty;

        const task2 = completedResponse.body.find((task) => task.uuid === task2Uuid);
        expect(task2).to.exist;

        // Check task properties
        expect(task2.uuid).to.equal(task2Uuid);
        expect(task2.name).to.equal('Mow the lawn');
        expect(task2.description).to.equal('Mow the lawn in the back garden');
        expect(task2.created).to.equal('2023-06-23T09:00:00Z');
        expect(task2.completed).to.not.be.null;
        expect(task2.complete).to.be.true;
          })
        })
      })
    })

    it('should complete already completed Task number 2', () => {
      const task2Uuid = 'fd5ff9df-f194-4c6e-966a-71b38f95e14f';

      cy.request('http://localhost:8080/todo/?complete=true').then((initialResponse) => {
        expect(initialResponse.status).to.equal(200);
        expect(initialResponse.body).to.be.an('array');
        expect(initialResponse.body).to.have.length(1);

      cy.request({
        method: 'PUT',
        url: `http://localhost:8080/todo/completed/${task2Uuid}`,
        body: {
          complete: true,
        },
      }).then((completeResponse) => {
        expect(completeResponse.status).to.equal(200);
        expect(completeResponse.body).to.have.property('success', false);
        expect(completeResponse.body).to.have.property('message', 'Task already marked complete.');

      cy.wait(1000);

      cy.request('http://localhost:8080/todo?complete=true').then((completedResponse) => {
        expect(completedResponse.status).to.equal(200)
        expect(completedResponse.body).to.be.an('array')
        expect(completedResponse.body).to.have.length(1)
          })
        })
      })
    })

    it('should handle Task Not Found on PUT request', () => {
      const nonExistentTaskUuid = '5c3ec8bc-6099-1a2b-b6da-8e2956db3a34'; 
      cy.request({
        method: 'PUT',
        url: `http://localhost:8080/todo/completed/${nonExistentTaskUuid}`,
        body: {
          complete: true,
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('success', false);
        expect(response.body).to.have.property('message', 'Task not found.');
      })
    })
    it('should handle invalid UUID PUT request', () => {
      const invalidUuid = 'invalid-uuid';
    
      cy.request({
        method: 'PUT',
        url: `http://localhost:8080/todo/completed/${invalidUuid}`,
        body: {
        
        },
        failOnStatusCode: false,
      }).should((response) => {
        expect(response.status).to.equal(400); 
        expect(response.body).to.have.property('error', 'Bad Request');
        expect(response.body).to.have.property('path', `/todo/completed/${invalidUuid}`);
      })
    })

    it('should add Task 4', () => {
      cy.request('GET', 'http://localhost:8080/todo').should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length.gt(0);
      });

      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask?name=Task Four&description=Description Four',
        body: {
          name: 'Task Four',
          description: 'Description Four',
        },
      }).should((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('taskId').not.to.be.null;
        expect(response.body).to.have.property('message').to.be.a('string');
        task4Uuid = response.body.taskId; // Store the task 4 UUID for later use
      });

      cy.request('GET', 'http://localhost:8080/todo').should((response) => {
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
        expect(response.body).to.have.length.gt(0);
  
        const task4 = response.body.find((task) => task.uuid === task4Uuid);
        expect(task4).to.exist;
        expect(task4.uuid).to.equal(task4Uuid);
        expect(task4.name).to.equal('Task Four');
        expect(task4.description).to.equal('Description Four');
        const createdTime = new Date(task4.created).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - createdTime;
        expect(timeDifference).to.be.within(0, 5000);
        expect(task4.completed).to.be.null;
        expect(task4.complete).to.be.false;
      })
    })
    
    it('should add Task Missing Name and Description', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask?name=&description=',
        body: {},
        failOnStatusCode: false,
      }).should((response) => {
        expect(response.status).to.equal(400);
        const createdTime = new Date(response.body.timestamp).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - createdTime;
        expect(timeDifference).to.be.within(0, 5000);
        expect(response.body).to.have.property('error', 'Bad Request');
        expect(response.body).to.have.property('path', '/todo/addTask?name=&description=');
      })
    })

    it('should add Task Missing Description', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask?name=Missing Description',
        body: {},
        failOnStatusCode: false,
      }).should((response) => {
        expect(response.status).to.equal(400);
        const createdTime = new Date(response.body.timestamp).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - createdTime;
        expect(timeDifference).to.be.within(0, 5000);
        expect(response.body).to.have.property('error', 'Bad Request');
        expect(response.body).to.have.property('path', '/todo/addTask?name=Missing%20Description');
      })
    })

    it('should add Task Missing Name', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask?description=Missing Name',
        body: {},
        failOnStatusCode: false,
      }).should((response) => {
        expect(response.status).to.equal(400);
        const createdTime = new Date(response.body.timestamp).getTime();
        const currentTime = new Date().getTime();
        const timeDifference = currentTime - createdTime;
        expect(timeDifference).to.be.within(0, 5000);
        expect(response.body).to.have.property('error', 'Bad Request');
        expect(response.body).to.have.property('path', '/todo/addTask?description=Missing%20Name');
      })
    })
  })