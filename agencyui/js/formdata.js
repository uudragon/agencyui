function getFormData( form ){
	var data = new Object();
	var inputs = $(form).find( "input" );
	for( var i = 0; i < inputs.length; i++ ){
		var name = inputs[i].name;
		if( name != null && name != undefined ){
			if( name.indexOf(".") != -1 ){
				var ns = name.split(".");
				var cn0 = ns[0];
				var cn1 = ns[1];
				if( ns[0] in data ){
					
					data[cn0][cn1]=$(inputs[i]).val();
				} else {
					var cn = new Object();
					cn[cn1]= $(inputs[i]).val();
					data[cn0] = cn;
				}
			} else {
				data[name]=$(inputs[i]).val();
			}
		}
	}
	return data;
}

function loadProvince(){
	$("#province").combobox({
		valueField:'id',  
		textField:'text',
		data:getProvince(),
		onSelect:function( record ){
			$("#city").combobox({
				valueField:'id',  
				textField:'text',
				data:getCity(record.index),
				onSelect:function(record){
					$("#district").combobox({
						valueField:'id',  
						textField:'text',
						data:getDistrict(record.index)
					})
				}
			});
		}
	});
}

function loadCity( province ){
	$("#city").combobox({
		valueField:'id',  
		textField:'text',
		data:getCity( province ),
		onSelect:function(record){
			$("#district").combobox({
				valueField:'id',  
				textField:'text',
				data:getDistrict(record.index)
			})
		}
	});
}

function loadDistrict( city ){

	$("#district").combobox({
		valueField:'id',  
		textField:'text',
		data:getDistrict( city )
	})
}

function setFormData( form, data ){
	var inputs = $(form).find( "input" );
	var province,city;
	for( var i = 0; i < inputs.length; i++ ){
		var name = inputs[i].name;
		
		if( name != null && name != undefined ){
			if( name.indexOf(".") != -1 ){
				var ns = name.split(".");
				if( inputs[i].type == "hidden" && inputs[i].className  == "combo-value" ){
					if( !$("#"+ns[1]).hasClass("easyui-datebox") ){
						if( ns[1] == "province" ){
							province = getProvinceIndex( data[ns[0]][ns[1]] );
							loadProvince();
						} else if( ns[1] == "city" ){
							city = getCityIndex( province,data[ns[0]][ns[1]] );
							loadCity( province );
						} else if( ns[1] == "district" ){
							loadDistrict( city );
						}
						$("#"+ns[1]).combobox('select',data[ns[0]][ns[1]]);
					} else {
						$("#"+ns[1]).datebox('setValue',data[ns[0]][ns[1]]);
					}
				} else {
					$(inputs[i]).val(data[ns[0]][ns[1]]);
				}
			} else {
				if( inputs[i].type == "hidden" && inputs[i].className  == "combo-value" ){
					if( !$("#"+name).hasClass("easyui-datebox") ){
						$("#"+name).combobox('setValue',data[name]);
					} else {
						$("#"+name).datebox('setValue',data[name]);
					}
				} else {
					$(inputs[i]).val(data[name]);
				}
				
			}
		}
	}
}