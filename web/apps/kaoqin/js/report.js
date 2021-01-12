
var report = $('.ReportTable');

//左悬浮
var floatTable2 = $(report[0].outerHTML);
floatTable2.find('tr').each(function(i,n) {
	if(i == 0) {
		$(n).remove();
		//$(n).attr('colspan', '3');
		//$(n).find('th').html('&nbsp');
		//$(n).find('th').css('visibility', 'collapse');
	}
	else if(i == 1) {
		$(n).find('th').each(function(i,n) { 
			if(i > 2) {
				$(n).remove();
			}
		});
	}
});
floatTable2.find('.ReportCell').each(function(i,n){ 
	$(n).remove();
});
floatTable2.find('.ReportTableFoot').each(function(i,n){ 
	$(n).remove();
});
floatTable2.attr('style', 'background-color:white;');
floatTable2.css('margin-top', '42.4px');
floatTable2.css('position', 'absolute');
floatTable2.css('left', '0px');
floatTable2.css('top', '0px');
$(document.body).append(floatTable2);

//顶悬浮
var floatTable1 = $($('.ReportTable')[0].outerHTML);
floatTable1.find('tr').each(function(i,n) {
	if(i > 1) {
		$(n).css('visibility', 'collapse');
	}
});
floatTable1.attr('style', 'background-color:white;');
floatTable1.css('position', 'absolute');
floatTable1.css('left', '0px');
floatTable1.css('top', '0px');
$(document.body).append(floatTable1);

//纵横定位
report.find('.ReportCell').each(function(i,n) {
	$(n).mouseenter(function() {
		report.find('.ReportCell').css('background-color', 'white');
		floatTable1.find('.LabelDate').css('background-color', 'white');
		floatTable2.find('.LabelUser').css('background-color', 'white');
		floatTable2.find('.LabelTime').css('background-color', 'white');
		
		//etTimeout(function() {
			$(n).css('background-color', 'yellow');
			floatTable1.find('.Date' + $(n).attr('date').replace('.','_')).css('background-color', 'yellow'); 
			floatTable2.find('.LabelUser' + $(n).attr('bmuserid')).css('background-color', 'yellow'); 
			floatTable2.find('.LabelTime' + $(n).attr('bmuserid') + '_' + $(n).attr('ampm')).css('background-color', 'yellow'); 
		//}, 10);
	});
	$(n).mouseleave(function() {
	});
});

function autoSize() {
	floatTable1.css('top', $(document.body).scrollTop());
	floatTable2.css('left', $(document.body).scrollLeft());
}

$(function() {
	$(window).scroll(function() {
		autoSize();
	});
	autoSize();
});