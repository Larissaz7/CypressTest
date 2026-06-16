const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    allowCypressEnv: false,
    setupNodeEvents(on, config) {
      // implemente node event listeners aqui se precisar
    },
  },
});