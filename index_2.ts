class Manager {
    private arr: Array<Array<number>>;
    private visited_arr;
    private a: { [id: number]: Unit[]; }

    load() {
        document.getElementById('islands_num_place_holder').innerText = '0';
        let counter: number = 0;
        this.arr = null;
        var rows = document.getElementById('rows') as HTMLInputElement;
        var cols = document.getElementById('cols') as HTMLInputElement;
        var container = document.getElementById('container') as HTMLDivElement;
        // var tblContainer = document.getElementById('tbl-container') as HTMLDivElement;
        // tblContainer.innerHTML = '';
        container.innerHTML = '';
        this.arr = new Array(+rows.value);
        for (var i = 0; i < +rows.value; i++) {
            var div = document.createElement('div');
            this.arr[i] = new Array(+cols.value);
            for (var j = 0; j < +cols.value; j++) {
                var span = document.createElement('span');
                var num = Math.floor(Math.random() * 10) + 1;

                if (num > 8) {// is black

                    let minNeighbor = this.scanPreviousNeighbors(i, j);
                    this.arr[i][j] = 1;
                    // (<HTMLSpanElement>span).style.backgroundColor = 'black';
                }
                else {
                    this.arr[i][j] = 0;
                    // (<HTMLSpanElement>span).style.backgroundColor = 'white';
                }

                span.innerText = this.arr[i][j].toString();
                div.appendChild(span);
            }
            container.appendChild(div)
        }
    }

    isVisited(i, j): boolean {
        return this.isInBounds(i, j) && this.visited_arr[i][j] == -1
    }

    caclIslands() {
        var islands_num_place_holder = 0;

        if (!this.arr || this.arr.length === 0) return;
        this.visited_arr = JSON.parse(JSON.stringify(this.arr));

        for (var i = 0; i < this.arr.length; i++) {
            for (var j = 0; j < this.arr[i].length; j++) {
                if (this.visited_arr[i][j] != -1) {
                    this.setVisited(i, j);
                    if (this.arr[i][j] == 1) {
                        islands_num_place_holder++;
                        document.getElementById('islands_num_place_holder').innerText = islands_num_place_holder.toString();
                        this.markIsland(i, j,);
                    }

                }
            }
        }
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    setColor(i, j, color: string) {
        let cell = this.getTableCell(i, j);
        cell.style.backgroundColor = color;

    }

    private getTableCell(i, j): HTMLTableCellElement {
        return document.getElementById(this.getID(i, j)) as HTMLTableCellElement
    }


    private setVisited(i: number, j: number) {
        this.visited_arr[i][j] = -1;
    }

    private getID(i: number, j: number): string {
        return i.toString() + ',' + j.toString();
    }

    private markIsland(i: number, j: number) {
        let rndColor = this.getRandomColor();
        this.setColor(i, j, rndColor)
        this.markNeighbors(rndColor, i, j);
    }

    private markNeighbors(color: string, i: number, j: number) {
        let neighbors: Array<{ x: number, y: number }> = this.getRelevantNeighbors(i, j);
        neighbors.forEach(item => {
            this.setColor(item.x, item.y, color);
            this.markNeighbors(color, item.x, item.y,)
        })

    }

    private getRelevantNeighbors(i: number, j: number): Array<{ x: number, y: number }> {
        let x, y;

        let arr = new Array<{ x: number, y: number }>();


        x = i - 1;
        y = j - 1;
        // let leftUp: { x: number, y: number } = {x, y};
        this.handleCell(x, y, arr);


        x = i - 1;
        y = j;
        // let up: { x: number, y: number } = {x, y};
        this.handleCell(x, y, arr);

        x = i - 1;
        y = j + 1;
        // let rightUp: { x: number, y: number } = {x, y};
        this.handleCell(x, y, arr);

        x = i + 1;
        y = j - 1;
        // let leftDown: { x: number, y: number } = {x, y};
        this.handleCell(x, y, arr);

        x = i + 1;
        y = j;
        // let down: { x: number, y: number } = {x: i + 1, y: j};
        this.handleCell(x, y, arr);

        x = i + 1;
        y = j + 1;
        // let rightDown: { x: number, y: number } = {x, y};
        this.handleCell(x, y, arr);

        x = i;
        y = j + 1;
        // let right: { x: number, y: number } = {x, y};
        this.handleCell(x, y, arr);

        x = i;
        y = j - 1;
        // let left: { x: number, y: number } = {x, y};
        this.handleCell(x, y, arr);


        return arr;
    }

    private handleCell(x, y, arr) {
        if (!this.isVisited(x, y))
            if (this.isInBounds(x, y)) {
                this.setVisited(x, y)
                if (this.arr[x][y] == 1)
                    arr.push({x, y})
            }
    }

    private isInBounds(i: number, j: number) {
        return i > -1 && j > -1 && i < this.arr.length && j < this.arr[0].length;
    }

    private scanPreviousNeighbors(i: number, j: number): number {
        //up left
        let up_left = -1;
        let up_right = -1;
        let up = -1;
        let left = -1;
        if (i >= 1) {
            up_left = this.arr[i - 1][j - 1];
            up = this.arr[i - 1][j];
            up_right = this.arr[i - 1][j + 1];
        }
        if (j >= 1)
            left = this.arr[i][j - 1];
        let min = Math.min(up, up_left, up_right, left)
        return min;
    }
}

const manager = new Manager();
