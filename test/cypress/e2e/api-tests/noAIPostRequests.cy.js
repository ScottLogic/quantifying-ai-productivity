describe("Post requests", () => {
  it("Post: Add Task 4", () => {
    cy.request("GET", "/todo").then((response) => {
      expect(response.status).to.eq(200);
      const taskCount = response.body.length;
      expect(response.body.length).to.be.gt(0);
      cy.request({
        method: "POST",
        url: "/todo/addTask",
        qs: { name: "Task Four",
              description: "Description Four"}
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.taskId).to.not.be.null
        expect(response.body.message).to.eq("Task Task Four added successfully.")
      });
      cy.request("GET", "/todo").then((response) => {
        const lastItem = response.body[response.body.length - 1]
        const creationTime = new Date(lastItem.created).getTime();
        const currentTime = Date.now();
        const timestamp = currentTime - creationTime;
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(taskCount + 1);
        expect(lastItem.uuid).to.not.be.null;
        expect(lastItem.name).to.eq("Task Four");
        expect(lastItem.description).to.eq("Description Four");
        expect(timestamp).to.be.within(0, 5000);
        expect(lastItem.completed).to.be.null;
        expect(lastItem.complete).to.be.false;
    });
  })
})

    it("Post: Add Task Missing Name and Description", () => {
      cy.request({
        method: "POST",
        url: "/todo/addTask",
        qs: { name: "",
        description: ""},
        failOnStatusCode: false
      }).then((response) => {
        const creationTime = new Date(response.body.timestamp).getTime();
        const currentTime = Date.now();
        const timestamp = currentTime - creationTime;
        expect(response.status).to.eq(400);
        expect(timestamp).to.be.within(0, 5000);
        expect(response.body.error).to.eq("Bad Request");
        expect(response.body.path).to.eq("/todo/addTask?name=&description=");
      });
    });

    it("Post: Missing Description", () => {
      cy.request({
        method: "POST",
        url: "/todo/addTask",
        qs: { name: "",
        description: "Missing Description"},
        failOnStatusCode: false
      }).then((response) => {
        const creationTime = new Date(response.body.timestamp).getTime();
        const currentTime = Date.now();
        const timestamp = currentTime - creationTime;
        expect(response.status).to.eq(400);
        expect(timestamp).to.be.within(0, 5000);
        expect(response.body.error).to.eq("Bad Request");
        expect(response.body.path).to.eq("/todo/addTask?name=&description=Missing%20Description");
      });
    });

    it("Post: Missing Name", () => {
      cy.request({
        method: "POST",
        url: "/todo/addTask",
        qs: { name: "Missing Name",
        description: ""},
        failOnStatusCode: false
      }).then((response) => {
        const creationTime = new Date(response.body.timestamp).getTime();
        const currentTime = Date.now();
        const timestamp = currentTime - creationTime;
        expect(response.status).to.eq(400);
        expect(timestamp).to.be.within(0, 5000);
        expect(response.body.error).to.eq("Bad Request");
        expect(response.body.path).to.eq("/todo/addTask?name=Missing%20Name&description=");
      });
    });
    it("Post: Add Task 4 Multiple Times", () => {
        const postRequest = () => cy.request({
        method: "POST",
        url: "/todo/addTask",
        qs: { name: "Task Four",
              description: "Description Four"}
      }).then((response) => {
        expect(response.status).to.eq(201);
        expect(response.body.taskId).to.not.be.null
        expect(response.body.message).to.eq("Task Task Four added successfully.")
      });
      Array.from({length: 4}, () => postRequest());
      cy.request("GET", "/todo").then((response) => {
        expect(response.status).to.eq(200);
        const taskCount = response.body.length;
        expect(response.body.length).to.be.gt(3);
        Array.from({length: 4}, () => postRequest());
        cy.request("GET", "/todo").then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.length).to.eq(taskCount + 4);
      });
    });
  })
})
