import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { app_v1 } from './v1';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger_output.json';
import cors from 'cors';
import { logger } from './logger';
import { WebSocketServer } from 'ws';
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;

/**
 * Configuration
 */
const allowedOrigins = ['http://localhost:5173'];

/**
 * Server initialization
 */
const app = express();
// set CORS configuration
app.use(cors(
  {
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type",
    credentials: true
  }
));
// parser incoming request body to json
app.use(express.json());

/**
 * API version 1
 */
app.use('/api/v1', app_v1);

/**
 * Serving swagger documentation at /doc
 */
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

/**
 * Create an http server
 */
const httpServer = createServer(app);

/**
 * Create a wss (Web Socket Secure) server
 */
const wss = new WebSocketServer({server: httpServer})

function onError(error: any) {
  console.log(typeof(error));
  logger.info(error);
}

function onListening() {
  logger.info("Listening")
}
httpServer.on('error', onError);
httpServer.on('listening', onListening);

wss.on('connection', (...args) => {
  logger.info("wss:connection");
  args.keys();

  setupWSConnection(...args);
})

/**
 * Create a web socket server
 */
// const io = new Server(httpServer, {
//   cors: {
//     origin: allowedOrigins,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   }
// });

// /**
//  * Web Socket on event connection
// */
// io.on('connection', (socket) => {
//   logger.info("Connected " + socket.id);
//   socket.on('send_message', (message) => {
//     logger.info("Received message: " + message.message);
//     socket.emit('get_message', { message: "Server acknowledges your existence " + socket.id });
//   });
// });



httpServer.listen(3000, () => {
  logger.info("Server listening on port: 3000");
});
