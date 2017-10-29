import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { WebSocketService } from '../websocket.service';
import { Observable } from 'rxjs/Rx';

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
    interface IPos {
      cellX: number;
      cellY: number;
    }
    if (!data) {
      return;
    }

    console.log('data:' + data);
    if ( data === "\"new\"") {
      this.newGame();
      return;
    }

    const d: IPos = JSON.parse(data);
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

    ctx.beginPath();
    ctx.arc(cx, cy, (this.cellSize - 4) / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  @HostListener('mousedown', ['$event'])
  onclick(event: MouseEvent) {
    console.log(event.offsetX);
    console.log(event.offsetY);

    const cellX = Math.floor(event.offsetX / this.cellSize);
    const cellY = Math.floor(event.offsetY / this.cellSize);

    console.log('cell:' + cellX + ',' + cellY);

    const msg = {
      cellX: cellX,
      cellY: cellY
    };

    this.wss.sendMessage(msg);
  }

  newGame() {
    this.red = true;
    this.drawGrid();
  }

  drawGrid() {
    const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');

    ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

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
