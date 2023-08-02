

describe("POST Add Task Missing Name and Description", () => {

    let initialLength
    let newLength
    let taskName = "";
    let taskDescription = "";
    let createdTaskId = null;
    // beforeEach(() => {
    //   // Make an API request and alias the response as 'apiResponse'
    //   cy.request('GET', 'http://localhost:8080/todo').as('apiResponse');
    // });

    //add task
    it("should add Task with no name or description and return a response of 400", () => {
        cy.request({
          method: "POST", 
          url: "http://localhost:8080/todo/addTask?name=&description=",  
          failOnStatusCode: false,}).then((response) => {
          expect(response.status).to.eq(400);
          // createdTaskId = (response.body.taskId);
          // cy.log("response.body.taskId: " + response.body.taskId);
        });
    });

    it.skip("should return a response of 200 and the length of the response should increment by 1 after Task 4 has been added", () => {
      cy.request('GET', 'http://localhost:8080/todo/').then((response) => {
        expect(response.status).to.eq(200);
        newLength = response.body.length;
        cy.log("newLength: " + newLength);
        expect(newLength).to.eq(initialLength + 1);
        });
      });

    it.skip("should have a non-null or undefined UUID and all fields should contain the correct values", () => {
      cy.request('GET', 'http://localhost:8080/todo/' + createdTaskId).then((response) => {
      cy.log("createdTaskId: " + createdTaskId);
      const task = response.body;
      cy.log(response.body)
      expect(task).to.not.be.null;
      expect(task).to.not.be.undefined;
      expect(task.name).to.eq(taskName);
      expect(task.description).to.eq(taskDescription);
      expect(task.created).to.not.be.null;
      expect(task.completed).to.be.null;
      expect(task.complete).to.eq(false);
      const createdTimestamp = new Date(task.created).getTime();
      const submissionTime = new Date().getTime();
      expect(submissionTime - createdTimestamp).to.be.lessThan(5000);
    });
});
});
