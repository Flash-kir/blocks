'use strict';

let btn = document.getElementById("btn");
let sh = document.getElementById("sheet");
let activeElement = null, cX = 0, cY = 0;

function getRandom(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function ajaxGet(el, method='GET', pk="", url="http://193.106.92.212:8000/api/shape/") {
  return new Promise( function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url+pk, true);

    xhr.responseType = 'json';
    
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

    xhr.onload = function () {
      if (this.status == 200) {
        resolve(this.response);
      } else {
        let err = new Error(this.status);
        err.code = this.status;
        reject(err);
      }
    };

    xhr.onerror = function () {
      reject("Наверное что-то случилось..");
    };
    
    if (method=='POST' || method=='PUT'){
      let body = JSON.stringify({
        'class':el.className,
        'style': {
          'top':el.style.top, 
          'left':el.style.left, 
          'position':el.style.position,
          'background-color':el.style.backgroundColor,
          'width':el.style.width,
          'height':el.style.height
        },
        'type':el.nodeName
      });
      xhr.send(body);
    } else {
      xhr.send();
    }
  });
}

function addBlk(send=1, obj, type='DIV') {
  let blkBtn = document.createElement('div');
  blkBtn.className = "blk__btn-rm";
  blkBtn.innerText = "x";
  if (obj) {
    type = obj.type
  }
  let blk = document.createElement(type), w = 0, h = 0, t = 0, l = 0, c = 0;
  if (send==1) {
    l = getRandom(sh.offsetLeft, sh.clientWidth-sh.offsetLeft);
    t = getRandom(sh.offsetTop, sh.clientHeight-sh.offsetTop);
    w = getRandom(20, sh.clientWidth-l);
    h = getRandom(20, sh.clientHeight-t);
    c = "rgb("+getRandom(0,255)+","+getRandom(0,255)+","+getRandom(0,255)+")";
    blk.className = "blk";
    blk.style = "background-color: "+ c +"; "+
      "position: absolute; "+
      "left: "+l+"px; "+
      "top: "+t+"px; "+
      "width: "+w+"px; "+
      "height: "+h+"px; ";
    ajaxGet(blk, 'POST').then((resp)=> {blk.id = resp.id; console.log("block "+ resp.id +" created")});
  } else {
    l = obj.style["left"];
    t = obj.style["top"];
    w = obj.style["width"];
    h = obj.style["height"];
    c = obj.style["background-color"];
    blk.className = obj["class"];
    blk.id = obj["id"];
    blk.style = "background-color: "+ c +"; "+
      "position: absolute; "+
      "left: "+l+"; "+
      "top: "+t+"; "+
      "width: "+w+"; "+
      "height: "+h+"; ";
  }
  blk.appendChild(blkBtn);
  return blk
}

function add(e) {
  sh.appendChild( addBlk() )
}

function del(el) {
  ajaxGet(el, 'DELETE', el.parentNode.id+"/").then((resp)=> {blk.id = resp.id; console.log("block "+ resp.id +" deleted")});
  el.parentNode.remove();
}

function blk(e) {
  if (e.target.className == 'blk__btn-rm') {
    del(e.target);
  }
}

function mDown(e) {
  activeElement = e.target;
  cX = e.offsetX;
  cY = e.offsetY;
}

function mUp(e) {
  if ('blk' == e.target.className){
    ajaxGet(e.target, 'PUT', e.target.id+"/").then((resp)=> {blk.id = resp.id; console.log("block "+ resp.id +" updated")});
  }
  activeElement = null;
}

function mMove(e) {
  if (activeElement) {
    activeElement.style.left = (e.clientX - cX) + 'px';
    activeElement.style.top = (e.clientY - cY) + 'px';
  }
}

function ready() {
  ajaxGet(document, 'GET').then((resp)=> {
    for (let i = 0; i < resp.length; i++) {
      sh.appendChild( addBlk(0, resp[i]) )
    }
    console.log("all blocks created")
  });
}

btn.addEventListener('click', add);
sh.addEventListener('click', blk);
sh.addEventListener('mousedown', mDown);
sh.addEventListener('mouseup', mUp);
sh.addEventListener('mousemove', mMove);
document.addEventListener("DOMContentLoaded", ready);

