import { Request, Response, Router } from 'express';

export const app_v1 = Router();


app_v1.get('/', (req: Request, res: Response) => {
    res.send("This is v1 api");
})