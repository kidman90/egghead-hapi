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
server.register({
  register: require('good'),
  options,
// register takes callback as the last argument
}, (err) => {
  if (err) { return console.error(err); }

  // every route needs method, path, handler
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('hello hapi');
    },
  });

  function handler(request, reply) {
    reply(request.params);
  }

  // {} for params
  server.route({
    method: 'GET',
    // ? for optional params; optional must come last
    // both /users and /users/id will work
    path: '/users/{id?}',
    handler,
  });

  server.route({
    method: 'GET',
    // params don't have to be the last segment
    path: '/books/{id}/files',
    handler,
  });

  server.route({
    method: 'GET',
    // * wildcard matches unlimited number of segments
    path: '/files/{anything*}',
    handler,
  });

  server.route({
    method: 'GET',
    // * number: matches x number of segments
    path: '/cats/{anything*2}',
    handler,
  });

  server.route({
    method: 'GET',
    // partial segments
    path: '/dogs/{file}.jpg',
    handler,
  });

  // start server
  server.start(() => console.log(`Started at: ${server.info.uri}`));
});
