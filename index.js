const Hapi = require('hapi');

// setup server
const server = new Hapi.Server();
server.connection({
  host: 'localhost',
  port: 8000
});

let options = {
  // set up logging
  reporters: {
    myConsoleReporter: [{
      module: 'good-console',
      // only listen to log and response events
      args: [{ log: '*', response: '*'}]
    }, 'stdout']
  }
}

// register plugins
server.register({
  register: require('good'),
  options,
// register takes callback as the last argument
}, err => {

  // every route needs method, path, handler
  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      server.log('error', 'boom!');
      server.log('info', 'yay!');
      reply('hello hapi');
    }
  })

  if (err) { return console.error(err); }

  // start server
  server.start(() => console.log(`Started at: ${server.info.uri}`))
})
