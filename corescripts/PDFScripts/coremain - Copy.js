var selectors = { notpage: ':not(.notpage)', page: '.page' };

var core =
{
    gotoPage: function ($toPage, isNext, index) {
         if ($toPage.length == 0) return;
    
		if (index==null) index= 0;
         var go_page = function () {
 			core.record_navigation_breadcrumb($toPage.attr('id'), function(){
				if (!jQuery.fx.off) {
 					jQuery.fx.off = $toPage.find('video').length>0;
				}
				if ($.transit.enabled){
					$.transit.enabled = $toPage.find('video').length==0;
				}
	                        $toPage.css('margin-right','5px');
	                        var move = -index * $toPage.width()-(index*5);
 				$toPage.addClass('current');
				var doneComplete = false;
				$('#pageholder').find('div.pagediv:visible').transition({x:move+'px',
							duration:300,
							complete:function(){
								if (!doneComplete){ 
									doneComplete=true;
									$fromPage.removeClass('current');
									set_indicator(isNext);
									if ($fromPage.length > 0){
										remove_ui_table($fromPage);
		    						}
									hideSpinner();	
								}	
								//SDewani 20131011 Changed the function call as there is no need to call the entire functionality again, just a function to populate graph is called
								//SDewani 20131004 Called this function to populate graph after the page load is completed
								populate_graph($toPage);
							}
						});
 			});
         }
        
         var $fromPage = $('div#pageholder > div.current');
         var $ul = $('#indicator ul');
        	populate_ui_table($toPage);
 			
         if ($ul.find('li').length == 0){
			$.transit.enabled=false;
 			jQuery.fx.off = true;
			showSpinner(go_page);
 		}else{
 			jQuery.fx.off = false;
			go_page();
 		}

     },
     record_navigation_breadcrumb: function(to_page, success)
 	{
		if (to_page==null) to_page='';
		var breadcrumb_message = 'Page Navigation: ' + to_page;
		core.record_breadcrumb(breadcrumb_message, success);
	},
	record_breadcrumb: function(breadcrumb_message, success){
		if (success==null) success=$.noop;
		if ('SFPresentationAPI' in window && SFPresentationAPI != null && current_presentation_id !=null && crm_allow_save_data) 
		{
			SFPresentationAPI.record_breadcrumb(current_presentation_id, breadcrumb_message, success, function (message)
			{
				console.log('error recording breadcrumb: ' + message);
			});
		}
		else
		{
			console.log('SFPresentationAPI/Presentation ID not available to record breadcrumb: ' + breadcrumb_message);
			success();
		}
	} 
};

function getCurrentTabInfo()
{
	return $('div#maintop > div.selected').data('tab');
}

function goNext() {
	var $currentPage = $('div#pageholder > div.current').first();
	if ($currentPage.length == 0) return false;
	
	var tabInfo = getCurrentTabInfo();
	if (tabInfo == null || tabInfo.pages==null) return false;
	var currentPageIndex = $.inArray($currentPage.attr('id'),tabInfo.pages)
    if (tabInfo.pages.length > (currentPageIndex+1))
	core.gotoPage($('#' + tabInfo.pages[currentPageIndex+1]), true, currentPageIndex+1);
}

function goPrevious() {
	var $currentPage = $('div#pageholder > div.current').first();
	if ($currentPage.length == 0) return false;
	var tabInfo = getCurrentTabInfo();
	if (tabInfo == null || tabInfo.pages==null) return false;
	var currentPageIndex = $.inArray($currentPage.attr('id'),tabInfo.pages)
	
	if (currentPageIndex>0) 
    core.gotoPage($('#' + tabInfo.pages[currentPageIndex-1]), false,currentPageIndex-1);
}

function set_indicator(isNext){
	var $li = $('#indicator li.selected');	
	var $toSelect; 
	
	if (isNext)
		$toSelect = $li.next('li');
	else
		$toSelect = $li.prev('li');
	
	if ($li.length==0)
		$li = $('#indicator li:first');	

	$li.toggleClass('selected');		
	if ($toSelect.length>0)
		$toSelect.toggleClass('selected');
}

