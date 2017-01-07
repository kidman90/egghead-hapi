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
  {
    register: require('vision'),
  },
],
// register takes callback as the last argument
(err) => {
  if (err) { return console.error(err); }

  // setup view engine
  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    // location of views
    relativeTo: __dirname,
    path: 'views',
    // allow the use of layout templates
    layout: true,
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.view('home');
    },
  });

  server.route({
    method: 'GET',
    path: '/hi/{name?}',
    handler: (request, reply) => {
      // pass object to send data to template
      reply.view('home', { name: request.params.name || 'World' });
    },
  });


  // start server
  server.start(() => console.log(`Started at: ${server.info.uri}`));
});
