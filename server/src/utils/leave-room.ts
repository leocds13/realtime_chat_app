import { User } from "../socketsDataTypes";

export function leaveRoom(userID: string, chatRoomUsers: User[]) {
    return chatRoomUsers.filter((user) => user.id != userID);
}