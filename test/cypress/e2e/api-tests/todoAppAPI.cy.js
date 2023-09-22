//example Cypress API tests generated using ChatGPT
describe('API Tests', () => {
    it('Get: List All Tasks', () => {
      cy.request('http://localhost:8080/todo').should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length(3)
      })
      })
    })
    // GET -Task 2
    describe('API Tests', () => {
    it('Get: Completed List ', () => {
      const taskId = 'f360ba09-4682-448b-b32f-0a9e538502fa'
      cy.request('http://localhost:8080/todo?complete=true').should((response) => {
        expect(response.status).to.equal(200)
        expect(response.body).to.be.an('array')
        expect(response.body).to.have.length([])
      })
    })
  })
//GET -Task 3
      describe('API Tests', () => {
      it('Get: Not Completed List', () => {
      cy.request('http://localhost:8080/todo?complete=false').then((response) => {
      expect(response.status).to.equal(200);
      cy.log("The array length is: " + (response.body.length));
    });
  });
})
//GET - Task 4
    describe('API Tests', () => {
      const taskId='f360ba09-4682-448b-b32f-0a9e538502fa'
      it('Get: Task Number 3', () => {
        // Send an HTTP request using Cypress to your local server
        cy.request('http://localhost:8080/todo/' + taskId).then((response) => {
            // Assert that the status code is 200
            expect(response.status).to.equal(200);
    
            // Assert that the response body is an object containing taskId, name,description properties and completed properties
            expect(response.body).to.have.property('uuid',taskId).that.is.a('string');
            expect(response.body).to.have.property('name').that.is.a('string');
            expect(response.body).to.have.property('description').that.is.a('string');
            expect(response.body).to.have.property('completed').to.be.null; // Check if completed is null

              // Assert that the complete field is equal to false
            expect(response.body.complete).to.equal(false);

            // Assert that the taskId, name, and description fields are equal to expected values and 
            expect(response.body.uuid).to.equal('f360ba09-4682-448b-b32f-0a9e538502fa'); 
            expect(response.body.name).to.equal("Walk the dog"); 
            expect(response.body.description).to.equal("Walk the dog for forty five minutes"); 
          });
      });
    });
    //GET- Task5 
    describe('API Tests', () => {
      const taskId='00000000-0000-0000-0000-000000000000'
      it('Get: Task Not Found', () => {
        // Send an HTTP request using Cypress to your local server
        cy.request('http://localhost:8080/todo/' + taskId).then((response) => {
            // Assert that the status code is 200
            expect(response.status).to.equal(200);
    
            // Assert that the response body is an object containing taskId, name,description,created and completed properties
            expect(response.body).to.have.property('uuid',taskId).that.is.a('string');
            expect(response.body).to.have.property('name').that.is.a('string');
            expect(response.body).to.have.property('description').that.is.a('string');
            expect(response.body).to.have.property('created').that.is.a('string');
            
            // Assert that the taskId, name, and description fields are equal to expected values
            expect(response.body.uuid).to.equal('00000000-0000-0000-0000-000000000000'); 
            expect(response.body.name).to.equal("Unknown Task"); 
            expect(response.body.description).to.equal("Unknown Task"); 
            expect(response.body.created).to.equal('1970-01-01T00:00:00Z'); 
            expect(response.body).to.have.property('completed').to.be.null; 
            expect(response.body.complete).to.equal(false); 
          });
      });
    });
    //GET Task6
    describe('API Tests', () => {
      const taskId='502c5987-e19e-4c1f-8b3f-8064f0fc8b90 '
      it('Get: Invalid UUID', () => {
        cy.request ({  method: "GET",
        url: "http://localhost:8080/todo/invalid-uuid",
        failOnStatusCode: false,}).then((response) => {
            // Assert that the status code is 400
            expect(response.status).to.equal(400);
            if (response.body.error) {
              expect(response.body.error).to.eq("Bad Request");
            }
            if (response.body.path) {
              expect(response.body.path).to.eq("/todo/invalid-uuid");
      }});
        });   
      });
