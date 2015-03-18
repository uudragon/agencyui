function urlhelper(className,methodName,queryobj){
	var rs=basepath+"operate.op?className=com.dc.esb.console.service."+className+"&methodName="+methodName;
	if(queryobj){
		var other="&";
		for(var pname in queryobj){
			other+=pname+"="+queryobj[pname];
			other+="&"
		}
		other=other.substring(0, other.lastIndexOf("&"));
		rs+=other;
	}
	//alert(rs);
	return rs;
}
function urlHelperUtil(className,methodName,queryobj){
	var rs=basepath+"operate.op?className="+className+"&methodName="+methodName;
	if(queryobj){
		var other="&";
		for(var pname in queryobj){
			other+=pname+"="+queryobj[pname];
			other+="&"
		}
		other=other.substring(0, other.lastIndexOf("&"));
		rs+=other;
	}
	//alert(rs);
	return rs;
}
function urlhelperForCatalog(className,methodName,queryobj){
	var rs=basepath+"operate.op?className=com.dc.esb.console.catalog.service."+className+"&methodName="+methodName;
	if(queryobj){
		var other="&";
		for(var pname in queryobj){
			other+=pname+"="+queryobj[pname];
			other+="&"
		}
		other=other.substring(0, other.lastIndexOf("&"));
		rs+=other;
	}
	//alert(rs);
	return rs;
}
function newurlhelper(url,queryobj){
	var rs=url;
	if(queryobj){
		var other="&";
		for(var pname in queryobj){
			other+=pname+"="+queryobj[pname];
			other+="&"
		}
		other=other.substring(0, other.lastIndexOf("&"));
		rs+=other;
	}
	//alert(rs);
	return rs;
}
function $$(id){
	return document.getElementById(id);
}
function submitbyajax(url,func,type,data){
	if(!type){
		type="html";
	}
	$.ajax({
		  async:true,
		  type: "POST",
		  cache: false,
		  dataType:type,
		  url: url,
		  data: data,
		  success: function(html){
			//alert(html);
		  }
		}).done(function( msg ) {
			//alert("asdfasdf");
			eval(func+"('"+msg+"')");
		});
}
function submitbyajaxforguide(url,func,type){
	if(!type){
		type="html";
	}
	$.ajax({
		  type: "POST",
		  cache: false,
		  dataType:type,
		  url: url,
		  data: "",
		  success: function(html){
			//alert(html);
		  }
		}).done(function( msg ) {
			//alert(msg);
			var funstr=func+'("'+msg+'")';
			//alert(funstr);
			eval(funstr);
		});
}
function submitbyajaxsyn(url,func,type){
	if(!type){
		type="html";
	}
	$.ajax({
		  async:false,
		  type: "POST",
		  cache: false,
		  dataType:type,
		  url: url,
		  data: "",
		  success: function(html){
			//alert(html);
		  }
		}).done(function( msg ) {
			//alert("asdfasdf");
			eval(func+"('"+msg+"')");
		});
}
function jsonToObj(str){
	var obj;
	var str="obj="+str;
	obj=eval(str);
	return obj;
}

// 根据id数组查询datagrid中的指定字段值
function getFields(el,ids,field){
	var rows = $('#'+el).datagrid('getRows');
	var rn =[],id=ids.split(',');
	if(rows.length>0){
		for(var i=0;i<rows.length;i++){
			for(var j=0;j<id.length;j++){
				if(rows[i].id==id[j]){
					rn.push(rows[i][field]);
					id.splice(j,1);
					break;
				}
			}
		}
	}
	return rn.join(',');
}