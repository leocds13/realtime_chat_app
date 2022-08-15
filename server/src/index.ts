import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { JoinRoomData, ReceiveMessageData, SendMessageData, User } from './socketsDataTypes';
import { harperSaveMessage } from './services/harper-save-message';
import dotenv from 'dotenv';
import { harperGetMessages } from './services/harper-get-messages';
import { leaveRoom } from './utils/leave-room';

dotenv.config();

const app = express();

app.use(cors());

const server = createServer(app);

// Create an io server and allow for CORS from http://localhost:3000 with GET asn POST methods
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: [ 'GET', 'POST' ],
    },
});

const CHAT_BOT = 'ChatBot';
let chatRoom = '';
let allUsers: User[] = [];

// Listen for when the client connects via socket.io-client
io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    socket.on('join_room', (data: JoinRoomData) => {
        const { userName, room } = data;
        socket.join(room);

        let __createdtime__ = Date.now();

        let receive_message: ReceiveMessageData = {
            message: `${userName} has joined the chat room`,
            userName: CHAT_BOT,
            __createdtime__,
        };
        socket.to(room).emit('receive_message', receive_message);

        receive_message = {
            message: `Welcome ${userName}`,
            userName: CHAT_BOT,
            __createdtime__
        };
        console.log('Eming user welcome', receive_message, 'time:', Date.now());
        socket.emit('receive_message', receive_message);

        chatRoom = room;
        allUsers.push({id: socket.id, userName, room});
        const chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);

        harperGetMessages(room)
            .then((last100Messages) => {
                socket.emit('last_100_messages', last100Messages);
            })
            .catch((err) => console.log(err));
    });

    socket.on('send_message', (data: SendMessageData) => {
        const { message, userName, room, __createdtime__ } = data;
        io.in(room).emit('receive_message', data);
        harperSaveMessage(message, userName, room)
            .then((response) => console.log(response))
            .catch((err) => console.log(err));
    });

    socket.on('leave_room', (data) => {
        const {userName, room} = data;
        socket.leave(room);
        const __createdtime__ = Date.now();
        
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit('chatroom_users', allUsers);
        socket.to(room).emit('receive_message', {
            message: `${userName} has left the chat`,
            userName: CHAT_BOT,
            __createdtime__,
        });
        
        console.log(`${userName} has left the chat`);
    });
    
    socket.on('disconnect', () => {
        const user: User | undefined = allUsers.find((user) => user.id == socket.id);
        
        if (user?.userName) {
            const __createdtime__ = Date.now();
            
            allUsers = leaveRoom(socket.id, allUsers);
            socket.to(chatRoom).emit('chatroom_users', allUsers);
            socket.to(chatRoom).emit('receive_message', {
                userName: CHAT_BOT,
                __createdtime__,
                message: `${user.userName} has disconnected from the chat.`,
            });
        }
    });
});

server.listen(4000, () => console.log('Server is running on port 4000'));