import { Component } from '@angular/core';
import { Server } from 'ws';
import { WebSocketService } from './websocket.service';

@Component({
  selector: 'app-root',
  providers: [ WebSocketService ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor( private wss: WebSocketService ) {

  }

  connect() {
    console.log('on click was pressed');
    this.wss.connect();
  }

  send() {
    console.log('sending message');
    this.wss.sendMessage( "hel.toString()lo" );
  }

  newGame() {
    console.log("new game");
    this.wss.sendMessage(  { type: "new", msg: {} });
  }
}