//PUT Task 1
describe('API Tests', () => {
  it('Put: Complete Task 2', () => {
  cy.request('PUT','http://localhost:8080/todo/completed/fd5ff9df-f194-4c6e-966a-71b38f95e14f').then((response) => {
    //Ensure that the status code is 200
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal ("This task has now been completed.");
    expect(response.body.success).to.be.true;
    cy.log('Response:', response.body);
  })
    
      it('should mark task 2 complete and verify the response', () => {
        cy.request('GET', `http://localhost:8080/todo/fd5ff9df-f194-4c6e-966a-71b38f95e14f`)
          .then((response) => {
            // Log the response to the Cypress console for debugging
            cy.log('Response:', response);
            expect(response.status).to.equal(200)
            expect(response.body.complete).to.be.true;
          });
      });
    });
  });

//PUT Task2 
describe('API Tests', () => {
  it('Put: Complete Task 2 (Already Completed)', () => {

  cy.request('PUT',`http://localhost:8080/todo/completed/fd5ff9df-f194-4c6e-966a-71b38f95e14f`).then((response) => {
    //Ensure that the status code is 200
    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.false;
    expect(response.body.message).to.equal ("Task already marked complete.")
    cy.log(response.body);
  })
      it('should mark task 2 complete and verify the response', () => {
        cy.request('GET', `http://localhost:8080/todo/completed/fd5ff9df-f194-4c6e-966a-71b38f95e14f`)
          .then((response) => {
            cy.log('Response:', response.body);
            expect(response.status).to.equal(200)
            expect(response.body.complete).to.be.true;
            })
          });
        });   
      })
  
    
//PUT Task3

