# Code Companion Server
Backend Server for Code Companion application built with NodeJS and Express.

## Prerequisites

- NodeJS (>=14.0.0)
- npm

## Installation
To install, simply execute the following command at the root of the repository

`npm i`

## Database setup

Create a `.env` file at the root of the repository, with your database credentials. 3 variables are required
- DB_HOST
- DB_USER
- DB_PASSWORD


## Build and Run

There are various modes to run the server

### For development purpose
`npm run start:nodemon`

### For production
`npm run start:prod`

## Build only
The output of the build will be under `./dist` directory. Following command can be used to build the project.

`npm run build`

#

## Summary

A web based code collaboration application that lets you create a code room, invite collaborators via a link and collaborate while coding in real time.

### DO list

- Optimize frontend
- Display all names on the web page which belong to that roomId

## Use Cases
- Coding Interviews
- Collaborative text editing/script writing
- Discussing programming related topics

## Features
1. Instantly create a code room without login
2. Invite others to discuss coding related topics
3. Code syntax highlight

# System Design

## DB Schema

```typescript
interface IRoom {
    roomId: string,
    owner: string,
    dateCreated: Date,
    participants: string[],
    programmingLanguage: string
}
```

## Sequence Diagram

### User creating a code room

```mermaid
sequenceDiagram

actor u as User
participant fe as Frontend
participant be as Backend + WS server
participant db as Database


u ->> fe: Enter name {name} 
u ->> fe: Click Create Room button
fe ->> be: GET /api/room/create {name}
be ->> db: Save { roomId, dateCreated, participants }
be -->> fe: Response { roomId }
fe ->> u: Redirect to Code Room page /{roomid}
Note right of fe: ON MOUNT: get room details
fe -->> be: GET room/{roomId}
be -->> db: Get room details
db -->> be: <room object>
be -->> fe: <room object>
Note left of fe: Render roomId, dateCreated, participants on Code Room page
fe ->> fe: Create a WebSocket Client {/roomid}

```

### Guest entering a code room


```mermaid
sequenceDiagram

actor u as Guest
participant fe as Frontend
participant be as Backend + WS server
participant db as Database


u ->> fe: Enter {roomid or room link}
u ->> fe: Click Join Room button
fe -->> be: GET room/{roomId}
alt room does not exist
    be -->> fe: room not found 404
else
    be -->> fe: <room object>
end
fe ->> u: Prompt guest name
u ->> fe: Enter {name}
u ->> fe: Click Join Room button
fe ->> u: Redirect to Code Room page /{roomid}
Note right of fe: ON MOUNT: get room details
fe -->> be: GET room/{roomId}
be -->> db: Get room details
db -->> be: <room object>
be -->> fe: <room object>
Note left of fe: Render roomId, dateCreated, participants on Code Room page
fe ->> fe: Create a WebSocket Client {/roomid}

```