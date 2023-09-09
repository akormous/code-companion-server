import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { app_v1 } from './v1';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger_output.json';
import cors from 'cors';
import { logger } from './logger';
import { WebSocketServer } from 'ws';
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;
import { MongoDBService } from './v1/services/MongoDBService';
import { SocketIOService } from './v1/services/SocketIOService';
import * as dotenv from 'dotenv';

/**
 * Loading environment variables
 */
dotenv.config();
export const dbHost: string | undefined = process.env.DB_HOST;
const dbUser: string | undefined = process.env.DB_USER;
const dbPassword: string | undefined = process.env.DB_PASSWORD;

/**
 * CORSConfiguration
 */
const allowedOrigins = ['http://localhost:5173', 'https://code-companion.netlify.app'];

/**
 * Server INITIALIZATION and CONFIGURATION
 * CORS configuration
 * Request body parsing
 * Serve swagger documentation at domain/doc
 * API v1
 */
const app = express();
app.use(cors(
  {
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type",
    credentials: true
  }
));
app.use(express.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/api/v1', app_v1);


/**
 * Create an http server
 */
export const httpServer = createServer(app);

/**
 * Create a wss (Web Socket Secure) server
 */
export const wss = new WebSocketServer({server: httpServer})

function onError(error: any) {
  logger.info(error);
}

function onListening() {
  logger.info("Listening")
}

httpServer.on('error', onError);
httpServer.on('listening', onListening);


wss.on('connection', (ws, req) => {
  logger.info("wss:connection");
  setupWSConnection(ws, req);
})

export const socketIOService = new SocketIOService(httpServer);
// enter your username and password
export const mongoDbService = new MongoDBService(dbUser!, dbPassword!);
httpServer.listen(3000, () => {
  mongoDbService.disconnect();
  mongoDbService.connect().catch(err => logger.error(err));
  logger.info("Server listening on port: 3000");
});