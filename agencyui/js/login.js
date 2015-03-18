
function checkToken(){
	var flag=false;
	var token = getCookie("token");
	if( token == null ){
		$.ajax({
			url:"/atnew/ws/auth/checkTimeOut",
			type:"get",
			async:false,
			data:{"token":token},
			success: function (result) {
				if (result == "true") {
					flag = true;
				}
			}
		});
	}
	return flag;
}