const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'dchrht',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
