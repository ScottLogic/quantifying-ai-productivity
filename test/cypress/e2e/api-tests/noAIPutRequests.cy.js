describe("Post requests", () => {
  before(() => {
    cy.request("PUT", "/todo/incompleted/fd5ff9df-f194-4c6e-966a-71b38f95e14f").then((response) => {
      expect(response.status).to.eq(200)
   });
  })

  it("Put: Complete Task 2", () => {
    //const currentTime = Date.now()
    //const currentTimeMs = new Date(currentTime).toISOString()
    cy.request({
      method: "GET",
      url: "/todo",
      qs: { complete: "true" }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.eq(0)
    });
    cy.request("PUT", "/todo/completed/fd5ff9df-f194-4c6e-966a-71b38f95e14f").then((response) => {
       expect(response.body.success).to.be.true
       expect(response.body).property("message").to.eq("This task has now been completed.");
    });
    cy.request({
      method: "GET",
      url: "/todo",
      qs: { complete: "true" }
    }).then(
      (response) => { cy.fixture("staticData").then(staticData => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.a('array');
      expect(response.body.length).to.eq(1);
      expect(response.body[0].uuid).to.eq(staticData[1].uuid);
      expect(response.body[0].name).to.eq(staticData[1].name);
      expect(response.body[0].description).to.eq(staticData[1].description);
      expect(response.body[0].created).to.eq(staticData[1].created);
      //expect(response.body[0].completed).to.eq();
      expect(response.body[0].complete).to.be.true
    }) 
    });
  });

  it("Put: Complete Task 2 (Already Completed)", () => {
    cy.request({
      method: "GET",
      url: "/todo",
      qs: { complete: "true" }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.eq(1)
    });
    cy.request("PUT", "/todo/completed/fd5ff9df-f194-4c6e-966a-71b38f95e14f").then((response) => {
      expect(response.body.success).to.be.false
      expect(response.body).property("message").to.eq("Task already marked complete.");
    });
    cy.request({
      method: "GET",
      url: "/todo",
      qs: { complete: "true" }
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.eq(1)
    });
  });

  it("Put: Task Not Found", () => {
    cy.request("PUT", "/todo/completed/00000000-0000-0000-0000-000000000000").then((response) => {
       expect(response.status).to.eq(200);
       expect(response.body.success).to.be.false;
       expect(response.body).property("message").to.eq("Task not found.");
    });
  });


  it("Put: Invalid UUID", () => {
    cy.request({
      url: "/todo/completed/invalid-uuid",
      method: "PUT",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body.error).to.eq("Bad Request");
      expect(response.body.path).to.eq("/todo/completed/invalid-uuid");
    });
  });
});
