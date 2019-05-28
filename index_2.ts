const MyLocation = Object.freeze({
    "UpLeft": 1,
    "Up": 2,
    "UpRight": 3,
    "DownLeft": 4,
    "Down": 5,
    "DownRight": 6,
    "Left": 7,
    "Right": 8,
    "Self": 9
})


class Manager {
    private arr: Array<Array<number>>;
    private cloned;
    private counter: number = 0;

    load() {
        document.getElementById('islands_num_place_holder').innerText = '0';

        this.arr = null;
        var rows = document.getElementById('rows') as HTMLInputElement;
        var cols = document.getElementById('cols') as HTMLInputElement;
        var container = document.getElementById('container') as HTMLDivElement;

        container.innerHTML = '';
        this.arr = new Array(+rows.value);

        this.build_model_layout(rows, cols);

        this.build_mat_layout(container);
    }

    private build_mat_layout(container) {
        for (var i = 0; i < this.arr.length; i++) {
            var div = document.createElement('div');
            for (var j = 0; j < this.arr[i].length; j++) {
                var span = document.createElement('span');
                let num = this.arr[i][j];
                span.innerText = num.toString();
                if (num)
                    (<HTMLSpanElement>span).style.backgroundColor = 'black';
                div.appendChild(span);
                span.setAttribute('id', this.getID(i, j))
            }
            container.appendChild(div)
        }
    }

    private build_model_layout(rows, cols) {
        for (var i = 0; i < +rows.value; i++) {
            this.arr[i] = new Array(+cols.value);
            for (var j = 0; j < +cols.value; j++) {
                var num = Math.floor(Math.random() * 10) + 1;
                this.arr[i][j] = num > 8 ? 1 : 0;
            }
        }
    }

    caclIslands() {
        var islands_num_place_holder = 0;
        this.counter = 0;
        if (!this.arr || this.arr.length === 0) return;
        this.cloned = JSON.parse(JSON.stringify(this.arr));

        this.scan_forward();

        this.scan_backward();

        //set colors
        islands_num_place_holder = this.set_colors(islands_num_place_holder);
        document.getElementById('islands_num_place_holder').innerText = islands_num_place_holder.toString();


    }

    private set_colors(islands_num_place_holder: number) {
        let island_colors_dic: { [id: number]: string } = {};
        for (let i = 0; i < this.cloned.length; i++) {
            for (let j = 0; j < this.cloned[i].length; j++) {
                let value = this.cloned[i][j];
                if (value >= 1) { //found island
                    {
                        if (value in island_colors_dic) {// part of ongoing island
                            this.setColor(i, j, island_colors_dic[value]);
                        }
                        else { //new island to paint
                            island_colors_dic[value] = this.getRandomColor();
                            this.setColor(i, j, island_colors_dic[value]);
                            islands_num_place_holder++;
                        }
                    }
                }
            }
        }
        return islands_num_place_holder;
    }

    private scan_backward() {
        for (var i = this.arr.length - 1; i > -1; i--) {
            for (var j = this.arr[i].length - 1; j > -1; j--) {
                if (this.getUnitValue(i, j) >= 1) {
                    let arr: number[] = [];
                    arr.push(this.getLocationValue(i, j, MyLocation.Right));
                    arr.push(this.getLocationValue(i, j, MyLocation.DownRight));
                    arr.push(this.getLocationValue(i, j, MyLocation.UpRight));
                    arr.push(this.getLocationValue(i, j, MyLocation.Down));
                    arr.push(this.getLocationValue(i, j, MyLocation.DownLeft));
                    arr.push(this.getLocationValue(i, j, MyLocation.Self));
                    let min = Math.min(...arr);
                    if (min != Number.MAX_VALUE && min < this.cloned[i][j]) { //we have new island

                        // this.cloned[i][j] = this.counter;
                        this.setLocationValue(i, j, MyLocation.Self, min);
                        this.setLocationValue(i, j, MyLocation.Right, min);
                        this.setLocationValue(i, j, MyLocation.DownRight, min);
                        this.setLocationValue(i, j, MyLocation.UpRight, min);
                        this.setLocationValue(i, j, MyLocation.Down, min);
                        this.setLocationValue(i, j, MyLocation.DownLeft, min);
                    }
                }
            }
        }
    }

