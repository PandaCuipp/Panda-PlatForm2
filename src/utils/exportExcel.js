var $ = require("jquery");
var idTmr;//定时对象

//测试
export function test(){
	var data = new Array();
	var hang = new Array();
	hang.push(new cell("00"));
	hang.push(new cell("01"));
	hang.push(new cell("02"));
	data.push(hang);

	hang = new Array();
	hang.push(new cell("10"));
	hang.push(new cell("11"));
	hang.push(new cell("12"));
	data.push(hang);

	hang = new Array();
	hang.push(new cell("20"));
	hang.push(new cell("21"));
	hang.push(new cell("22"));
	data.push(hang);
	exportExcel(data,"Panda");
}


/*
dataTable:二维cell对象数组，
excelName:导出的excel文件默认名称
*/
export function exportExcel(dataTable,excelName) {//整个表格拷贝到EXCEL中
	if(dataTable == undefined){
		alert("无数据导出");
		return;
	}
	var tableInnerHtml = getTableInnerHtml(dataTable);

	exprotTableHtml(tableInnerHtml,excelName)
}

export function exportArrayExcel(dataTable,excelName){

}

export function exprotTableHtmlExcel(tableInnerHtml,excelName){
	if(tableInnerHtml == undefined || tableInnerHtml == ""){
		alert("导出内容不能为空");
		return;
	}

	var rand = Date.parse(new Date());
	if(excelName == ''){
		excelName = "Excel"+rand;
	}
	
	var divId = "div" + rand;
	var tableid = "tableid"+rand;
	var aClickId = "exportExcel"+rand;

	var divHtml = '<div id="'+divId+'" style="display:none">';
	//a链接点击
	divHtml += ' <a href="#" id="'+aClickId+'" ></a>';//提供给下面自定义文件名的操作
	//构建table
	
	divHtml += '<table id="'+tableid+'" >'+ tableInnerHtml +'</table>';
	divHtml += '</div>';
	$("body").append(divHtml);

	//$("#"+tableid).after(ahtml);
	if(getExplorer()=='ie') {
		var curTbl = document.getElementById(tableid);
		var oXL = new ActiveXObject("Excel.Application");

		//创建AX对象excel
		var oWB = oXL.Workbooks.Add();
		//获取workbook对象
		var xlsheet = oWB.Worksheets(1);
		//激活当前sheet
		var sel = document.body.createTextRange();
		sel.moveToElementText(curTbl);
		//把表格中的内容移到TextRange中
		sel.select;
		//全选TextRange中内容
		sel.execCommand("Copy");
		//复制TextRange中内容
		xlsheet.Paste();
		//粘贴到活动的EXCEL中
		oXL.Visible = true;
		//设置excel可见属性

		try {
			var fname = oXL.Application.GetSaveAsFilename(excelName + ".xls", "Excel Spreadsheets (*.xls), *.xls");
		} catch (e) {
			print("Nested catch caught " + e);
		} finally {
			oWB.SaveAs(fname);

			oWB.Close(savechanges = false);
			//xls.visible = false;
			oXL.Quit();
			oXL = null;
			//结束excel进程，退出完成
			//window.setInterval("Cleanup();",1);
			idTmr = window.setInterval("Cleanup();", 1);
		}
	} else {
		tableToExcel(aClickId,tableInnerHtml,excelName)
	}
	
	//移除动态添加的隐藏的html
	$("#"+divId).remove();
}

function Cleanup() {
	window.clearInterval(idTmr);
	CollectGarbage();
}


/*
	template ： 定义文档的类型，相当于html页面中顶部的<!DOCTYPE> 声明。（个人理解，不确定）
	encodeURIComponent:解码
	unescape() 函数：对通过 escape() 编码的字符串进行解码。
	window.btoa(window.encodeURIComponent(str)):支持汉字进行解码。
	\w ：匹配包括下划线的任何单词字符。等价于’[A-Za-z0-9_]’
	replace()方法：用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
	{(\w+)}：匹配所有 {1个或更多字符} 形式的字符串；此处匹配输出内容是 “worksheet”
	正则中的() ：是为了提取匹配的字符串。表达式中有几个()就有几个相应的匹配字符串。
	讲解(/{(\w+)}/g, function(m, p) { return c[p]; } ：
		/{(\w+)}/g 匹配出所有形式为“{worksheet}”的字符串；
		function参数：  m  正则所匹配到的内容，即“worksheet”；
						p  正则表达式中分组的内容,即“(\w+)”分组中匹配到的内容，为“worksheet”；
		c ：为object，见下图3
		c[p] : 为“worksheet”

*/
/*
功能：导出到excel
入参：
aClickId： a标签的id
tableInnerHTML：导出的表格的内容html
name：自定义excel名称
*/
var tableToExcel = (function() {
	var uri = 'data:application/vnd.ms-excel;base64,',
	template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
	base64 = function(s) {
		return window.btoa(unescape(encodeURIComponent(s)))
	},
	// 下面这段函数作用是：将template中的变量替换为页面内容ctx获取到的值
	format = function(s, c) {
			return s.replace(/{(\w+)}/g,
							function(m, p) {
								return c[p];
							}
			)
	};
	return function(aClickId, tableInnerHTML, name) {
		//if (!table.nodeType) {
		//	table = document.getElementById(table)
		//}
		// 获取表单的名字和表单查询的内容
		var ctx = {worksheet: name || 'Worksheet', table: tableInnerHTML};
		// format()函数：通过格式操作使任意类型的数据转换成一个字符串
		// base64()：进行编码
		//window.location.href = uri + base64(format(template, ctx))
		document.getElementById(aClickId).href = uri + base64(format(template, ctx));
		document.getElementById(aClickId).download = name + ".xls";//自定义文件名  
		document.getElementById(aClickId).click();
	}
})();

//获取浏览器标识
function  getExplorer() {
	var explorer = window.navigator.userAgent ;
	//ie
	if (explorer.indexOf("MSIE") >= 0) {
		return 'ie';
	}
	//firefox
	else if (explorer.indexOf("Firefox") >= 0) {
		return 'Firefox';
	}
	//Chrome
	else if(explorer.indexOf("Chrome") >= 0){
		return 'Chrome';
	}
	//Opera
	else if(explorer.indexOf("Opera") >= 0){
		return 'Opera';
	}
	//Safari
	else if(explorer.indexOf("Safari") >= 0){
		return 'Safari';
	}
}


/*
返回拼接后的table的 inner html
dataTable:表格数据的二维数组
*/
function getTableInnerHtml(dataTable){
	var tableInnerHtml = '';
	for(var i = 0;i < dataTable.length; i++){
		tableInnerHtml += '<tr>';
		for(var j = 0; j < dataTable[i].length; j++){
			var cellItem = dataTable[i][j];

			tableInnerHtml +='<td';
			if(cellItem.colspan > 1)
				tableInnerHtml+=' colspan="'+ cellItem.colspan + '"';
			if(cellItem.rowspan > 1)
				tableInnerHtml+=' rowspan="'+ cellItem.rowspan + '"';
			tableInnerHtml+='>'+ cellItem.value +'</td>';
			//tableInnerHtml += '<td colspan = "'+ cellItem.colspan +'" rowspan = "'+ cellItem.rowspan + '">'+ cellItem.value +'</td>';
			//tableInnerHtml += '<td>'+ cellItem +'</td>';
		}
		tableInnerHtml += '</tr>';
	}
	return tableInnerHtml;
}

//定义Excel方格对象
export function cell(value, colspan = 1,rowspan = 1)
{
	this.value=value;
	this.colspan=colspan;
	this.rowspan=rowspan;
}