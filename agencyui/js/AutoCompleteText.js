com = function() {

}
com.prototype = {
	auth : "wanglin",
	version : "1.0"
}
com.dc = function() {

}
com.dc.zzrx = function() {

}
com.dc.zzrx.compoment = function() {

}
com.dc.zzrx.compoment.TextItem = function(id, text, number, showunmber, showimg) {
	this.id=id;
	this.element = document.createElement("div");
	this.element.style.borderColor="#506BD8";
	if (id != null && id != undefined)
		this.element.id = id+"_TextItem";
	this.nobr = document.createElement("nobr");
	this.nobr.id=this.element.id+"_nobr";
	this.element.appendChild(this.nobr);
	this.etext = document.createElement("span");
	this.etext.id=this.nobr.id+"_etext";
	this.nobr.appendChild(this.etext);
	this.enumber = document.createElement("span");
	this.enumber.id=this.nobr.id+"_enumber";
	this.eimg = document.createElement("img");
	this.showunmber = false;
	this.showimg = false;
	this.text = "kong";
	if (text != null && text != undefined) {
		this.text = text;
	}
	this.number = "kong";
	if (number != null && number != undefined) {
		this.number = "___________________("+number+")____";
	}
	if (showunmber != null && showunmber != undefined) {
		this.showunmber = showunmber;
	}
	if (showimg != null && showimg != undefined) {
		this.showimg = showimg;
	}
	this.addnumber = false;
	this.addimg = false;
	this.act=null;
	this.addEventListener();
}
com.dc.zzrx.compoment.TextItem.prototype = {
	EIMGDRC : "",
	drawItem : function() {
		if (document.all) {
			this.etext.innerHTML = this.text;
		} else {
//			this.etext.textContent = this.text;
			this.etext.innerHTML=this.text;
		}
		if (this.showunmber && !this.addnumber) {
			this.nobr.appendChild(this.enumber);
			if (document.all) {
				this.enumber.innerText = this.number;
			} else {
				this.enumber.textContent = this.number;
			}
			this.addnumber = true;
		}
		if (this.showimg && !this.addimg) {
			this.nobr.appendChild(this.eimg);
			this.eimg.src = this.EIMGDRC;
			this.addimg = true;
		}
	},
	reDrawItem : function() {
		if (this.showunmber) {
			if (document.all) {
				this.enumber.innerText = this.number;
			} else {
				this.enumber.textContent = this.number;
			}
			if (!this.addnumber) {
				if (this.addimg) {
					this.nobr.insertBefore(this.enumber, this.eimg);
				} else {
					this.nobr.appendChild(this.enumber);
				}
				this.addnumber = true;
			}
		} else {
			this.nobr.appendChild(this.enumber);
			this.addnumber = false;
		}
		if (this.showimg) {
			this.eimg.src = this.EIMGDRC;
			if (!this.addimg) {
				this.nobr.appendChild(this.eimg);
				this.addnumber = true;
			}
		} else {
			this.nobr.appendChild(this.eimg);
			this.addimg = false;
		}
	},
	setCurrent : function(iscurrent) {
		if (iscurrent != null && iscurrent != undefined) {
			if (iscurrent === true) {
				this.element.style.backgroundColor = "#506BD8";
				this.element.style.color = "white";
			} else if (iscurrent === false) {
				this.element.style.backgroundColor = "#C8D2F0";
				this.element.style.color = "black";
			}
		}
	},
	addEventListener:function(){
		var ttt=this;
		this.element.onmouseover=function(){
			this.style.cursor = "hand";
			ttt.setCurrent(true);
			if(ttt.act!=null||ttt.act!=undefined){
				var items=ttt.act.items;
				for(var i=0;i<items.length;i++){
					if(items[i]==ttt){
						ttt.act.currentIndex=i;
						break;
					}
				}
			}
		}
		this.element.onmouseout=function(){
			this.style.cursor = "auto";
			ttt.setCurrent(false);
		}
		this.element.onclick=function(){
			ttt.act.etext.value=document.all?ttt.etext.innerText:ttt.etext.textContent;
			ttt.act.selectedItem=ttt.act.items[ttt.act.currentIndex];
			if(ttt.act.afterSelectedCallFunction){
				var funstr=ttt.act.afterSelectedCallFunction+"(\""+ttt.act.selectedItem.id+"\")";
				eval(funstr);
			}
			//alert(ttt.act.items[ttt.act.currentIndex].id);
			//tt.selectedItem=tt.items[tt.currentIndex];
			ttt.act.complete();
		}
	}
}

