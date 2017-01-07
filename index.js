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

  // === lifecycle events ===

  // as soon as request is recieved; before it has passed through router
  server.ext('onRequest', (request, reply) => {
    console.log('onRequest');
    // turn every request into GET on '/'
    request.setUrl('/');
    request.setMethod('GET');
    reply.continue();
  });

  // request goes through the router

  // after request has gone through the router, before authentication
  server.ext('onPreAuth', (request, reply) => {
    console.log('onPreAuth');
    reply.continue();
  });

  // authentication

  // after authentication
  server.ext('onPostAuth', (request, reply) => {
    console.log('onPostAuth');
    reply.continue();
  });

  // validation

  // after validation, before handler runs
  server.ext('onPreHandler', (request, reply) => {
    console.log('onPreHandler');
    reply.continue();
  });

  // handler runs

  // after handler runs
  server.ext('onPostHandler', (request, reply) => {
    console.log('onPostHandler');
    reply.continue();
  });

  // response payload is validated

  // after response payload is validated
  server.ext('onPreResponse', (request, reply) => {
    console.log('onPreResponse');
    reply.continue();
  });

  // send response to client

  // === lifecycle events ===

  // every route needs method, path, handler
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      console.log('handler');
      reply('hello hapi');
    },
  });

  // start server
  server.start(() => console.log(`Started at: ${server.info.uri}`));
});