    private scan_forward() {
        for (var i = 0; i < this.arr.length; i++) {
            for (var j = 0; j < this.arr[i].length; j++) {
                if (this.getUnitValue(i, j) == 1) {
                    let arr: number[] = [];
                    arr.push(this.getLocationValue(i, j, MyLocation.UpLeft));
                    arr.push(this.getLocationValue(i, j, MyLocation.Up));
                    arr.push(this.getLocationValue(i, j, MyLocation.UpRight));
                    arr.push(this.getLocationValue(i, j, MyLocation.Left));
                    let min = Math.min(...arr);
                    if (min == Number.MAX_VALUE) { //we have new island
                        this.counter++;
                        this.cloned[i][j] = this.counter;
                        // islands_num_place_holder++;
                    }
                    else {
                        this.setLocationValue(i, j, MyLocation.Self, min);
                        this.setLocationValue(i, j, MyLocation.UpLeft, min);
                        this.setLocationValue(i, j, MyLocation.Up, min);
                        this.setLocationValue(i, j, MyLocation.UpRight, min);
                        this.setLocationValue(i, j, MyLocation.Left, min);
                    }


                }
            }
        }
    }

    setUnitValue(i: number, j: number, value: number): void {
        if (i < 0 || j < 0 || i >= this.arr.length || j >= this.arr[0].length || this.cloned[i][j] === 0) return;
        this.cloned[i][j] = value
    }

    getUnitValue(i: number, j: number): number {
        if (i < 0 || j < 0 || i >= this.arr.length || j >= this.arr[0].length) return Number.MAX_VALUE;
        return this.cloned[i][j] == 0 ? Number.MAX_VALUE : this.cloned[i][j];
    }

    getLocationValue(i: number, j: number, location: number): number | undefined {
        switch (location) {
            case  MyLocation.Down:
                return this.getUnitValue(i + 1, j);
            case  MyLocation.DownLeft:
                return this.getUnitValue(i + 1, j - 1);
            case  MyLocation.DownRight:
                return this.getUnitValue(i + 1, j + 1);
            case  MyLocation.Left:
                return this.getUnitValue(i, j - 1);
            case  MyLocation.Right:
                return this.getUnitValue(i, j + 1);
            case  MyLocation.Up:
                return this.getUnitValue(i - 1, j);
            case  MyLocation.UpRight:
                return this.getUnitValue(i - 1, j + 1);
            case  MyLocation.UpLeft:
                return this.getUnitValue(i - 1, j - 1);
            case  MyLocation.Self:
                return this.getUnitValue(i, j);
        }
    }

    setLocationValue(i: number, j: number, location: number, value: number): void {
        switch (location) {
            case  MyLocation.Down:
                this.setUnitValue(i + 1, j, value);
                break;
            case  MyLocation.DownLeft:
                this.setUnitValue(i + 1, j - 1, value);
                break;
            case  MyLocation.DownRight:
                this.setUnitValue(i + 1, j + 1, value);
                break;
            case  MyLocation.Left:
                this.setUnitValue(i, j - 1, value);
                break;
            case  MyLocation.Right:
                this.setUnitValue(i, j + 1, value);
                break;
            case  MyLocation.Up:
                this.setUnitValue(i - 1, j, value);
                break;
            case  MyLocation.UpRight:
                this.setUnitValue(i - 1, j + 1, value);
                break;
            case  MyLocation.UpLeft:
                this.setUnitValue(i - 1, j - 1, value);
                break;
            case  MyLocation.Self:
                this.setUnitValue(i, j, value);
                break;
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
        let cell = this.getSpan(i, j);
        cell.style.backgroundColor = color;

    }

    private getSpan(i, j): HTMLSpanElement {
        return document.getElementById(this.getID(i, j)) as HTMLSpanElement
    }
    private getID(i: number, j: number): string {
        return i.toString() + ',' + j.toString();
    }







}

const manager = new Manager();
