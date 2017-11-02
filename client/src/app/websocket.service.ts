import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class WebSocketService {

    observable: Observable<any>;
    ws = null;

    connect(): Observable<any> {
        this.ws = new WebSocket('ws://' + location.hostname.substr(location.hostname.indexOf('.') + 1) + ':3000');

        this.observable = new Observable(
            observer => {
                this.ws.onmessage = (event) => observer.next(event.data);
                this.ws.onerror = (event) => observer.error(event);
                this.ws.onclose = (event) => observer.complete();
            }
        );

        return this.observable;

        // this.ws.onmessage = function (event) {
        //     console.log('message:' + JSON.stringify(event.data));
        // };
        // this.ws.onerror = function (event) {
        //     console.log('Error:' + event.data);
        // };
    }

    sendMessage(msg: any) {
        const msgstr = JSON.stringify(msg);
        console.log('msg str:' + msgstr);
        this.ws.send(msgstr);
    }
}
