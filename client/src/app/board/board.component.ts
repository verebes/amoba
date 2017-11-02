import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { Observable } from 'rxjs/Rx';

interface IPos {
  cellX: number;
  cellY: number;
}


interface IResult {
  win: boolean;
  from: IPos;
  to: IPos;
}


@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, AfterViewInit {

  cellSize = 20;
  width = 500;
  height = 500;
  red = true;
  rectX = 0;
  rectY = 0;


  @ViewChild('board') canvas: ElementRef;

  constructor(private wss: WebSocketService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.drawGrid();

    const obs = this.wss.connect();
    obs.subscribe(this.onData.bind(this));
  }

  onData(data) {
    if (!data) {
      return;
    }

    console.log('data:' + data);

    const msg: any = JSON.parse(data);
    if (msg.type === "place") {
      this.placeOne(msg.msg as IPos);
    }

    if (msg.type === "new") {
      this.newGame();
      return;
    }

    if (msg.type === "result") {
      if  ( msg.msg.won ) {
        this.endGame(msg.msg as IResult);
      }
    }

  }

  endGame(msg: IResult) {
    console.log('endGame');
    const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');


    ctx.lineCap = "round"
    ctx.lineWidth = 5;
    ctx.strokeStyle  = 'black';

    ctx.beginPath();
    ctx.moveTo( ( msg.from.cellX + 0.5 ) * this.cellSize, (msg.from.cellY + 0.5 ) * this.cellSize );

    ctx.lineTo( ( msg.to.cellX + 0.5 ) * this.cellSize, (msg.to.cellY + 0.5 ) * this.cellSize );
    ctx.stroke();
  }

  placeOne(d: IPos) {
    console.log("pos:" + d.cellX + ', ' + d.cellY);
    console.log('aaa' + this.cellSize);

    console.log('type:' + typeof (this));

    const cx = this.cellSize * (d.cellX + 0.5);
    const cy = this.cellSize * (d.cellY + 0.5);


    const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
    if (this.red) {
      ctx.fillStyle = "#ff0000";
    } else {
      ctx.fillStyle = "#0000ff";
    }
    this.red = !this.red;

    this.rectX = cx - this.cellSize / 2;
    this.rectY = cy - this.cellSize / 2;

    ctx.beginPath();
    ctx.arc(cx, cy, (this.cellSize - 4) / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  @HostListener('mousedown', ['$event'])
  onclick(event: MouseEvent) {
    const cellX = Math.floor(event.offsetX / this.cellSize);
    const cellY = Math.floor(event.offsetY / this.cellSize);

    console.log('cell:' + cellX + ',' + cellY);

    const msg = {
      cellX: cellX,
      cellY: cellY,
      red: this.red
    };

    this.wss.sendMessage({ type: "place", msg: msg });
  }

  newGame() {
    this.red = true;
    this.drawGrid();
  }

  drawGrid() {
    const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    ctx.lineCap = "round"
    ctx.lineWidth = 1;
    ctx.strokeStyle  = 'black';

    console.log("drawing grid");

    for (let i = 0; i < this.width / this.cellSize; ++i) {
      ctx.beginPath();
      ctx.moveTo(i * this.cellSize, 0);
      ctx.lineTo(i * this.cellSize, this.height);
      ctx.stroke();
    }

    for (let i = 0; i < this.height / this.cellSize; ++i) {
      ctx.beginPath();
      ctx.moveTo(0, i * this.cellSize);
      ctx.lineTo(this.width, i * this.cellSize);
      ctx.stroke();
    }
  }

}
