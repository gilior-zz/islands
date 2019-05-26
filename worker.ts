var i=0;
class MyWorker {
    timedCount() {
        i=i+1;
        postMessage(i,'*');
        setTimeout("timedCount()", 500);
    }
}


new MyWorker().timedCount();