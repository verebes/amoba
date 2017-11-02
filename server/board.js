var Board = function (dimX, dimY) {
    this.ended = false;
    this.storedResult = { won: false };
    this.dimX = dimX + 8;
    this.dimY = dimY + 8;

    this.board = new Array(this.dimY);
    for (var i = 0; i < this.dimY; ++i) {
        this.board[i] = new Array(this.dimX);
    }

    this.clear();

}

Board.prototype.clear = function () {
    for (var i = 0; i < this.dimY; ++i) {
        for (var j = 0; j < this.dimX; ++j) {
            this.board[i][j] = 0;
        }
    }

    this.ended = false;
    this.storedResult = { won: false };
}


Board.prototype.print = function () {
    for (var i = 0; i < this.dimY; ++i) {
        for (var j = 0; j < this.dimX; ++j) {
            process.stdout.write(this.board[i][j] + ' ');
        }
        process.stdout.write("\n");
    }
}

Board.prototype.constructor = Board;

Board.prototype.place = function (cellX, cellY, color) {
    if ( this.board[cellY + 4][cellX + 4] !== 0) {
        return false;
    }

    this.board[cellY + 4][cellX + 4] = color;

    return true;
}

Board.prototype.getResult = function () {

    if ( this.storedResult.won ) {
        return this.storedResult;
    }

    for (var i = 4; i < this.dimY - 4; ++i) {
        for (var j = 4; j < this.dimY - 4; ++j) {
            let sumH = 0;
            let sumV = 0;
            let sumR = 0;
            let sumL = 0;
            if ( this.board[i][j] === 0 ) {
                continue;
            }
            for (var k = 0; k < 5; ++k) {
                sumH += this.board[i][j] === this.board[i][j + k];
                sumV += this.board[i][j] === this.board[i + k][j];
                sumR += this.board[i][j] === this.board[i + k][j + k];
                sumL += this.board[i][j] === this.board[i + k ][j - k];
            }
            if (sumH === 5) {
                this.storedResult = {
                    won: true,
                    color: this.board[i][j],
                    from: { cellX: j -4, cellY: i-4 },
                    to: { cellX: j , cellY: i-4 }
                }
            }

            if (sumV === 5) {
                this.storedResult = {
                    won: true,
                    color: this.board[i][j],
                    from: { cellX: j-4, cellY: i-4 },
                    to: { cellX: j-4, cellY: i}
                }
            }

            if (sumR === 5) {
                this.storedResult = {
                    won: true,
                    color: this.board[i][j],
                    from: { cellX: j-4, cellY: i-4 },
                    to: { cellX: j , cellY: i  }
                }
            }

            if (sumL === 5) {
                this.storedResult = {
                    won: true,
                    color: this.board[i][j],
                    from: { cellX: j -4 , cellY: i -4 },
                    to: { cellX: j - 8, cellY: i  }
                }
            }

        }
    }

    if ( this.storedResult.won ) {
        this.ended = true;
    }
    return this.storedResult;
}

module.exports = Board;