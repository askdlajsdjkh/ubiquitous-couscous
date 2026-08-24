import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { ChatDisplayContent, Messages } from '../messages';
import { Auth } from '../auth';


@Component({
  selector: 'app-chat-body',
  imports: [ AsyncPipe, FormsModule ],
  templateUrl: './chat-body.html',
  styleUrl: './chat-body.css',
  providers: [ Messages ],
})
export class ChatBody implements OnInit
{
    constructor()
    {
        //
    }


    public ngOnInit()
    {
        this.messagesService.messages$.subscribe((val) =>
        {
            this._messagesState.push(val);
            this.messages$.next(this._messagesState);
        });
    }


    @Input() private chatId?: string;


    @ViewChild('formInputText')
    formInputText: ElementRef<HTMLInputElement> | null = null;


    private readonly messagesService = inject(Messages);

    private _messagesState = [] as ChatDisplayContent[];
    public messages$ = new Subject<ChatDisplayContent[]>();


    public onSubmit()
    {
        //
    }
}
