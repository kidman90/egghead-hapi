const Hapi = require('hapi');
const Boom = require('boom');

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
  });

  server.ext('onPreResponse', (request, reply) => {
    const resp = request.response;
    // if there is an error, hapi returns a Boom error object and isBoom is true

    // if there isn't a Boom object, continue
    if (!resp.isBoom) return reply.continue();

    // else there is a Boom object.
    reply.view('error', resp.output.payload)
      // must set the statusCode, otherwise it will return 200 for rendering
      // the error page file
      .code(resp.output.statusCode);
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply(Boom.notFound());
    },
  });

  // start server
  server.start(() => console.log(`Started at: ${server.info.uri}`));
});
