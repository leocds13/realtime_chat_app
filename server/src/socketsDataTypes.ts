export interface User {
    id: string,
    userName: string,
    room: string,
};

export interface Message {
    message: string,
    userName: string,
    room: string,
    __createdtime__: number,
}

export type JoinRoomData = Omit<User, 'id'>;

export type ReceiveMessageData = Omit<Message, 'room'>
// {
//     message: string,
//     userName: string,
//     __createdtime__: number,
// };

export type SendMessageData = Message

// export interface Message {
//     message: string,
//     userName: string,
//     room: string,
//     __createdtime__: number,
// };
