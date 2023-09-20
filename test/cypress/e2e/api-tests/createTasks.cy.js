describe('Post: Add Task 4', () => {
  it('should add a new task and verify its properties', () => {
    // Get the initial task list
    cy.request('GET', 'http://localhost:8080/todo').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.be.an('array');
      expect(response.body.length).to.be.greaterThan(0); // Check that the array is not empty

      // Define task name and description
      const taskName = 'Task 4';
      const taskDescription = 'Description 4';

      // POST request to create a new task
      cy.request({
        method: 'POST',
        url: `http://localhost:8080/todo/addTask?name=${taskName}&description=${taskDescription}`,
        failOnStatusCode: false,
      }).then((postResponse) => {
        // Verify the POST response
        expect(postResponse.status).to.equal(201);
        expect(postResponse.body).to.have.property('taskId').that.is.a('string')
          .and.not.null;
        expect(postResponse.body)
          .to.have.property('message')
          .that.is.a('string').and.not.empty;

        // Extract the created task's UUID
        const createdTaskId = postResponse.body.taskId;

        // Get the updated task list after POST
        cy.request('GET', 'http://localhost:8080/todo').then(
          (updatedResponse) => {
            // Assertion for the updated task list length
            expect(updatedResponse.status).to.equal(200);
            expect(updatedResponse.body).to.be.an('array');
            expect(updatedResponse.body.length).to.equal(
              response.body.length + 1
            ); // New task added

            // Assertions for the properties of the newly created task
            const createdTask = updatedResponse.body.find(
              (task) => task.uuid === createdTaskId
            );
            expect(createdTask).to.not.be.undefined;
            expect(createdTask.uuid).to.not.be.null;
            expect(createdTask.name).to.equal(taskName);
            expect(createdTask.description).to.equal(taskDescription);

            // Log the updated response for reference
            cy.logApiRequestGET('GET', 'http://localhost:8080/todo');
          }
        );
      });
    });
  });
});

describe('Post: Add Task Missing Name and Description', () => {
  it('should return a 400 response with error details', () => {
    // POST request to create a task with missing name and description
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/todo/addTask',
      failOnStatusCode: false,
    }).then((postResponse) => {
      // Verify the POST response
      expect(postResponse.status).to.equal(400);
      expect(postResponse.body)
        .to.have.property('timestamp')
        .that.is.a('string');

      // Parse the timestamp string to a Date object
      const timestampDate = new Date(postResponse.body.timestamp);

      // Check if the timestamp is within 5 seconds of the current time
      const currentTime = Date.now();
      expect(timestampDate.getTime()).to.be.within(
        currentTime - 5000,
        currentTime
      );

      expect(postResponse.body).to.have.property('error', 'Bad Request');
      expect(postResponse.body).to.have.property('path', '/todo/addTask');
    });
  });
});

describe('Post: Missing Description', () => {
  it('should return a 400 response with error details', () => {
    // POST request to create a task with missing description
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/todo/addTask?name=TaskName',
      failOnStatusCode: false,
    }).then((postResponse) => {
      // Verify the POST response
      expect(postResponse.status).to.equal(400);
      expect(postResponse.body)
        .to.have.property('timestamp')
        .that.is.a('string');

      // Parse the timestamp string to a Date object
      const timestampDate = new Date(postResponse.body.timestamp);

      // Check if the timestamp is within 5 seconds of the current time
      const currentTime = Date.now();
      expect(timestampDate.getTime()).to.be.within(
        currentTime - 5000,
        currentTime
      );

      expect(postResponse.body).to.have.property('error', 'Bad Request');
      // Check if the 'path' property value starts with '/todo/addTask'
      expect(postResponse.body.path.startsWith('/todo/addTask')).to.be.true;
    });
  });
});

describe('Post: Missing Name', () => {
  it('should return a 400 response with error details', () => {
    // POST request to create a task with missing name
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/todo/addTask?description=TaskDescription',
      failOnStatusCode: false,
    }).then((postResponse) => {
      // Verify the POST response
      expect(postResponse.status).to.equal(400);
      expect(postResponse.body)
        .to.have.property('timestamp')
        .that.is.a('string');

      // Parse the timestamp string to a Date object
      const timestampDate = new Date(postResponse.body.timestamp);

      // Check if the timestamp is within 5 seconds of the current time
      const currentTime = Date.now();
      expect(timestampDate.getTime()).to.be.within(
        currentTime - 5000,
        currentTime
      );

      expect(postResponse.body).to.have.property('error', 'Bad Request');
      // Check if the 'path' property value starts with '/todo/addTask'
      expect(postResponse.body.path.startsWith('/todo/addTask')).to.be.true;
    });
  });
});

describe('Post: Add Task Multiple Times', () => {
  it('should add tasks multiple times and verify the task count', () => {
    const tasksToAdd = 4; // Define the number of tasks to add

    // Function to make a POST request to add a new task
    const addTask = () => {
      return cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask?name=Task4&description=Description4',
      });
    };

    let initialTaskCount = 0;

    // Get the initial count of tasks
    cy.request('GET', 'http://localhost:8080/todo').then((response) => {
      initialTaskCount = response.body.length;

      // Verify the initial task count
      expect(response.status).to.equal(200);
      expect(initialTaskCount).to.be.greaterThan(3);
    });

    // Add tasks multiple times and verify the response each time
    cy.wrap(Array(tasksToAdd).fill(0)).each(() => {
      addTask().then((postResponse) => {
        // Verify the POST response
        expect(postResponse.status).to.equal(201);
        expect(postResponse.body).to.have.property('taskId').that.is.not.null;
        expect(postResponse.body)
          .to.have.property('message')
          .that.is.a('string').and.not.empty;
      });
    });

    // Get the updated count of tasks and verify it
    cy.request('GET', 'http://localhost:8080/todo').then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.length).to.equal(initialTaskCount + tasksToAdd);
    });
  });
});
