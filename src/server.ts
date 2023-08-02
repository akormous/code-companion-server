import express, { Request, Response } from 'express';
import { app_v1 } from './v1';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from '../swagger_output.json';

const app = express();

app.use('/api/v1', app_v1);
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(3000, () => {
  console.log("Server listening on port: 3000");
});
