describe("Get requests", () => {
  it("Get: Lists All Tasks", () => {
    cy.request("GET", "/todo").then((response) => {
      expect(response.status).to.eq(200);
      cy.log("List All Tasks array length: " + response.body.length);
    });
  });

  it("Get: Completed List", () => {
    cy.request({
      method: "GET",
      url: "/todo",
      qs: { complete: "true" }
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log("Completed List array length: " + response.body.length);
    });
  });

  it("Get: Not Completed List", () => {
    cy.request({
      method: "GET",
      url: "/todo",
      qs: { complete: "false" },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.log("Not Completed List array length: " + response.body.length);
    });
  });

  it("Get: Task Number 3", () => {
    cy.request("GET", "/todo/5c3ec8bc-6099-4cd5-b6da-8e2956db3a34").then(
      (response) => { cy.fixture("staticData").then((staticData) => {
        expect(response.status).to.eq(200);
        expect(response.body.uuid).to.eq(staticData[2].uuid);
        expect(response.body.name).to.eq(staticData[2].name);
        expect(response.body.description).to.eq(staticData[2].description);
        expect(response.body.completed).to.be.null;
        expect(response.body.complete).to.eq(false);
      })  
      }
    );
  });

  it("Get: Task Not Found", () => {
    cy.request("GET", "/todo/00000000-0000-0000-0000-000000000000").then(
      (response) => { cy.fixture("unknown").then(unknown => {
        expect(response.status).to.eq(200);
        expect(response.body.uuid).to.eq(unknown.uuid);
        expect(response.body.name).to.eq(unknown.name);
        expect(response.body.description).to.eq(unknown.description);
        expect(response.body.completed).to.be.null;
        expect(response.body.complete).to.eq(false);
      }) 
      }
    );
  });

  it("Get: Invalid UUID", () => {
    cy.request({
      url: "/todo/invalid-uuid",
      method: "GET",
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});
