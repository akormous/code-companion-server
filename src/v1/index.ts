import { Request, Response, Router } from 'express';
import { mongoDbService } from '../server';
import { logger } from '../logger';
import { socketIOService, wss } from '../server';

export const app_v1 = Router();

// const service = new RoomService();

app_v1.get('/', (req: Request, res: Response) => {
    //connectMongo().catch(console.dir);
    res.send("This is v1 api");
})

/**
 * Room Controller
 */

/**
 * Create a Room
 */
app_v1.post('/room/create', async (req: Request, res: Response) => {
    // #swagger.description = 'Create a code room'
    const roomId = Math.random().toString(36).substring(2, 8);
    const room = await mongoDbService.createRoom(req.body.name, roomId, new Date());
    res.send(room);
})

/**
 * Get room details
 */
app_v1.get('/room/', async (req: Request, res: Response) => {
    // #swagger.description = 'Get code room details'
    const roomId: string = req.query.roomId as string;
    const room = await mongoDbService.getRoomById(roomId);
    if(room == null) {
        logger.info("Room not found!");
        res.status(404).send({error: "Room not found!", status: 404});
    }
    else {
        res.send(room);
    }    
})

/**
 * Join a Room
 */
app_v1.post('/room/join', async (req: Request, res: Response) => {
    // #swagger.description = 'Join an existing code room'
    await mongoDbService.addParticipant(req.body.name, req.body.roomId);
    const room = await mongoDbService.getRoomById(req.body.roomId);
    socketIOService.emitParticipantJoin(room!);
    res.send(room);
})


/**
 * Change programming language for a room
 */
app_v1.patch('/room/language', async (req: Request, res: Response) => {
    // #swagger.description = 'Change programming language for a code room'
    await mongoDbService.changeLanguage(req.body.programmingLanguage, req.body.roomId);
    const room = await mongoDbService.getRoomById(req.body.roomId);
    res.send(room);
})