describe('API Tests', () => {
  it('Put: Task Not Found', () => {
  cy.request('PUT',`http://localhost:8080/todo/completed/fd5ff9df-f194-1a3b-966a-71b38f95e14f`,).then((response) => {
    //Ensure that the status code is 200
    expect(response.status).to.eq(200);
    expect(response.body.success).to.eq(false);
    expect(response.body.message).to.eq("Task not found.");
  })
  });
});
  //PUT task 4
  describe('API Tests', () => {
    it('Put: Invalid UUID', () => {
    cy.request({  method: "PUT",
    url: "http://localhost:8080/todo/completed/invalid-uuid",
    failOnStatusCode: false,})
    .then((response) => {
      //Ensure that the status code is 400
      expect(response.status).to.eq(400);
      if (response.body.error) {
        expect(response.body.error).to.eq("Bad Request");
      }
      if (response.body.path) {
        expect(response.body.path).to.eq("/todo/completed/invalid-uuid");
    }})
  })
//POST task 1
describe('API Tests', () => {
  it('Post: Add Task 4', () => {
  cy.request('GET',`http://localhost:8080/todo`).then((response) => {
    //Ensure that the status code is 200
    expect(response.status).to.eq(200);
    expect(response.body.length).to.be.greaterThan(0);
  })
    it('Post: Add Task 4', () => {
    cy.request('POST',`http://localhost:8080/todo/addTask?name=Task Four&description=Description Four`)
    expect(response.status).to.eq(201);
    expect(response.body.taskId).to.not.be.null;
    uuid = response.body.taskId;
    cy.log("The UUID is: " + uuid);
    expect(response.body.message).to.eq(
      "Task Task Four added successfully."
    )})
    it('Post: Add Task 4', () => {
    cy.request('GET',`http://localhost:8080/todo`).then((response) => {
     expect(response.status).to.equal(200);
     expect(response.body.length).to.equal(response.body.length + 1);
    
   // Find the created task (Task 4) in the response
    var createdTask =response.body.find((x) => x.uuid == uuid);
    
    // Verify that the created task is not null or undefined
      expect(createdTask).to.not.be.null;
      expect(createdTask).to.not.be.undefined;
    
            // Verify the properties of the created task
      expect(createdTask.uuid).to.not.be.null;
      expect(createdTask.name).to.equal("Task Four");
      expect(createdTask.description).to.equal("Description Four");
    
            // Verify that 'created' is within 5 seconds of submission
      const currentTime = Date.now();
      const createdTime = createdTask.created * 1000; // Convert to milliseconds
      const timeDifference = currentTime - createdTime;
      expect(timeDifference).to.be.lessThan(5000); // 5 seconds in milliseconds
    
            // Verify that 'completed' is null
      expect(createdTask.completed).to.be.null;
          });
      });
    });

    //POST TASK 2
    describe('API Tests', () => {
      it('Post: Add Task Missing Name and Description', () => {
          // Make a POST request to create the task
        cy.request({
          method: 'POST',
          url: 'http://localhost:8080/todo/addTask?name=&description=',
          failOnStatusCode: false, // Ensure Cypress doesn't treat a 400 response as an error

        }).then((response) => {
        var createdSeconds = new Date(response.body.timestamp).getTime() / 1000;
        var nowSeconds = new Date().getTime() / 1000;
         // Assert that the response status code is 400
        expect(response.status).to.equal(400);
        expect(createdSeconds < nowSeconds && createdSeconds > nowSeconds - 5).to.be.true;
        // Assert that the error field contains the correct value
        expect(response.body.error).to.equal('Bad Request');
          // Assert that the path field contains the correct value
        expect(response.body.path).to.equal('/todo/addTask?name=&description='); 
    
        });
      });
    });
    //Task 3

    describe('API Tests', () => {
      it('Post: Missing Description', () => {
          // Make a POST request to create the task
        cy.request({
          method: "POST",
          url: "http://localhost:8080/todo/addTask?name=Missing Description",
          failOnStatusCode: false,

        }).then((response) => {
        var createdSeconds = new Date(response.body.timestamp).getTime() / 1000;
        var nowSeconds = new Date().getTime() / 1000;
        expect(createdSeconds < nowSeconds && createdSeconds > nowSeconds - 5).to.be.true;
       // Assert that the response status code is 400
        expect(response.status).to.equal(400);
        expect(response.body.error).to.equal('Bad Request');
       
        })
  });
});
});

//Task 4
describe('API Tests', () => {
  it('Post: Missing Name', () => {
      // Make a POST request to create the task
    cy.request({
      method: "POST",
      url: "http://localhost:8080/todo/addTask?description=Missing Name",
      failOnStatusCode: false,

    }).then((response) => {
    var createdSeconds = new Date(response.body.timestamp).getTime() / 1000;
    var nowSeconds = new Date().getTime() / 1000;
    expect(createdSeconds < nowSeconds && createdSeconds > nowSeconds - 5).to.be.true;
   // Assert that the response status code is 400
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal('Bad Request');
});
});
});
//Task 5

describe('API Tests', () => {
  it('Post: Add Task 4 Multiple Times', () => {
    function createTask() {
      // Make a POST request to create the task
        cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask?name=Task Four&description=Description Four',
        body: taskData,
      }).then((response) => {
        // Assert that the response status code is 201
        expect(response.status).to.equal(201);

        // Assert that the taskId is not null
        expect(response.body.taskId).to.not.be.null;

        // Assert that the message field produces a message
        expect(response.body.message).to.equal('Task Task Four added successfully.');
      });
    
    // Get a list of all tasks and check response code and array length
    cy.request('GET', 'http://localhost:8080/todo')
      .then((response) => {
        // Assert that the response status code is 200
        expect(response.status).to.equal(200);

        // Assert that the response body has more than 3 tasks
        expect(response.body.length).to.be.greaterThan(3);

        // Store the initial task count
        initialTaskCount = response.body.length;

        // Call the createTask function 4 times to add new tasks
        for (let i = 0; i < 4; i++) {
          createTask();
        }
      });

    // Get a list of all tasks (again) and check response code and array length
    cy.request('GET', 'http://localhost:8080/todo')
    
      .then((response) => {
        // Assert that the response status code is 200
        expect(response.status).to.equal(200);

        // Assert that the array count has added the 4 tasks
        expect(response.body.length).to.equal(initialTaskCount + 4)
      });
    }});
  });
})

