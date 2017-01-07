const Hapi = require('hapi');
const Path = require('path');

// setup server
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000,
});

const goodOptions = {
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
    goodOptions,
  },
  {
    register: require('inert'),
  },
],
// register takes callback as the last argument
(err) => {
  if (err) { return console.error(err); }

  // every route needs method, path, handler
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply('hello hapi');
    },
  });

  server.route({
    method: 'GET',
    path: '/static',
    handler: (request, reply) => {
      const path = Path.join(__dirname, 'public/style.css');
      reply.file(path);
    },
  });

  // inert has custom route handler for serving a file
  server.route({
    method: 'GET',
    path: '/static-file',
    handler: {
      file: Path.join(__dirname, 'public/style.css'),
    },
  });


  // inert has custom route handler for serving a directory
  // {param*} matches the name a file in the directory
  server.route({
    method: 'GET',
    path: '/static-directory/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, 'public'),
      },
    },
  });

  // start server
  server.start(() => console.log(`Started at: ${server.info.uri}`));
});
