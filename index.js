"use strict";
var Foo = /** @class */ (function () {
    function Foo() {
    }
    Foo.prototype.load = function () {
        document.getElementById('islands_num_place_holder').innerText = '0';
        this.arr = null;
        var rows = document.getElementById('rows');
        var cols = document.getElementById('cols');
        var container = document.getElementById('container');
        // var tblContainer = document.getElementById('tbl-container') as HTMLDivElement;
        // tblContainer.innerHTML = '';
        container.innerHTML = '';
        this.arr = new Array(+rows.value);
        for (var i = 0; i < +rows.value; i++) {
            this.arr[i] = new Array(+cols.value);
            for (var j = 0; j < +cols.value; j++) {
                var num = Math.floor(Math.random() * 10) + 1;
                this.arr[i][j] = num > 8 ? 1 : 0;
            }
        }
        for (var i = 0; i < this.arr.length; i++) {
            var div = document.createElement('div');
            for (var j = 0; j < this.arr[i].length; j++) {
                var span = document.createElement('span');
                span.innerText = this.arr[i][j].toString();
                var is_one = this.arr[i][j] == 1;
                if (is_one)
                    span.style.backgroundColor = 'black';
                else
                    span.style.backgroundColor = 'white';
                div.appendChild(span);
                span.setAttribute('id', this.getID(i, j));
            }
            container.appendChild(div);
        }
    };
    Foo.prototype.isVisited = function (i, j) {
        return this.isInBounds(i, j) && this.visited_arr[i][j] == -1;
    };
    Foo.prototype.caclIslands = function () {
        var islands_num_place_holder = 0;
        if (!this.arr || this.arr.length === 0)
            return;
        this.visited_arr = JSON.parse(JSON.stringify(this.arr));
        for (var i = 0; i < this.arr.length; i++) {
            for (var j = 0; j < this.arr[i].length; j++) {
                if (this.visited_arr[i][j] != -1) {
                    this.setVisited(i, j);
                    if (this.arr[i][j] == 1) {
                        islands_num_place_holder++;
                        document.getElementById('islands_num_place_holder').innerText = islands_num_place_holder.toString();
                        this.markIsland(i, j);
                    }
                }
            }
        }
    };
    Foo.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    Foo.prototype.setColor = function (i, j, color) {
        var cell = this.getTableCell(i, j);
        cell.style.backgroundColor = color;
    };
    Foo.prototype.getTableCell = function (i, j) {
        return document.getElementById(this.getID(i, j));
    };
    Foo.prototype.setVisited = function (i, j) {
        this.visited_arr[i][j] = -1;
    };
    Foo.prototype.getID = function (i, j) {
        return i.toString() + ',' + j.toString();
    };
    Foo.prototype.markIsland = function (i, j) {
        var rndColor = this.getRandomColor();
        this.setColor(i, j, rndColor);
        this.markNeighbors(rndColor, i, j);
    };
    Foo.prototype.markNeighbors = function (color, i, j) {
        var _this = this;
        var neighbors = this.getRelevantNeighbors(i, j);
        neighbors.forEach(function (item) {
            _this.setColor(item.x, item.y, color);
            _this.markNeighbors(color, item.x, item.y);
        });
    };
    Foo.prototype.getRelevantNeighbors = function (i, j) {
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
    Foo.prototype.handleCell = function (x, y, arr) {
        if (!this.isVisited(x, y))
            if (this.isInBounds(x, y)) {
                this.setVisited(x, y);
                if (this.arr[x][y] == 1)
                    arr.push({ x: x, y: y });
            }
    };
    Foo.prototype.isInBounds = function (i, j) {
        return i > -1 && j > -1 && i < this.arr.length && j < this.arr[0].length;
    };
    return Foo;
}());
var foo = new Foo();