function build_indicator(pages)
{
	var $ul = $('#indicator ul');
	$ul.empty();
	$ul.hide();
	if (pages.length<=1)
		return;
		
	$ul.show();
	$.each(pages,function(){
		$ul.append($('<li></li>'));
	});
}
function eval_with_this (expression, obj)
{
	try
	{
		with (obj) return eval(expression);
	}
	catch(e)
	{
		return "";
	}
}

function new_guid()
{
	// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}

function save_storage(key, value){
	localStorage.setItem(key, value);
}

function load_storage(key){
	return localStorage.getItem(key);
}

function check_storage_clean_up(visit_key, presentation_key) {
    if (visit_key == null || presentation_key == null) return;  //this is really for testing in Chrome only
    //when running from shell we should ALWAYS have these values as they are coded in touch.
    var last_visit_key = load_storage('crm_current_call_key');
    var last_presentation_key = load_storage('crm_current_presentation_key');

    //Changes made here to on start of each pitch not to clear data
    //data gets cleared
    if (visit_key != last_visit_key) {
        localStorage.clear();
    }
    if (presentation_key != last_presentation_key) {

    }

    save_storage('crm_current_call_key', visit_key);
    save_storage('crm_current_presentation_key', presentation_key);
}
	
function core_setup_presentation() {
	setupLayoutSetting();
	var resize = function () {
		setTimeout(function () {
			$('div.pagediv').height($('#main').height() - $('#maintop').height() - 10);
			$('#left').height($(window).get(0).clientHeight - 30);
		}, 300);
	}
	$('#pageholder > div').addClass('pagediv');
	var do_highlight = function () {

		var $sender = $(this);

		if ($sender.hasClass('clicked'))
			return false;

		$sender.toggleClass('clicked');

		setTimeout(function () {
			$sender.toggleClass('clicked');
		}, 500);
	}

	$('div#splitter').click(function () {
		var $left = $('div#left');
		if ($left.is(':visible')) {
			$('div#splitter').fadeOut(50, function () {
				$left.hide("slide", { direction: 'left' }, 300, function () {
					$('div#splitter').fadeIn(50, resize);
					$('div#splitter').toggleClass('collapse');
				});
			});
		}
		else {
			$('div#splitter').hide(50, function () {
				$left.show("slide", { direction: 'left' }, 300, function () {
					$('div#splitter').fadeIn(50, resize)
					$('div#splitter').toggleClass('collapse');
				});
			});
		}
	});
	var $divButton;
	$.each(page_settings.buttons, function (index, button) {
		$divButton = $('<div></div>')
		$divButton.appendTo($('div#left'));
		$divButton.text(button.button_text).data('button', button);

		if (button.image != null) {
			var $divIcon = $('<div class="icon"></div>');
			$divIcon.css('background-image', 'url(./images/' + button.image + ')');
			$divButton.append($divIcon);
		}
		if (button.class_name != null)
			$divButton.addClass(button.class_name);
	});

	var buttonCss = '-webkit-gradient(linear, left top, left bottom, from(#75a4f5),color-stop(0.75, #0283c9),to(#54a9d1));';
	$('div#left').find('div').click(function () {
		if ($(this).hasClass('selected')) return;
		var button_data = $(this).data('button')
		$(this).parent().children().removeClass('selected');
		$(this).addClass('selected');
		$('div#maintop').empty();
		if (button_data.tabs == null || button_data.tabs.length == 0)
			return;
		$.each(button_data.tabs, function (index, tab_name) {
			var tab = page_settings.tabs[tab_name];
			if (tab != null)
				$('div#maintop').append($('<div>').text(tab.tab_title).data('tab', tab));
		});
		$('div#maintop').find('div').click(function () {
			var $tab = $(this);
			if ($tab.hasClass('selected')) return;
			showSpinner(function(){
				$('#pageholder > div').hide();
				var tab_data = $tab.data('tab');
				$tab.parent().children().removeClass('selected');
				$tab.addClass('selected');
				if (tab_data.pages == null || tab_data.pages.length == 0) {
					$('div#pageholder > div.current').removeClass('current');
					return;
				}
				var page_name = tab_data.pages[0];
				$.each(tab_data.pages,function(index, page){
					$('#' + page).show();
				});
			
				build_indicator(tab_data.pages);
				$.transit.enabled=false;
				core.gotoPage($('#' + page_name), true);
				$.transit.enabled=true;
			});
		});
		$('div#maintop > div').first().click();

	});
	$('#maincontent').swipe(
		{
			swipeLeft: function (e, direction, distance, duration, fingerCount) {
				if (direction == 'left')
					goNext();
			},
			swipeRight: function (e, direction, distance, duration, fingerCount) {
				if (direction == 'right')
					goPrevious();
			},
			swipeUp: function (e, direction, distance, duration, fingerCount) {
				if (direction == 'up'){
					e.preventDefault();
					e.stopPropagation();
				}
			},
			swipeDown: function (e, direction, distance, duration, fingerCount) {
				if (direction == 'down'){
					e.preventDefault();
					e.stopPropagation(); 
				}
			},
			allowPageScroll: 'vertical',
			click: function (e, target, SUPPORTS_TOUCH) {
				if (SUPPORTS_TOUCH)
					$(target).click(); //this is really important, we need to trigger the original click event if not swipe action
			}
		}
	);
	
	$.fn.swipe.defaults.excludedElements + ", label" 
	resize();
	$(window).bind(('onorientationchange' in window ? 'orientationchange' : 'resize'), resize);
	core.record_breadcrumb('Presentation Started: ' + (current_presentation_id == null ? '' : current_presentation_id), function () { $('div#left > div').first().click(); });
}

function remove_ui_table($parent_ui){
	$parent_ui.find('table[data]').each(function(){
		var $table = $(this);
		$table.data('htmlcontent', $table.html());
		$table.empty();
	})
}

function populate_ui_table($parent_ui){
	var populate_function;
	$parent_ui.find('table[data]').each(function(){
		var	$element  = $(this);
		var htmlcontent = $element.data('htmlcontent');
		if (htmlcontent == null){
			data = eval_with_this($element.attr('data'),pitch_data);
			if (data == null || !$.isArray(data) ){
				$element.css('visibility','hidden');
				return;
			}
			populate_function = window[$element.attr('function')];
			var match_value = $element.attr('matchinputdatakey');
			//alert(match_value);
			// Taken out by Jared 2004-02-20 it doesn't do arrays for Generics (this is JSON array data, but limited to the LAST row)
			//if (match_value != null && match_value != '')
				//match_value = eval_with_this(match_value, pitch_data);
			if (match_value != null && match_value != ''){
				//split the matchvalue in to parts.
				var ElementParts = match_value.split(".");
				var thisMatchField =ElementParts[1];
				//if there is a second part, then that is the field, assume only one record!
				if (thisMatchField != null && thisMatchField != ''){
					//alert(ElementParts[0]);
					thisMatchDataSource = eval_with_this(ElementParts[0],pitch_data);
					//alert(thisMatchDataSource);
					//alert(thisMatchField);
					//if the field is there retrieve it.
					if (IsFieldExists(thisMatchDataSource,thisMatchField)){
						var arrayOptions = $.map(thisMatchDataSource, function(item){				
					            match_value=eval_with_this(thisMatchField,item);
				            });
					}
				}
				// this is added for backward compatibility.
				else
				{
					match_value=eval_with_this(match_value, pitch_data);
				}
			}
			//alert(match_value);
			populate_function($element, data, match_value); 
			$element.addClass('tablesorter');
			if ($element.attr('canclick')=="true")
			{
				$parent_ui.on('click','tbody > tr', function(){
					$(this).parents('table:first').find('tbody > tr').removeClass('selected');
					$(this).addClass('selected');
					display_barcode($(this));
				});
			}
			//DSMITH 20140730, segment added in order to find if the targeting for singular target filter in multiselect.
			$parent_ui.find('select[filterTargets]').each(function(){
				//alert ($(this).attr('id'));
				var TableNamesStr =$(this).attr("filterTargets");
				//alert (TableNamesStr);
				//alert ($element.attr('id'));
				var indexOfTableLocation = TableNamesStr.indexOf($element.attr('id'));
				if(indexOfTableLocation >= 0 ) {
					var multiselectvalue = $(this).attr("multiselect");	        	        
					if (multiselectvalue == null) multiselectvalue = "";
					if (multiselectvalue.toLowerCase() == "true")
					{
						$(this).multiselect("close");
					}
					else
					{
						$(this).change();
					}
				}
			});
			//DSMITH 20140730, segment added in order to find if the targeting for multiple targets when filtering a multiselect.
			$parent_ui.find('select[filterTarget="' + $element.attr('id') + '"]').each(function(){
			//alert($(this).attr("id"));
				var multiselectvalue = $(this).attr("multiselect");	        	        
				if (multiselectvalue == null) multiselectvalue = "";
				if (multiselectvalue.toLowerCase() == "true")
				{
					$(this).multiselect("close");
				}
				else
				{
					$(this).change();
				}
			});
		}else
		{
			$element.html(htmlcontent);
		}
		set_table_header($element);
		$element.tablesorter();
			
	});
}	
		
// Function copied to pitch base-code - 5/27/2014 - JET
function set_table_header($table){
    var headers_variable=null; // new variable
    var headers_array=null; // new variable
    if ($table != null && $table.length>0){ // "table" is the name of the header data source
        var headers_name = $table.attr('headers'); // "headers" is the name of the header data source
	};
    if (headers_name!=null && headers_name!= ''){ // if "headers" was there, do this.
      headers_variable = eval_with_this(headers_name, pitch_data); // load that data.
// [{"Col1Name":"","Col2Name":"January % Chg","Col3Name":"Jared Sales","Col4Name":"March % Chg","Col5Name":"March Sales","Col6Name":"April Sales","Col7Name":"April % Chg","Col8Name":"Current YTD % Chg","Col9Name":"Current YTD Sales","Source":"Source: Wrigley - LastUpdated: 1/30/2013","LastUpdated":"1/30/2013"}]
	    $table.find('th').each(function(index,item){
		   var ColumnNameValue = '';
		   $.each(headers_variable, function(keya,valuea){
		   var ColumNumber = index + 1;
		   eval("var temp_ColName=valuea['Col" + ColumNumber + "Name'];");
		   
		   if( typeof temp_ColName != 'undefined'){
			ColumnNameValue = temp_ColName;
		   }
		});
	      if (typeof ColumnNameValue != 'undefined'){
	              $(this).text(ColumnNameValue);
		//	alert(ColumnNameValue);
		};
	    });
	};
}

function IsFieldExists(obj,field)
{    
    //This function will check whether field name exists in JSON data's first row (Added By Krunal)
    var p = obj[0];
    for (var key in p) 
    {
        if (key == field) return true;
    }
    return false;
}	

function populate_ui_data($parent_ui){
		var $td;	
		var data, populate_function, strFilterField, intCol, strFilterFunction; 
		$parent_ui.find('div[data]').each(function(){
			var	$element = $(this);
			data = eval_with_this($element.attr('data'),pitch_data);
			if (data == null){
				$element.css('visibility','hidden');
				return;
			}
			//For displaying a single column from muli column Json data which may contain multiple rows in Div (Added by krunal)
			//first it will check whether div has "field" attribute or not
			var field =$element.attr('field');		
			if (field != null)
			{   
			    //Checking whether field exists in JSON data or not. 
			    //if this condition is not kept it will add empty li tags when field name is wrong. So to avoid that condition is added.(Added By Krunal)			    
			    if (IsFieldExists(data,field))
			    {
			        if ($element.find('ul').length ==0) $element.append('<ul></ul>');
                                    
                    $element.find('ul > li').remove();
                    var arrayOptions = $.map(data, function(item){
				            return '<li>' + eval_with_this(field,item) +'</li>';
			            });
                    $element.find('ul').append(arrayOptions);
                }
                else                
                {
                    $element.css('visibility','hidden'); $element.css('height','0px');               
                }
			}
			else
			    $element.text(data);
		});
		
		$parent_ui.find('div[graphdata]').each(function(){
			//don't populate the graph here,  just set the filters to empty 
			//then when other filters control are initialised then they will trigger the plot.
			$(this).data('filters',[]);
			//SDewani 20131011 Commented out this line as it is moved to the new function populate_graph
			//SDewani 20131004 Code to call the function to populate a graph
			//var $target = $(this);
			//if ($target.attr('graphdata')!=null)//if it is a graph then do something different.
			//{
			//	plotGraph($target);
			//}
		});
		//Following function is changed by Krunal on 29-Aug-2013		
		//In this function first it will check whether selector has multiselect is true. if it is true it will bind filter related code to Close event
		//and if it is false it will bind filter related code to Change event. In both case it will call a common function named "FilterGridData"
	    $parent_ui.find('select[filtertarget]').each(function(){
	        var multiselectvalue = $(this).attr("multiselect");	        	        
	        if (multiselectvalue == null) multiselectvalue = "";
	        if (multiselectvalue.toLowerCase() == "true")
	        {
	            $(this).multiselect({
	                close: function(){	                    
	                FilterGridData($(this)); 	                    
                    }
	            });
	        }
	        else
            {
                $(this).bind('change',function(){ 	
                    FilterGridData($(this)); 			           
                });
            }
	    });		
		//DSMITH 20140730, the following segment will find the filter targeting for multiple targets, check whether it is true or false. If it is true it will bind filter related code to Close event 
		//and if it is false it will bind filter related code to Change event. In both case it will call a common function named "FilterGridData"
		$parent_ui.find('select[filtertargets]').each(function(){
			//alert($(this).attr("id"));
	        var multiselectvalue = $(this).attr("multiselect");	        	        
	        if (multiselectvalue == null) multiselectvalue = "";
	        if (multiselectvalue.toLowerCase() == "true")
	        {
	            $(this).multiselect({
	                close: function(){	                    
	                FilterGridData($(this)); 	                    
                    }
	            });
	        }
	        else
            {
                $(this).bind('change',function(){ 	
                    FilterGridData($(this)); 			           
                });
            }
	    });		
		
		function FilterGridData($object)
		{
		    //this is common function for both selectors single selector and multiple selector
		    //this function will filter grid's data.
            var	$element = $object;
            var filterTarget =$element.attr('filterTarget'); //assigns the table id to filterTarget
			var filterTargets =$element.attr('filterTargets'); //assigns the table ids to filterTargets
            if ((filterTarget == null) && (filterTargets == null)) return;
            strFilterField = $element.attr('filterField')
            strFilterFunction= $element.attr('filterFunction')
            if (strFilterField == null && strFilterFunction == null) {
	            $element.css('visibility','hidden');
	            return;
            }			
            var arrSelected ='';
			var isRadioButton=0; //added to initialize isRadioButton
            if ($element.attr('multiselect')=='true')	
	            arrSelected = $element.multiselect("getChecked"); 
			else if ($element.attr('type')=='radio') { //added to get the value of isRadioButton if selected
				arrSelected=[{value:$element.attr('radioValue')}];
				isRadioButton=1;
				}
            else
	            arrSelected = [{value:$element.val()}];
			
			// create list string
			if (filterTarget != null) //Defaults to filterTarget even if both exist
				var TableIDsString = filterTarget
			else 
				var TableIDsString = filterTargets
			
			//Loop that will go through the string a separate each target by comma and make it an ID
			//then find the 'data' that the table id has and further filter upon the data given to make a graph or a table.
			var TableIDs = TableIDsString.split(',');
			for (var x in TableIDs)
				{
				var $target = $('#' + TableIDs[x]);
				if ($target.length==0){
					$element.css('visibility','hidden');
					return;
				}
				if (($target.attr('graphdata')!=null) && (isRadioButton == 0))//if it is a graph then do something different.
				{
					if (arrSelected.length>0){ // This blows up the radio button on the graph. Don't do this for a radio. It has already been passed to the graph if it is a radio.
						var filter_key = get_filter_key($element);
						var filters = $target.data('filters');
						filters[filter_key] = strFilterField + '=="' + arrSelected[0].value + '"';
						$target.data('filters', filters);
						plotGraph($target);
					}
				}
				else
				{
					var arrString = $.map(arrSelected, function(item){
										return item.value;
									});;
					save_storage($element.attr('storagekeyprefix'), arrString);
					if (strFilterField != null){
						$target
							.find('tr:not(.header) > td[field="'+ strFilterField  + '"]').each(function(){
								var isHidden =arrString.length != 0 && ($.inArray($(this).text(), arrString ) ==-1) ;//comparing the value 
								$(this).toggleClass('hidden', isHidden);
						});
					}
					else 
					{
						$target
						   .find('tr:not(.header)').each(function(index,item){
							  var filter_function = window[strFilterFunction];  
							  filter_function(arrString, $(item));
						});
					}
					$target.find('tr:not(.header)').removeClass('hidden');
					$target.find('tr:not(.header) > td.hidden').parent('tr').addClass('hidden');
					$object.trigger('custom_multi_select');					                      				    	
				}
			}
		}
		
		$parent_ui.find('select[data]').each(function(){
			var	$element = $(this);
			data = eval_with_this($element.attr('data'),pitch_data);
			var hasChecked = false;
			if (data == null || !$.isArray(data)){
				$element.css('visibility','hidden');
				return;
			}
			var arrayOptions = $.map(data, function(item){
				if (item.Selected==true) 
					hasChecked=true;
				return '<option value="' + item.Value + '" '+ (item.Selected==true?'selected="selected"':'') + '>' + item.Display +'</option>';
			});
		   
			//SDewani 20131011 The element values should be cleared before appending new values	
			$element.empty().append(arrayOptions);
			//$element.append(arrayOptions);
			//alert(arrayOptions); //data that is load once upon loading the pitch
			var doUncheck = true;
			if ($element.attr('multiselect')=='true'){
				$element.multiselect({
					checkAllText:'',
					uncheckAllText:'',
					noneSelectedText:'All',
					selectedList:$element.find('option').length,
					multiple:true
				});
			     
				if ($element.attr('storagekeyprefix') != null){
    			    var values = load_storage($element.attr('storagekeyprefix'));
    			    if (values){
		                $element.multiselect("widget").find(":checkbox").each(function(){
		                    if (values.indexOf($(this).val())>=0){
		                        if (!$(this).is(':checked'))
		                            $(this).click();
		                        hasChecked = true;
		                        doUncheck = false;
		                    }else{
		                        if ($(this).is(':checked'))
		                            $(this).click();
		                    }
                        });
                    }
                }
                if (doUncheck)
                  $element.multiselect("uncheckAll");  
            }else{
				var value = load_storage($element.attr('storagekeyprefix'));
				if (value)
					$element.val(value);
			}
			
			if(!hasChecked) {
				$element.first('option').attr('selected','selected');
				hasChecked=true;
			}else{
			    $element.change();	
			}
		});
		//DSMITH 20140730, below segnment of code will find the radio button and get the 'data' string for the data, if none exists then it will make the whole table/graph hidden.
		var distinct_radio_name = 0;
		$parent_ui.find('ul[data][type=radio]').each(function(){ //find each radio UL and write out the radio buttons
			distinct_radio_name ++;
			var	$element = $(this);
			var data_name = $element.attr('data'); // assigns the "data" to the variable 
			data = eval_with_this(data_name ,pitch_data); 
			if (data == null || !$.isArray(data)){ //if there is no data then control is hidden
				$element.css('visibility','hidden');
				return;
			}
			var arrayOptions = $.map(data, function(item){
				if (item.StartupFunction != null){
					var itemStartUpFunction = window[item.StartupFunction];
					if (typeof(itemStartUpFunction)==typeof($.noop))
						item = itemStartUpFunction($element, item, pitch_data);
				}
				return '<li><input type="radio" name="' + data_name + distinct_radio_name + '" value="' + item.Value + '" '+(item.Selected==true?'checked':'')+'><span>' + item.Display +'</span></input></li>';
			});
			$element.append(arrayOptions);
			
			if ($element.attr('filtertarget') != null){ //This assumes that filterTarget will ONLY be a graph
				$element.find('input[type=radio]').change(function(){ //Setting the listener for filterTarget
					//store the filter_key against the parent ul instead so we can only have 1 value.
					var filter_key = get_filter_key($(this).parents('ul:first')); //var filter_key takes on the attribute of the first ul
					//alert(filter_key); //displays scientific numbers
					var $graphContainer = $('#' + $element.attr('filtertarget')); //graphContainer takes on id for the filtertarget
					var filters = $graphContainer.data('filters'); //takes on value of div filters?
					filters[filter_key] = $(this).attr('value'); //assign new value
					$graphContainer.data('filters', filters);
					plotGraph($graphContainer); //sends graphContainer to plotgraph
				})
				}
				else
				{
				$element.find('input[type=radio]').change(function(){
					var filter_key = get_filter_key($(this).parents('ul:first')); 
					var TableIDsString = ($element.attr('filtertargets'));
					
					var TableIDs = TableIDsString.split(',');
					for (var x in TableIDs)
						{
						var $target = $('#' + TableIDs[x]);
						if ($target.length==0){
							$element.css('visibility','hidden');
							return;
						}
						if ($target.attr('graphdata')!=null)
						{
							if ($target.length>0){ //gets the filters for the graph and sends to plotGraph
								var filter_key = get_filter_key($(this).parents('ul:first'));
								var filters = $target.data('filters'); 
								filters[filter_key] = $(this).attr('value');
								$target.data('filters', filters);
								plotGraph($target);
							}
						}
						else if ($target.attr('data')!=null) {
							if ($target.length>0){ //gets the values for the table and sends to FilterGridData
								if ($(this).attr('value') != null) {
									var $ParentTarget = $( this ).parents().eq(1);
									$ParentTarget.attr("radioValue",$(this).attr('value'));
									};
								FilterGridData($(this).parents('ul:first'));
							}
						}
						}
						})
				}
					
			$element.find('span').click(function(){
				//store the filter_key against the parent ul instead so we can only have 1 value.
				var $radio = $(this).prev('input[type=radio]');
				$radio.click();  //allow the span to trigger the radio button change as well.
			})
			
			if ($element.find('input[checked]').length==0)
				$element.find('input:first').attr('checked','checked');
			
			//SDewani 20131011 Commented out this line as it will be executed when a page having graph is loaded
			//$element.find('input[type=radio][checked]:first').change();
		});
	}
	
//SDewani 20131011 Moved function out as it will be called by the populate_graph function
function plotGraph($divContainerID){
		
		if ($divContainerID.data('plot') != null)//if plot exists, destroy it
			$divContainerID.data('plot').destroy();
		
		$divContainerID.data('plot', null);
		
		if ($divContainerID.data('filters')==null)
			$divContainerID.data('filters',[]);
			
		var data;
		var $element = $divContainerID; //element equals div id for the graph
		data = eval_with_this($element.attr('graphdata'),pitch_data); //data equals whatever string was in 'graphdata'
		if (data == null || !$.isArray(data)){
			$element.css('visibility','hidden');//no graphdata, no graph displayed
			return;
		} 
		//$element.toggle(true); // this was commented and Jared added the next line.
		$element.parent().parent().toggle(true);//the parent of the parent for the div id specified is toggled to being true. 
		var series = $element.attr('series').split(',');//collects the attributes of series in html, removes commas
		var tick = $element.attr('tick');//collects the attributes of tick in html
		var seriesValues = [];
		var ticks=[];
		var filters = $divContainerID.data('filters');
		//filters = ''; // this was missing from the blank.
		var filter_expression = '';
		for (var x in filters)
			filter_expression += filters[x] + ' && ';

		if (filter_expression!='')
			filter_expression = filter_expression.substring(0,filter_expression.length-4);
		
		$.each(data, function(data_index,dataItem){
			var process = true;
			if (filter_expression!='')
				process = eval_with_this(filter_expression,dataItem);
			if (process==true) {
				$.each(series, function(index,serieName){
					if (seriesValues[index] == null)
						seriesValues[index] = [];
					seriesValues[index].push(dataItem[serieName]);
				}) ; 		
				ticks.push(dataItem[tick]);
			}
		});
		
		//SDewani 20131004 Added code for different configurations of graph
		if($divContainerID.hasClass('ver_bar_line_graph'))
		{
			var options = {
				grid:{
					gridLineColor:'#C3C4C6',
					borderColor:'#C3C4C6',
					borderWidth:0.1,
					background:  '#585858'
				},
				series:
				[
					{
						renderer: $.jqplot.BarRenderer, 
						label: 'Case Sales',
						color: '#648388',
						pointLabels:
						{
								show: true,
								edgeTolerance: -15
						}
					}
				],
				axes:
				{
					xaxis:
					{
						ticks:ticks,
						tickOptions:
						{
							angle:0,
							fontFamily: "Verdana",
							fontSize: "12pt",
							textColor: '#FFFFFF'
						},
						renderer: $.jqplot.CategoryAxisRenderer, 
						rendererOptions: 
						{ 
							tickRenderer: $.jqplot.CanvasAxisTickRenderer
						} 
					},

					yaxis:
					{
						tickOptions:
						{
							angle:0,
							fontFamily: "Verdana",
							fontSize: "8pt",
							textColor: '#FFFFFF'
						}
					}
				}
			};
		}
		else if($divContainerID.hasClass('hor_bar_line_graph'))
		{
			var options = {
				grid:{
					gridLineColor:'#C3C4C6',
					borderColor:'#C3C4C6',
					borderWidth:0.1,
					background:  '#585858'
				},
				seriesDefaults: {
					renderer:$.jqplot.BarRenderer,
					// Show point labels to the right ('e'ast) of each bar.
					// edgeTolerance of -15 allows labels flow outside the grid
					// up to 15 pixels.  If they flow out more than that, they 
					// will be hidden.
					pointLabels: { show: true, edgeTolerance: -15 , location: 'w', formatter: $.jqplot.DefaultTickFormatter, formatString: '%d%%'},
color: '#d5720c',
					// Rotate the bar shadow as if bar is lit from top right.
					shadowAngle: 135,
					// Here's where we tell the chart it is oriented horizontally.
					rendererOptions: {
						barDirection: 'horizontal'
					}
				},
				axes:
				{
					yaxis:
					{
						ticks:ticks,
						tickOptions:
						{
							angle:0,
							fontFamily: "Verdana",
							fontSize: "12pt",
							textColor: '#FFFFFF'
						},
						renderer: $.jqplot.CategoryAxisRenderer, 
						rendererOptions: 
						{ 
							tickRenderer: $.jqplot.CanvasAxisTickRenderer
						} 
					},

					xaxis:
					{
						tickOptions:
						{
							angle:0,
							fontFamily: "Verdana",
							fontSize: "8pt",
							textColor: '#FFFFFF'
						}
					}
				}
			};
		}
		else
		{
			var options = {
				series:
				[
					{
						renderer: $.jqplot.BarRenderer, 
						label: 'Case Sales' 
					},
					{
						yaxis: 'y2axis',
						label: 'Avg Price $',
						renderer: $.jqplot.LineRenderer, 
						pointLabels:
						{
								show: true
						}
					}
				],
				axes:
				{
					xaxis:
					{
						ticks:ticks,
						tickOptions:
						{
							angle:-30,
							fontFamily: "Verdana",
							fontSize: "10pt"
						},
						renderer: $.jqplot.CategoryAxisRenderer, 
						rendererOptions: 
						{ 
							tickRenderer: $.jqplot.CanvasAxisTickRenderer
						} 
					},
					y2axis:
					{
						tickOptions: 
						{ 
							formatString: '$%.2f'
						},
					}
				},
				legend:
				{ 
					show: true,
					location: 's', 
					placement: 'outsideGrid'
				}
			};
		}
		if (seriesValues.length>0){
			var maxValue;
			if (seriesValues[1]!=null)
				maxValue = Math.max.apply(Math, seriesValues[1]);
			if (maxValue>0)
				options.series[1].pointLabels.ypadding = -20;
			$element.data('plot',$.jqplot($element.attr('id'),seriesValues,options));
		}
		//$element.toggle(false);
		//$element.parent().parent().toggle(false); /// this killed the graphs
	}		
	
//SDewani 20131011 Function to populate graph on page and execute the click event of the 	
function populate_graph($this){
	$this.find('div[graphdata]').each(function(){
			var $target = $(this);
			if ($target.attr('graphdata')!=null)//if it is a graph then do something different.
			{
				plotGraph($target);
			}
		});
		
	var distinct_radio_name = 0;
		$this.find('ul[data][type=radio]').each(function(){
			distinct_radio_name ++;
			var	$element = $(this);
			$element.find('input[type=radio][checked]:first').change();
		});
            $this.find('select[filtertarget]').each(function(){
                  $(this).change();
            }); 
			
}	
	
function get_filter_key($filter_element){
	if ($filter_element.data('filter_key')==null)
		$filter_element.data('filter_key', new_guid());
	return $filter_element.data('filter_key');
}	
	
function showSpinner(callback){
	$('#loading').show();
	if (callback) setTimeout(callback, 500);
}

function hideSpinner(){
	$('#loading').hide();
}

function showTimeDiff(start, message)
{
	if (message==null) message='';
	var finish = new Date();
	var diff = new Date(finish.getTime() - start.getTime());
	var value = message + ' ' + diff.getSeconds()+ " " + diff.getMilliseconds();
		console.log(value); 
		return value;
}