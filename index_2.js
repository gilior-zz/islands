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
        this.build_model_layout(rows, cols);
        this.build_mat_layout(container);
    };
    Manager.prototype.build_mat_layout = function (container) {
        for (var i = 0; i < this.arr.length; i++) {
            var div = document.createElement('div');
            for (var j = 0; j < this.arr[i].length; j++) {
                var span = document.createElement('span');
                var num = this.arr[i][j];
                span.innerText = num.toString();
                if (num)
                    span.style.backgroundColor = 'black';
                div.appendChild(span);
                span.setAttribute('id', this.getID(i, j));
            }
            container.appendChild(div);
        }
    };
    Manager.prototype.build_model_layout = function (rows, cols) {
        for (var i = 0; i < +rows.value; i++) {
            this.arr[i] = new Array(+cols.value);
            for (var j = 0; j < +cols.value; j++) {
                var num = Math.floor(Math.random() * 10) + 1;
                this.arr[i][j] = num > 8 ? 1 : 0;
            }
        }
    };
    Manager.prototype.caclIslands = function () {
        var islands_num_place_holder = 0;
        this.counter = 0;
        if (!this.arr || this.arr.length === 0)
            return;
        this.cloned = JSON.parse(JSON.stringify(this.arr));
        this.scan_forward();
        this.scan_backward();
        //set colors
        islands_num_place_holder = this.set_colors(islands_num_place_holder);
        document.getElementById('islands_num_place_holder').innerText = islands_num_place_holder.toString();
    };
    Manager.prototype.set_colors = function (islands_num_place_holder) {
        var island_colors_dic = {};
        for (var i_1 = 0; i_1 < this.cloned.length; i_1++) {
            for (var j = 0; j < this.cloned[i_1].length; j++) {
                var value = this.cloned[i_1][j];
                if (value >= 1) { //found island
                    {
                        if (value in island_colors_dic) { // part of ongoing island
                            this.setColor(i_1, j, island_colors_dic[value]);
                        }
                        else { //new island to paint
                            island_colors_dic[value] = this.getRandomColor();
                            this.setColor(i_1, j, island_colors_dic[value]);
                            islands_num_place_holder++;
                        }
                    }
                }
            }
        }
        return islands_num_place_holder;
    };
    Manager.prototype.scan_backward = function () {
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
    };
    Manager.prototype.scan_forward = function () {
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
        var cell = this.getSpan(i, j);
        cell.style.backgroundColor = color;
    };
    Manager.prototype.getSpan = function (i, j) {
        return document.getElementById(this.getID(i, j));
    };
    Manager.prototype.getID = function (i, j) {
        return i.toString() + ',' + j.toString();
    };
    return Manager;
}());
var manager = new Manager();
