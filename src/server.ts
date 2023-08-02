import express, { Request, Response } from 'express';
import { app_v1 } from './v1';

const app = express();

app.use('/api/v1', app_v1);

app.listen(3000, () => {
  console.log("Server listening on port: 3000");
});
