const Hapi = require('hapi');
const Boom  = require('boom');

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

  // send response payload to client
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('hello hapi');
    },
  });

  // reply with no arguments sends 200 with empty payload
  server.route({
    method: 'GET',
    path: '/empty',
    handler: (request, reply) => {
      reply();
    },
  });

  // send json when given an object
  server.route({
    method: 'GET',
    path: '/json',
    handler: (request, reply) => {
      reply({ hello: 'world' });
    },
  });

  // wait for promise to resolve or reject before sending response
  server.route({
    method: 'GET',
    path: '/promise',
    handler: (request, reply) => {
      reply(Promise.resolve('hi'));
    },
  });

  // create a read stream of the current file.
  // hapi will handle piping to response stream
  server.route({
    method: 'GET',
    path: '/stream',
    handler: (request, reply) => {
      reply(require('fs').createReadStream(__filename));
    },
  });

  // hapi defaults to using Boom 500 error object when given an error
  server.route({
    method: 'GET',
    path: '/error',
    handler: (request, reply) => {
      reply(new Error('oops'));
    },
  });

  server.route({
    method: 'GET',
    path: '/notfound',
    handler: (request, reply) => {
      reply(Boom.notFound());
    },
  });


  // start server
  server.start(() => console.log(`Started at: ${server.info.uri}`));
});
