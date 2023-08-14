import * as fs from 'fs';
import { logger } from '../../logger';

interface Room {
    roomId: string,
    owner: string,
    dateCreated: string,
    participants: string[]
}
/**
 * This service class handles all DB queries related to room
 */
export class RoomService {
    constructor() {

    }
    
    public save(room: Room): void {
        let rawData = fs.readFileSync("database.json");
        let roomList = JSON.parse(rawData.toString());
        logger.info(roomList);
        roomList.push(room);
        fs.writeFileSync("database.json", JSON.stringify(roomList));
        logger.info("Saved to database!");
        // fs.readFile("database.json")
        // fs.writeFile("data.json", JSON.stringify(room), (error) => {
        //     if(error) {
        //         console.log(error);
        //         throw error;
        //     }
        //     console.log("Written to DB");
        // })
    }
}