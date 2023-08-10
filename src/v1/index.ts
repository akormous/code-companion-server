import { Request, Response, Router } from 'express';
import { RoomService } from './services/RoomService';
export const app_v1 = Router();

const service = new RoomService();

app_v1.get('/', (req: Request, res: Response) => {
    res.send("This is v1 api");
})

/**
 * Room Controller
 */
app_v1.post('/room/create', (req: Request, res: Response) => {
    console.log(req.body.name);
    const roomId = Math.random().toString(36).substring(2, 8);
    service.save({roomId: roomId, owner: req.body.name, dateCreated: Date.now().toString(), participants: []});
    res.send({roomId: roomId, dateCreated: Date.now()})
})