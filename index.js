const Hapi = require('hapi');

// setup server
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

// every route needs method, path, handler
server.route({
  method: 'GET',
  path: '/',
  handler: (request, reply) => {
    reply('hello hapi')
  }
})

// start server
server.start(() => console.log(`Started at: ${server.info.uri}`))
