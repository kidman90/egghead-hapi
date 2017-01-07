const Hapi = require('hapi');

// setup server
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000,
});

const options = {
  // set up logging
  reporters: {
    myConsoleReporter: [{
      module: 'good-console',
      // only listen to log and response events
      args: [{ log: '*', response: '*' }],
    }, 'stdout'],
  },
};

// register plugins
server.register([
  {
    register: require('good'),
    options,
  },
],
// register takes callback as the last argument
(err) => {
  if (err) { return console.error(err); }

  server.route({
    method: ['POST', 'PUT'],
    path: '/',
    handler: (request, reply) => {
      // request.payload is where hapi places the content of the request body
      reply(request.payload);
    },
  });

  server.route({
    method: ['POST', 'PUT'],
    path: '/parse',
    config: {
      payload: {
        output: 'data',
        // don't automatically parse the payload data
        parse: false,
      },
    },
    handler: (request, reply) => {
      // request.payload is where hapi places the content of the request body
      reply(request.payload);
    },
  });

  server.route({
    method: ['POST', 'PUT'],
    path: '/allow',
    config: {
      payload: {
        output: 'data',
        // don't automatically parse the payload data
        parse: false,
        // only allow json
        allow: 'application/json'
      },
    },
    handler: (request, reply) => {
      // request.payload is where hapi places the content of the request body
      reply(request.payload);
    },
  });


  // start server
  server.start(() => console.log(`Started at: ${server.info.uri}`));
});
