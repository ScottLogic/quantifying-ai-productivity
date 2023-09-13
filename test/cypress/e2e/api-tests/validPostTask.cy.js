describe('Valid Post Task', () => {
  it('Create new task and validate GET request for uuid', () => {
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/todo/addTask',
      qs: {
        name: 'Use Gen Ai',
        description: 'test with gen AI'
      }
    })
      .then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('taskId');
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.match(/Task Use Gen Ai added successfully/);
        expect(response.body.taskId).not.to.be.null;
        const taskId = response.body.taskId;
        cy.request('http://localhost:8080/todo/' + taskId)
          .then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('description');
            expect(response.body.name).to.equal('Use Gen Ai');
            expect(response.body.description).to.equal('test with gen AI');
          });
      });
  });
  it('Validate created timestamp matches time request was sent', () => {
    const requestTime = new Date().toISOString();
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/todo/addTask',
      qs: {
        name: 'Time Test',
        description: 'This task will check the created timestamp is allocated correctly'
      }
    })
      .then((response) => {
        // Get the taskId from the previous request
        const taskId = response.body.taskId;
        const nowWithoutMs = requestTime.slice(0,19);
        cy.request('http://localhost:8080/todo/' + taskId)
          .then((response) => {
            expect(response.status).to.equal(200);
            cy.log(response)
            expect(response.body.uuid).to.equal(taskId);
            expect(response.body).to.have.property('created');
            
            expect(response.body.created.slice(0,19)).to.equal(nowWithoutMs);
          });
      });
  });


  it('Duplicate Tasks can be posted with validation', () => {
    const tasks = [];
    const name = 'Duplicate Task';
    const description = 'Duplicate Description';

    for (let i = 0; i < 4; i++) {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/todo/addTask',
        qs: {
          name: name,
          description: description
        }
      })
        .then((response) => {
          expect(response.status).to.equal(201);
          tasks.push(response.body.taskId);


      });
    }
      cy.request('http://localhost:8080/todo')
        .should((response) => {
          expect(response.status).to.equal(200);
          expect(tasks.length).to.equal(4)
          const lastFourItems = response.body.slice(-4); // Get the last 4 items
          lastFourItems.forEach((task) => {
        expect(task.name).to.equal('Duplicate Task');
      });
          expect(response.body.length-5).to.equal(tasks.length);
          
        });

  });
});