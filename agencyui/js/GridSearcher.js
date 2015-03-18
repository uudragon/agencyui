// 定义String的trim函数
String.prototype.trim=function(){
	return this.replace(/^[\s\t ]+|[\s\t ]+$/g, '');
}
/**
* 列表查询模块组件
* @author xuxyc
*/
function GridSearcher(conf){
	// default configs
	// 最多条件项列数
	this.maxCols=5;
	// 默认列数
	this.cols=4;
	// 默认可折叠
	this.collapsible=true;
	// 其他参数
	this.extraParams={};
	// 查询参数名称
	this.paramName='q';
	// 默认可用
	this.disabled=false;
	
	$.extend(this, conf);
	this.init();
}

GridSearcher.prototype={
	init:function(){
		// 将grid用一个div包起来，避免grid太高被挤下去看不到分页工具条
		var gridWrap=$('<div></div>'),mh=$(document).height();
		this.maxCols=Math.floor($(document).width()/285);
		if(this.winElId){
			mh=$('#'+this.winElId).height();
		}
		gridWrap.height(mh-42);
		gridWrap.css('overflow','hidden');
		$('#'+this.gridId).wrap(gridWrap);
		
		var queryBlock=$('<div></div>'),queryTitle=$('<div></div>'),queryWrap=$('<div></div>'),queryItems=$('<table></table>');
		queryBlock.append(queryTitle);
		queryBlock.append(queryWrap);
		queryWrap.append(queryItems);
		$('#'+this.prependTo).prepend(queryBlock);
		queryBlock.attr('class','query-block');
		queryTitle.attr('class','query-title');
		if(this.disabled){
			queryTitle.attr('class', 'query-title-disabled');
		}
		queryTitle.html('<span class="slide-tip"></span><span>查询</span>');
		
		queryWrap.attr('class','query-wrap');
		queryItems.attr('class','query-items');
		var itemEl=[];
		this.cols = (this.cols > this.maxCols) ? this.maxCols : this.cols;
		for(var i=0;i<this.items.length;i+=this.cols){
			var tr=$('<tr></tr>');
			queryItems.append(tr);
			for(var j=0;j<this.cols;j++){
				var h=i+j;
				if(h<this.items.length){
					var tdLabel=$('<td></td>'),tdInput=$('<td></td>');
					tr.append(tdLabel);
					tr.append(tdInput);
					if(this.items[h].type=='textarea'){
						tdLabel.css('vertical-align','top');
					}
					tdLabel.attr('class','query-label');
					tdInput.attr('class','query-input');
					tdLabel.html(this.items[h].label);
					var input=this.buildEl(this.items[h]);
					itemEl.push(input);
					tdInput.append(input);
				}
			}
		}
		var self=this;
		// 获取查询字符串
		this.getQword=function(){
			var params='';
			for(var i=0;i<itemEl.length;i++){
				var v=itemEl[i].val()||'';
				v=v.trim();
				if(v!=''){
					params+='&'+self.items[i].name+'='+v;
				}
			}
			params+='&token='+getCookie('token');
			if(params.length>0){
				params=params.substr(1);
			}
			return params;
		};
		
		var id1='queryBtn_'+(new Date().getTime()),
		id2='resetBtn_'+(new Date().getTime()),
		btns=$('<div class="gs-btn-wrap"><div class="query-btns"><input id="'+id1+'" type="button" value="查询"/><input id="'+id2+'" type="button" value="重置"/></div></div>'),
		queryHeight=0;
		queryWrap.append(btns);
		
		var qtClick=function(){
			queryTitle.unbind('click');
			if(queryWrap.css('display')=='none') {
				queryWrap.slideDown('fast',function(){
					$('.slide-tip').css('background-position','0 7px');
					queryHeight=queryWrap.height();
					$('#'+self.gridId).datagrid('getPanel').animate({
						height: $('#'+self.gridId).datagrid('getPanel').height()-queryHeight-1
					},'fast');
					$('#'+self.prependTo+' .datagrid-view').animate({
						height: $('#'+self.prependTo+' .datagrid-view').height()-queryHeight-1
					},'fast');
					$('#'+self.prependTo+' .datagrid-body').animate({
						height: $('#'+self.prependTo+' .datagrid-body').height()-queryHeight-1
					},'fast');
					var gridWrap=$($(this).parent().next('div'));
					gridWrap.height(gridWrap.height()-queryHeight-1);
					queryTitle.bind('click', qtClick);
				});
			} else {
				queryWrap.slideUp('fast',function(){
					$('.slide-tip').css('background-position','-16px 7px');
					$('#'+self.gridId).datagrid('getPanel').animate({
						height: $('#'+self.gridId).datagrid('getPanel').height()+queryHeight+1
					},'fast');
					$('#'+self.prependTo+' .datagrid-view').animate({
						height: $('#'+self.prependTo+' .datagrid-view').height()+queryHeight+1
					},'fast');
					$('#'+self.prependTo+' .datagrid-body').animate({
						height: $('#'+self.prependTo+' .datagrid-body').height()+queryHeight+1
					},'fast');
					var gridWrap=$($(this).parent().next('div'));
					gridWrap.height(gridWrap.height()+queryHeight+1);
					queryTitle.bind('click', qtClick);
				});
			}
		};
		if(this.collapsible && !this.disabled){
			//queryTitle.click(qtClick);
			queryTitle.bind('click', qtClick);
		}
		$('#'+id1).click(function(){
			var params={},q=self.getQword();
		/*	if(q.length==0){
				$.messager.alert('提示','查询条件不能全部为空！','error');
				return;
			}*/
			params[self.paramName]=q;
			// extra params
			for(var i in self.extraParams){
				params[i]=self.extraParams[i];
			}
			var pagerOptions=$('#'+self.gridId).datagrid('getPager').pagination('options');
			params.pageSize=pagerOptions.pageSize;
			params.pageNo=1;//pagerOptions.pageNumber;
			$('#'+self.gridId).datagrid('load',params);
	/*		$.ajax({
				url:self.url,
				type:"post",
				data:params,
				async:false,
				success:function(data,textStatus){
					if(data.constructor == Array){
						$('#'+self.gridId).datagrid('loadData',data);
					} else {$.messager.alert('提示','查询结果为空或查询出错！','error');}
				}
			});*/
		});
		
		$('#'+id2).click(function(){
			for(var i=0;i<itemEl.length;i++){
				itemEl[i].val('');
			}
		});
		
		if(this.expanded){
			queryWrap.css('display','block');
			$('.slide-tip').css('background-position','0 7px');
			queryTitle.click();
		}
	},
	capitalize:function(s){
		if(s && s.length > 0) {
			return s.charAt(0).toUpperCase()+s.substring(1);
		}
		return s;
	},
	buildEl:function(item){
		if(item.html && (item.html.constructor == String)){
			var el=$(item.html);
			if(item.type=='comboBox'){
				el.val=function(v){
					var i=item.html.indexOf('id'),s=item.html.substr(i+2);
					i=s.indexOf('"');
					if(i<0){
						i=s.indexOf("'");
					}
					s=s.substr(i+1);
					i=s.indexOf('"');
					if(i<0){
						i=s.indexOf("'");
					}
					s=s.substring(0,i);
					if(v==undefined||v==null){
						return $('#'+s).combobox('getValue');
					}else{
						$('#'+s).combobox('setValue',v);
					}
				}
			}
			return el;
		} else {
			var t=this.capitalize(item.type);
			if(this['build'+t]){
				return this['build'+t](item);
			}
		}
		return $('<input type="text" name="'+item.name+'"/>');
	},
	buildTextarea:function(item){
		return $('<textarea name="'+item.name+'"></textarea>');
	},
	buildRadio:function(item){
		var wrap=$('<div></div>'),els=[];
		for(var i=0;i<item.items.length;i++){
			var id=item.name+'_'+i+'_'+(new Date()).getTime(),el=$('<input class="gs-radio" type="radio" name="'+item.name+'" id="'+id+'" value="'+item.items[i].value+'"/>'),label=$('<label class="gs-radio-label"></label>');
			wrap.append(el);
			wrap.append(label);
			label.attr('for',id);
			label.text(item.items[i].label);
			els.push(el);
			if(item.items[i].checked){
				el.attr('checked','checked');
			}
		}
		wrap.attr('name',item.name);
		wrap.val=function(v){
			if(v!=undefined) {
				for(var i=0;i<els.length;i++){
					if(els[i].val()==v){
						els[i].attr('checked','checked');
						return;
					}
				}
				if(v==''){
					for(var i=0;i<els.length;i++){
						els[i].removeAttr('checked');
					}
				}
			} else {
				for(var i=0;i<els.length;i++){
					if(els[i].attr('checked')){
						return els[i].val();
					}
				}
				return '';
			}
		}
		return wrap;
	},
	buildComboBox:function(item) {
		var wrap=$('<select name="'+item.name+'"></select>');
		for(var i=0;i<item.items.length;i++){
			var option=$('<option></option>');
			option.attr('value',item.items[i].value);
			option.text(item.items[i].label);
			wrap.append(option);
			if(item.items[i].selected){
				option.attr('selected',true);
			}
		}
		return wrap;
	},
	buildDate:function(item){
	}
}

