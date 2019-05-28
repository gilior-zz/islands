"use strict";
var MyLocation = Object.freeze({
    "UpLeft": 1,
    "Up": 2,
    "UpRight": 3,
    "DownLeft": 4,
    "Down": 5,
    "DownRight": 6,
    "Left": 7,
    "Right": 8,
    "Self": 9
});
var Manager = /** @class */ (function () {
    function Manager() {
        this.counter = 0;
    }
    Manager.prototype.load = function () {
        document.getElementById('islands_num_place_holder').innerText = '0';
        this.arr = null;
        var rows = document.getElementById('rows');
        var cols = document.getElementById('cols');
        var container = document.getElementById('container');
        container.innerHTML = '';
        this.arr = new Array(+rows.value);
        for (var i = 0; i < +rows.value; i++) {
            var div = document.createElement('div');
            this.arr[i] = new Array(+cols.value);
            for (var j = 0; j < +cols.value; j++) {
                var span = document.createElement('span');
                var num = Math.floor(Math.random() * 10) + 1;
                this.arr[i][j] = num > 8 ? 1 : 0;
                span.innerText = this.arr[i][j].toString();
                span.style.backgroundColor = num > 8 ? 'black' : 'white';
                div.appendChild(span);
                span.setAttribute('id', this.getID(i, j));
            }
            container.appendChild(div);
        }
    };
    Manager.prototype.isVisited = function (i, j) {
        return this.isInBounds(i, j) && this.cloned[i][j] == -1;
    };
    Manager.prototype.caclIslands = function () {
        var islands_num_place_holder = 0;
        this.counter = 0;
        if (!this.arr || this.arr.length === 0)
            return;
        this.cloned = JSON.parse(JSON.stringify(this.arr));
        //1st scan
        for (var i = 0; i < this.arr.length; i++) {
            for (var j = 0; j < this.arr[i].length; j++) {
                if (this.getUnitValue(i, j) == 1) {
                    var arr = [];
                    arr.push(this.getLocationValue(i, j, MyLocation.UpLeft));
                    arr.push(this.getLocationValue(i, j, MyLocation.Up));
                    arr.push(this.getLocationValue(i, j, MyLocation.UpRight));
                    arr.push(this.getLocationValue(i, j, MyLocation.Left));
                    var min = Math.min.apply(Math, arr);
                    if (min == Number.MAX_VALUE) { //we have new island
                        this.counter++;
                        this.cloned[i][j] = this.counter;
                        // islands_num_place_holder++;
                    }
                    else
                        this.cloned[i][j] = min;
                }
            }
        }
        console.log('b4', JSON.parse(JSON.stringify(this.cloned)));
        //2nd scan
        for (var i = this.arr.length - 1; i > -1; i--) {
            for (var j = this.arr[i].length - 1; j > -1; j--) {
                if (this.getUnitValue(i, j) >= 1) {
                    var arr = [];
                    arr.push(this.getLocationValue(i, j, MyLocation.Right));
                    arr.push(this.getLocationValue(i, j, MyLocation.DownRight));
                    arr.push(this.getLocationValue(i, j, MyLocation.UpRight));
                    arr.push(this.getLocationValue(i, j, MyLocation.Down));
                    arr.push(this.getLocationValue(i, j, MyLocation.DownLeft));
                    arr.push(this.getLocationValue(i, j, MyLocation.Self));
                    var min = Math.min.apply(Math, arr);
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
        console.log('after', JSON.parse(JSON.stringify(this.cloned)));
        // document.getElementById('islands_num_place_holder').innerText = islands_num_place_holder.toString();
        // 3rd scan
        var island_colors_dic = {};
        for (var i_1 = 0; i_1 < this.cloned.length; i_1++) {
            for (var j_1 = 0; j_1 < this.cloned[i_1].length; j_1++) {
                var value = this.cloned[i_1][j_1];
                if (value >= 1) { //found island
                    {
                        if (value in island_colors_dic) { // part of ongoing island
                            this.setColor(i_1, j_1, island_colors_dic[value]);
                        }
                        else { //new island to paint
                            island_colors_dic[value] = this.getRandomColor();
                            this.setColor(i_1, j_1, island_colors_dic[value]);
                            islands_num_place_holder++;
                        }
                    }
                }
            }
        }
        document.getElementById('islands_num_place_holder').innerText = islands_num_place_holder.toString();
    };
    Manager.prototype.setUnitValue = function (i, j, value) {
        if (i < 0 || j < 0 || i >= this.arr.length || j >= this.arr[0].length || this.cloned[i][j] === 0)
            return;
        this.cloned[i][j] = value;
    };
    Manager.prototype.getUnitValue = function (i, j) {
        if (i < 0 || j < 0 || i >= this.arr.length || j >= this.arr[0].length)
            return Number.MAX_VALUE;
        return this.cloned[i][j] == 0 ? Number.MAX_VALUE : this.cloned[i][j];
    };
    Manager.prototype.getLocationValue = function (i, j, location) {
        switch (location) {
            case MyLocation.Down:
                return this.getUnitValue(i + 1, j);
            case MyLocation.DownLeft:
                return this.getUnitValue(i + 1, j - 1);
            case MyLocation.DownRight:
                return this.getUnitValue(i + 1, j + 1);
            case MyLocation.Left:
                return this.getUnitValue(i, j - 1);
            case MyLocation.Right:
                return this.getUnitValue(i, j + 1);
            case MyLocation.Up:
                return this.getUnitValue(i - 1, j);
            case MyLocation.UpRight:
                return this.getUnitValue(i - 1, j + 1);
            case MyLocation.UpLeft:
                return this.getUnitValue(i - 1, j - 1);
            case MyLocation.Self:
                return this.getUnitValue(i, j);
        }
    };
    Manager.prototype.setLocationValue = function (i, j, location, value) {
        switch (location) {
            case MyLocation.Down:
                this.setUnitValue(i + 1, j, value);
                break;
            case MyLocation.DownLeft:
                this.setUnitValue(i + 1, j - 1, value);
                break;
            case MyLocation.DownRight:
                this.setUnitValue(i + 1, j + 1, value);
                break;
            case MyLocation.Left:
                this.setUnitValue(i, j - 1, value);
                break;
            case MyLocation.Right:
                this.setUnitValue(i, j + 1, value);
                break;
            case MyLocation.Up:
                this.setUnitValue(i - 1, j, value);
                break;
            case MyLocation.UpRight:
                this.setUnitValue(i - 1, j + 1, value);
                break;
            case MyLocation.UpLeft:
                this.setUnitValue(i - 1, j - 1, value);
                break;
            case MyLocation.Self:
                this.setUnitValue(i, j, value);
                break;
        }
    };
    Manager.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    Manager.prototype.setColor = function (i, j, color) {
        var cell = this.getTableCell(i, j);
        cell.style.backgroundColor = color;
    };
    Manager.prototype.getTableCell = function (i, j) {
        return document.getElementById(this.getID(i, j));
    };
    Manager.prototype.setVisited = function (i, j) {
        this.cloned[i][j] = -1;
    };
    Manager.prototype.getID = function (i, j) {
        return i.toString() + ',' + j.toString();
    };
    Manager.prototype.markIsland = function (i, j) {
        var rndColor = this.getRandomColor();
        this.setColor(i, j, rndColor);
        this.markNeighbors(rndColor, i, j);
    };
    Manager.prototype.markNeighbors = function (color, i, j) {
        var _this = this;
        var neighbors = this.getRelevantNeighbors(i, j);
        neighbors.forEach(function (item) {
            _this.setColor(item.x, item.y, color);
            _this.markNeighbors(color, item.x, item.y);
        });
    };
    Manager.prototype.getRelevantNeighbors = function (i, j) {
        var x, y;
        var arr = new Array();
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
    };
    Manager.prototype.handleCell = function (x, y, arr) {
        if (!this.isVisited(x, y))
            if (this.isInBounds(x, y)) {
                this.setVisited(x, y);
                if (this.arr[x][y] == 1)
                    arr.push({ x: x, y: y });
            }
    };
    Manager.prototype.isInBounds = function (i, j) {
        return i > -1 && j > -1 && i < this.arr.length && j < this.arr[0].length;
    };
    return Manager;
}());
var manager = new Manager();
