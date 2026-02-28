import { Component, OnInit, inject } from '@angular/core';

import { AppChatMessage, Messages } from '../messages';

import { ChatEnter } from '../chat-enter/chat-enter';
import { ChatHeader } from '../chat-header/chat-header';
import { ChatMessage } from '../chat-message/chat-message';


@Component({
    selector : 'app-chat',
    imports : [ ChatEnter, ChatHeader, ChatMessage ],
    templateUrl : './chat.html',
    styleUrl : './chat.css',
})
export class Chat implements OnInit
{
    constructor()
    {
        //
    }

    private messagesService = inject(Messages);
    public messages: AppChatMessage[] = [];

    public ngOnInit()
    {
        this.messagesService.getData().subscribe((val) =>
        {
            this.messages.push(...val);
        });
    }
}
