export interface IRoom {
    roomId: string,
    owner: string,
    dateCreated: Date,
    participants: string[],
    programmingLanguage: string
}