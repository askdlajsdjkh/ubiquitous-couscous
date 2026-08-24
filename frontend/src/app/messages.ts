import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Auth } from './auth';
import { DBChatMessage } from '../../../server/lib/db';


interface ChatDisplayMessage extends DBChatMessage {
    type : 'message';
}
interface ChatDisplayError {
    type : 'error';
    text: string;
    timestamp: number;
}

export type ChatDisplayContent = ChatDisplayMessage | ChatDisplayError;


@Injectable()
export class Messages
{
    constructor()
    {
        //
    }


    private readonly http = inject(HttpClient);
    private ws$: WebSocketSubject<DBChatMessage> | null = null;

    public readonly messages$ = new ReplaySubject<ChatDisplayContent>();


    public connect(chatId: string)
    {
        const token = localStorage.getItem('jwttoken');
        if (token === null)
        {
            throw new Error('Cannot get JWT token from localStorage.');
        }

        this.ws$ = webSocket(`ws://${window.location.hostname}:8080?token=${token}&chatId=${chatId}`);
        this.ws$.subscribe({
            next: (val) =>
            {
                this.messages$.next({
                    type: 'message',
                    ...val,
                });
            },
            error: (err) =>
            {
                this.messages$.next({
                    type: 'error',
                    text: String(err),
                    timestamp: Date.now(),
                });
            },
        });
    }
}