com.dc.zzrx.compoment.AutoCompleteText = function(id, textId) {
	this.element = document.createElement("div");
	this.main = document.createElement("div");
	this.main.style.position="relative";
	this.main.style.top=-this.offset;
	this.main.style.left=-this.offset;
	this.main.style.padding="2px";
	this.main.style.border="1px solid #506BD8";
	this.main.style.background="#fff";
	this.main.style.color="#555";
	this.element.appendChild(this.main);
	this.element.style.background="#ccc";
	this.element.style.zIndex = "1000";
	if (id != null && id != undefined)
		this.element.id = id+"_AutoCompleteText";
	this.head = document.createElement("div");
//	if(document.all){
//		this.head.innerText = "Header";
//	}else{
//		this.head.textContent = "Header";
//	}
	this.head.innerHTML="<table width=100%><tr><td align=left>Header</td><td align=right><input type=button value=close></td></tr></table>";
	this.head.id=this.element.id+"_head"
	this.hnobr = document.createElement("nobr");
	this.hnobr.id=this.element.id+"_head_hnobr";
//	this.hnobr.innerHTML='<input type=button value=show onclick="alert(this.innerHTML)">';
	this.head.appendChild(this.hnobr);
	this.body = document.createElement("div");
	this.body.id=this.element.id+"_body";
	this.main.appendChild(this.head);
	this.main.appendChild(this.body);
	this.etext = document.getElementById(textId);
	this.element.style.position = "absolute";
	this.initPosition();
	document.body.appendChild(this.element);
	this.addEventListener();
	this.items = new Array();
	this.currentIndex =0;
	this.element.style.display="none";
	this.selectedItem=null;
	this.afterSelectedCallFunction="";
}
com.dc.zzrx.compoment.AutoCompleteText.prototype = {
	offset:10,
	initPosition : function() {
		this.element.style.left = this.getX(this.etext)+this.offset;
		this.element.style.top = (this.getY(this.etext) + this.etext.offsetHeight)+this.offset;
//		alert(this.element.style.top + "," + this.element.style.left);
	},
	getY : function(e) {
		var offset = e.offsetTop;
		if (e.offsetParent != null)
			offset += this.getY(e.offsetParent);
		return offset;
	},
	getX : function(e) {
		var offset = e.offsetLeft;
		if (e.offsetParent != null)
			offset += this.getX(e.offsetParent);
		return offset;
	},
	createItems : function() {
		this.body.innerHTML = "";
		for (var i = 0; this.items.length > 0;) {
			this.items.splice(i, 1);
		}
		var jsonitems = eval(this.loadJSONData());
		if (jsonitems instanceof Array) {
			for (var i = 0; i < jsonitems.length; i++) {
				var jsonitem = jsonitems[i];
				var realItem=new com.dc.zzrx.compoment.TextItem(jsonitem.id,jsonitem.text,jsonitem.number);
				realItem.act=this;
				realItem.showunmber=true;
				realItem.showimg=true;
				realItem.drawItem();
				this.body.appendChild(realItem.element);
				realItem.setCurrent(false);
				this.items.push(realItem);
			}
		}
		this.element.style.display="block";
		if(this.items.length>0){
			this.currentIndex=0;
			this.selectCurrentItem(this.currentIndex);
		}
	},
	loadJSONData : function() {
		var ss='[{id:"aaaaaaaaaa",text:"aaaaaaaaaa",number:100},{id:"bbbbbbbbbbb",text:"bbbbbbbbbbb<img src=imgs/eee.gif>",number:1000},{id:"ccccccccccccccc",text:"ccccccccccccccc<img src=imgs/eee.gif>",number:10000},{id:"ddddddddddddd",text:"ddddddddddddd",number:10},{id:"eeeeeeeeeee",text:"eeeeeeeeeee",number:100000}]';
		return ss;
	},
	selectCurrentItem : function(index) {
		for (var i = 0; i < this.items.length; i++) {
			var item = this.items[i];
			if (item != null && item != undefined&& item instanceof com.dc.zzrx.compoment.TextItem) {
				if (i == index) {
					item.setCurrent(true);
				}else{
					item.setCurrent(false);
				}
			}
		}
	},
	complete:function(){
		this.element.style.display="none";
		this.currentIndex=-1;
	},
	addEventListener : function() {
		var tt = this;
		if(tt.element.style.display!="none"){
			this.etext.onkeyup = function(eve) {
				var localKeyCode=document.all?window.event.keyCode:eve.which;
				if (localKeyCode == 13) {// �س�
					this.value = document.all ? tt.items[tt.currentIndex].etext.innerText :  tt.items[tt.currentIndex].etext.textContent;
					//alert(tt.items[tt.currentIndex]);
					tt.selectedItem=tt.items[tt.currentIndex];
					if(tt.afterSelectedCallFunction){
						var funstr=tt.afterSelectedCallFunction+"(\""+tt.selectedItem.id+"\")";
						//alert(funstr);
						eval(funstr);
					}
					tt.complete();
				} else if (localKeyCode == 38) {// ��
					tt.items[tt.currentIndex].setCurrent(false);
					if (tt.currentIndex <=0) {
						tt.currentIndex=tt.items.length-1;
					}else{
						tt.currentIndex--;
					}
					tt.items[tt.currentIndex].setCurrent(true);
//					tt.selectCurrentItem(tt.currentIndex);
				} else if (localKeyCode == 40) {// ��
					tt.items[tt.currentIndex].setCurrent(false);
					if(tt.currentIndex>=tt.items.length-1){
						tt.currentIndex=0;
					}else{
						tt.currentIndex++;
					}
					tt.items[tt.currentIndex].setCurrent(true);
//					tt.selectCurrentItem(tt.currentIndex);
				} else if(localKeyCode==27){//esc
					tt.complete();
				}else {
					tt.createItems();
				}
			}
		}
		this.head.onclick=function(){
			tt.complete();
		}
	},
	getSelectedItem:function(){
		return this.tt.selectedItem;
	}
}