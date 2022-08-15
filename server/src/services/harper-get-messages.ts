import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Message } from "../socketsDataTypes";

export function harperGetMessages(room: String): Promise<Message[]> {
    const dbUrl = process.env.HARPERDB_URL;
    const dbPw = process.env.HARPERDB_PW;
    if (!dbUrl || !dbPw) return Promise.resolve([]);

    let data = JSON.stringify({
        operation: 'sql',
        sql: `Select * from realtime_chat_app.messages where room = '${room}' LIMIT 100`,
    });

    let config: AxiosRequestConfig = {
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
            .then(function (response: AxiosResponse<Message[]>) {
                resolve(response.data);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}