import { Schema, model, connect, disconnect, Model } from 'mongoose';
import { logger } from '../../logger';
import { IRoom } from '../models/interfaces';
import { ProgrammingLanguages } from '../models/enums';
import { dbHost } from '../../server';

export class MongoDBService {
    roomSchema: Schema<IRoom>;
    Room: Model<IRoom>;
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.roomSchema = new Schema<IRoom>({
            roomId: {type: String, required: true},
            owner: {type: String, required: true},
            dateCreated: {type: Date, required: true}, 
            participants: {type: [String], required: true },
            programmingLanguage: {type: String, enum: ProgrammingLanguages, required: true}
        });
        this.Room = model<IRoom>('Rooms', this.roomSchema);
    }

    public async connect() {
        await connect('mongodb+srv://' + this.username + ':' + this.password + dbHost + '/?retryWrites=true&w=majority');
        logger.info("MongoDB connected successfully.")    
    }

    public async disconnect() {
        await disconnect();
        logger.info("MongoDB disconnected successfully.")
    }

    public async createRoom(owner: string, roomId: string, dateCreated: Date, programmingLanguage: string = ProgrammingLanguages[ProgrammingLanguages.cpp]) {
        const room = new this.Room({
            roomId: roomId,
            owner: owner,
            dateCreated: dateCreated,
            participants: [owner],
            programmingLanguage: programmingLanguage
        })
        await room.save();
        logger.info("Room saved: " + roomId);
        return room;
    }
    
    public async getRoomById(roomId: string) {
        return await this.Room.findOne({ roomId: roomId });
    }
    
    public async addParticipant(name: string, roomId: string) {
        const room = await this.Room.findOneAndUpdate({ roomId: roomId }, {"$push": { "participants":  name }});
        logger.info("Participant added " + name + " to room " + roomId);
        return room;
    }
    
    public async changeLanguage(programmingLanguage: ProgrammingLanguages, roomId: string) {
        const room = await this.Room.findOneAndUpdate({ roomId: roomId }, { programmingLanguage: programmingLanguage });
        logger.info("Prog. language changed to " + programmingLanguage + " for room " + roomId);
        return room;
    }
}
