import axios, { AxiosRequestConfig } from "axios";

export function harperSaveMessage(message: string, userName: string, room: string) {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) return Promise.resolve(null);

    var data = JSON.stringify({
        operation: 'insert',
        schema: 'realtime_chat_app',
        table: 'messages',
        records: [
            {
                message,
                userName,
                room,
            },
        ],
    });

    var config: AxiosRequestConfig = {
        method: 'post',
        url: dbUrl,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Basic ' + dbPw,
        },
        data: data,
    };

    return new Promise((resolve, reject) => {
        axios(config)
            .then(function (response) {
                resolve(JSON.stringify(response.data));
            })
            .catch(function (error) {
                reject(error);
            });
    });
}