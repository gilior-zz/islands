"use strict";
var i = 0;
var MyWorker = /** @class */ (function () {
    function MyWorker() {
    }
    MyWorker.prototype.timedCount = function () {
        i = i + 1;
        postMessage(i, '*');
        setTimeout("timedCount()", 500);
    };
    return MyWorker;
}());
new MyWorker().timedCount();
