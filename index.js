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
      const resp = reply('hello hapi');
      console.log('statusCode: ', resp.statusCode)
      console.log('headers: ', resp.headers)

      // code() sets the status code
      resp.code(418)

      // type() sets mime type
      resp.type('text/plain')

      // header(key, value) sets header
      resp.header('hello', 'world')

      // state(key, value) sends cookie
      resp.state('hello', 'world')

    },
  });

  // start server
  server.start(() => console.log(`Started at: ${server.info.uri}`));
});
