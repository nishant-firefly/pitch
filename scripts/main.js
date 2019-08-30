function populate_table($table, json_objects, match_value) {
    var start = new Date();
    var rows, $col, $row, $cells, $cell, $columnsHeader, value, arrResults, match_color,
        tableId = $table.attr('id'); //FOR SUGGESTED ORDER SORTING FIX
    $table.find('tbody > tr').remove();
    $columnsHeader = $table.find('tr.header > th');
    rows = [];

    match_color = $table.attr('matchRowColor');
    if (match_color == '')
        match_color == null;

    var tableWidth = 0;
    var columnArray = [];
    $columnsHeader.each(function (index) {
        $col = $(this);
        var colObject = {};
        //minQtyRequirement
        colObject.field = $col.attr('field');
        colObject.minQtyRequirement = $col.attr('minQtyRequirement');
        colObject.filter_attribute = $col.attr('filterattribute');
        colObject.column_color = $col.attr('columncolor');
        colObject.format_mask = $col.attr('formatmask');
        colObject.row_content = $col.attr('rowcontent');
        colObject.LockedHeadersPaddingDifference = $col.attr('LockedHeadersPaddingDifference');
        colObject.width = $col.width();
        colObject.$column = $col;
        colObject.changeZeroColor = $col.attr('zerocolor');

        columnArray.push(colObject);
    });
    var row;
    var widths = $table.attr('widths');
    if (widths != null)
        widths = $table.attr('widths').split(',');

    $.map(json_objects, function (item) {

        row = [];
        row.push('<tr>');
        $.map(columnArray, function (colObject, index) {
            try {
                cellStyles = [];
                cell = [];
                cell.push('<td');
                cellStyles.push('style="')

                var field = colObject.field;
                var minQtyRequirement = colObject.minQtyRequirement;
                var filter_attribute = colObject.filter_attribute;
                var column_color = colObject.column_color;
                var format_mask = colObject.format_mask;
                var row_content = colObject.row_content;
                var LockedHeadersPaddingDifference = parseInt(colObject.LockedHeadersPaddingDifference);
                var zeroColor = colObject.changeZeroColor;

                if(zeroColor && item[field] == 0){
                        cellStyles.push('color:' + zeroColor + ';')
                }
              
                if (widths != null) {
                    colObject.$column.width(widths[index]);
                }

                if (isNaN(LockedHeadersPaddingDifference)) {
                    cellStyles.push('width:' + (colObject.$column.width()) + 'px;');
                    cellStyles.push('min-width:' + (colObject.$column.width()) + 'px;');
                    cellStyles.push('max-width:' + (colObject.$column.width()) + 'px;');
                }
                else {
                    cellStyles.push('width:' + (colObject.$column.width() + LockedHeadersPaddingDifference) + 'px;');
                    cellStyles.push('min-width:' + (colObject.$column.width() + LockedHeadersPaddingDifference) + 'px;');
                    cellStyles.push('max-width:' + (colObject.$column.width() + LockedHeadersPaddingDifference) + 'px;');
                }

                if (rows.length == 0)
                    tableWidth += colObject.$column.width();
                var style = '';
                if (field != null) {
                    value = eval_with_this(field, item);
                    change_color(value, cellStyles);
                    if (format_mask != null)
                        value = $.formatNumber(value, { format: colObject.format_mask });

                    cell.push('field="' + field + '"');
                }
                else {
                    value = '';
                    field = '';
                }
                if (filter_attribute != null)
                    cell.push(filter_attribute + '=""'); //$cell.attr(filterattribute,'');

                if (match_value != null && match_value == item.MatchCondition && match_color != null)
                    cellStyles.push('background-color:' + match_color + ';');//$cell.css('background-color', match_color);
                else if (column_color != null)
                    cellStyles.push('background-color:' + column_color + ';'); //$cell.css('background-color', column_color);

                //append the cell details if there are row_content from the header
                if (row_content != null) {
                    value = value + row_content;
                }

                cellStyles.push('"');
                cell.push(cellStyles.join(' '));
                cell.push('>' + value + '</td>');
                row.push(cell.join(' '));
            }
            catch (ex) { }
        });
        //if (rows.length<20){
        row.push('</tr>');
        rows.push(row.join(' '));
        //}
    });
    showTimeDiff(start, 'populated rows');
    var skipwidth = $table.attr('skipwidthcalculation')
    if (!skipwidth)
        $table.width(tableWidth);

    $table.find('tbody').append(rows);
    //find all values with storagekeyprefix,

    //The following block is for table input seacrh 
    var $pNode = $($table).prop('parentNode');
    if ($($pNode).find('input.PCInputSearch')) {
        var $pcInput = $($pNode).find('input.PCInputSearch'),        
         strKey = $($pcInput).attr('storagekeyprefix'),
         inptValue = load_storage($pcInput.attr('storagekeyprefix'));       
        if (inptValue) $pcInput.attr('value', inptValue);
       
        FilterGridDataByTextInput($pcInput);
    }

    var $elementsWithStoragesKeys = $table.find('*[storagekeyprefix]')
    $elementsWithStoragesKeys.each(function (index) {
        var $item = $(this), $itemUPC = $item.parent().parent()[0].children[3].innerText;
        //append an unique index behind the key prefix make sure everything is unique.
        $item.attr('storagekeyprefix', $item.attr('storagekeyprefix') + '' + index);
        //load from the storage and see if we have any OLD values defined and restore them into the checkbox.
        var value = load_storage($item.attr('storagekeyprefix'));

        /*Custom Code for Suggested Order Start
        *
        *   add classes for input tags
        *   suggOrder1 & suggOrder
        *   
        */
        if ($item.hasClass('suggOrder')) {
            var myIndex = stripNonRealDigits($item[0].className),
             myVal = retrieveJSON(myIndex, tableId, $itemUPC);

            if ($item.is('[type=checkbox]')) {
                if (myVal == true) {
                    $item.attr('checked', myVal);
                }
            } else if ($item.is('[type=tel]')) {
                if (myVal) {
                    $item.attr('value', myVal);
                } else {
                    $item.attr('value', " ");
                }
            }
        }
            /*
            *     Custom Code for Suggested Order END              
            */
        else {
            if ($item.is('[type=checkbox]')) {
                $item.attr('checked', value ? (value.toLowerCase() == 'true' || value === true) : false);
            } else if ($item.is('[type=tel]')) {
                $item.attr('value', value);
            } else if ($item.is('[type=textbox]')) {
                $item.attr('value', value);
            } else if ($item.hasClass('checkboximage')) {
                $item.toggleClass('checked', value ? (value.toLowerCase() == 'true' || value === true) : false);
            }
        }
    })

    $table.on('change', 'input[storagekeyprefix]', function () {

        var $item = $(this), $itemUPC = $item.parent().parent()[0].children[3].innerText,
            $numOfInpts = $item.parent().parent().find('input').length;

        //  Suggested Order Code that creates the local storage item
        //  and Creates key/value pairs depending on the number of inputs
        if ($item.hasClass('suggOrder')) {
            jsonCreate($numOfInpts, $itemUPC, tableId)
        }

        // inputs For  [SUGGESTED ORDER]
        /*
        *   Custom Code for Suggested Order START
        */
        if ($item.hasClass('suggOrder')) {
            var myKey = stripNonRealDigits($item[0].className);

            if ($item.is('[type=checkbox]')) { // for items that are dynamically created
                $item.attr('checked', $item.is(':checked'));

                saveItems(tableId, $itemUPC, myKey, $item.is(':checked'))
                save_storage($item.attr('storagekeyprefix'), $item.is(':checked'));

            } else if ($item.is('[type=tel]')) {//for items that are dynamically created
                $item.attr('value', $item.val());

                saveItems(tableId, $itemUPC, myKey, $item.val())
                save_storage($item.attr('storagekeyprefix'), $item.val());
            }
            /*
            *   Custom Code for Suggested Order END
            */
            //normal tables
        } else if ($item.is('[type=checkbox]')) {
            $item.attr('checked', $item.is(':checked'));
            save_storage($item.attr('storagekeyprefix'), $item.is(':checked'))
        } else if ($item.is('[type=textbox]')) {//enable textbox.
            $item.attr('value', $item.val());
            save_storage($item.attr('storagekeyprefix'), $item.val())
        }

    });
    if (typeof populate_table_overload == 'function') {
        //alert($table[0].id);
        populate_table_overload($table[0].id);
    };


    //Custom logic to color the table values
    var changeNum = $table.attr('changeNumColor')
    if (changeNum) {
        shippersChangeNumColor($table);
    }

    var colorTextRed = $table.attr('colorTextRed')
    if (colorTextRed) {
        colorTextToRed($table);
    }

    var thisTableAttr = $table.attr('tabletitle')
    if (thisTableAttr) {
        listIPTableIDs();
        setTimeout(function () {
            caculateItemSlideSummary($table[0].id);
        }, 500);
    };


}

//The following block is for table input seacrh 
function FilterGridDataByTextInput($object) {
    var $element = $object;
    var filterTarget = $element.attr('filterTarget'); //assigns the table id to filterTarget
    if ((filterTarget == null)) return;
    strFilterField = $element.attr('filterField')
    if (strFilterField == null) {
        $element.css('visibility', 'hidden');
        return;
    }
    var arrSelected = [{ value: $element.val() }];

    // create list string
    if (filterTarget != null) //Defaults to filterTarget even if both exist
        var TableIDsString = filterTarget
    else
        var TableIDsString = filterTargets


    var TableIDs = TableIDsString.split(',');
    for (var x in TableIDs) {
        var $target = $('#' + TableIDs[x]);
        if ($target.length == 0) {
            $element.css('visibility', 'hidden');
            return;
        }

        var arrString = $.map(arrSelected, function (item) {
            return item.value;
        });

        save_storage($element.attr('storagekeyprefix'), arrString);
        if (strFilterField != null) {
            $target
                .find('tr:not(.header) > td[field="' + strFilterField + '"]').each(function () {
                    var $pNode = $(this).prop('parentNode'),
                        descrription = $(this).prop('innerHTML');
                    var hideThis = arrString.length != 0 && (!descrription.toLowerCase().includes(arrString[0].toLowerCase()));//comparing the value                                                
                    hideThis ? $($pNode).attr('hidden', true) : $($pNode).attr('hidden', false);
                });
        }
        $target.find('tr:not(.header)').removeClass('hidden');
        $target.find('tr:not(.header) > td.hidden').parent('tr').addClass('hidden');
        $object.trigger('custom_multi_select');
    }
}

function retrieveJSON(myIndex, tableId, UPC) {
    var key = tableId + "_" + UPC;
    //console.log(key)
    var myData = JSON.parse(localStorage.getItem(key));
    if (!myData) {
        return false;
    } else {
        return myData[0][myIndex];
    }
}

function jsonCreate(inputs, UPC, tableId) {
    var myKey = tableId + "_" + UPC, myJSON, myObj, myArray = [];
    myJSON = JSON.parse(localStorage.getItem(myKey));

    if (!myJSON) {
        myObj = {};
        for (var i = 0; i < inputs; i++) {
            var mykey = i + 1;
            myObj[mykey] = '';
        }
        myArray.push(myObj);
        save_storage(myKey, JSON.stringify(myArray));
    }
}

function saveItems(tableId, UPC, key, value) {
    var myKey = tableId + "_" + UPC;
    var myJson = JSON.parse(load_storage(myKey));
    myJson[0][key] = value;
    save_storage(myKey, JSON.stringify(myJson));
}

function stripNonRealDigits(numberSource) {
    var m_strOut = new String(numberSource);
    m_strOut = m_strOut.replace(/[^\d.]/g, '');
    return m_strOut;
}



function colorTextToRed($table) {
    var cells = $table[0].childNodes[3].childNodes[0].cells;
    for (var i = 0; i < cells.length; i++) {
        var myValue = cells[i].textContent;
        if (myValue == "0") {
            var myNextColValue = cells[i].textContent;
            if (myNextColValue == "0") {
                //console.log("change the color", myNextColValue);
                cells[i].style.color = "#C62430";
            }
        }
    }
}


function shippersChangeNumColor($table) {


    var cells = $table[0].childNodes[3].childNodes;
    var cellsLength = cells.length;
    for (x = 0; x < cellsLength; x++) {
        var $this = cells[x];
        if ($($this).is('tr')) {
            cells = $table[0].childNodes[3].childNodes[x].cells;
        }
    }

    for (var i = 0; i < cells.length - 1; i++) {
        var myValue = cells[i].textContent;
        if (myValue == "1") {
            var nextCell = i + 1;
            var myNextColValue = cells[nextCell].textContent;
            if (myNextColValue == "0") {
                cells[nextCell].style.color = "#C62430";
            }
        }
    }
}

function change_color(value, cellStyles) {
    if (value == null || cellStyles == null) return false;
    if (value < 0)
        cellStyles.push('color:#FF0000;');
}

function display_barcode($tr) {
    $('div#OrderCode').text('Shelf Code: ' + $tr.find('td[field="ShelfCode"]').text());
    UPCA.ShowBarcode($('div#UPCCode'), $tr.find('td[field="UPC"]').text());
    $('div#Product').text($tr.find('td[field="Product"]').text());
    $('.selected-info').width($('#tblSalesData').width());
}

function changeRadioGraphFilter($radioContainer, item, all_data) {
    var $graphContainer = $('#' + $radioContainer.attr('filtertarget'));
    var graphData = eval_with_this($graphContainer.attr('graphdata'), all_data);
    var max_date;
    for (var x in graphData) {
        var record = graphData[x];
        var daysDiff, weekDiff;
        if (record.WeekNum == 52) {
            max_date = record.WeekEnding;
            daysDiff = Date.daysBetween(Date.parse(max_date), Date.today().moveToDayOfWeek(0, -1));
            weekDiff = parseInt(daysDiff / 7);
            break;
        }
    }
    if (weekDiff == null || weekDiff == 0)
        item.Value = 'WeekNum<13'
    else
        item.Value = '(WeekNum>=' + (1 + weekDiff) + ' && WeekNum<' + (13 + weekDiff) + ')'

    return item;
}

Date.daysBetween = function (date1, date2) {
    //Get 1 day in milliseconds
    var one_day = 1000 * 60 * 60 * 24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    return Math.round(difference_ms / one_day);
}

function filterSelectedRow(arrString, $row) {

   // console.log("filterSelectedRow(arrString, $row)");

    var selectedOnly = arrString[0] == 'Selected';
    var hasChecked = $row.find('div.checkboximage.checked,input:checked').length > 0;
    $row.find('div.checkboximage,input:checkbox').parent().toggleClass('hidden', !hasChecked && selectedOnly);

}



//function populate_table($table, json_objects, match_value) {
//    var start = new Date();
//    var rows, $col, $row, $cells, $cell, $columnsHeader, value, arrResults, match_color;
//    $table.find('tbody > tr').remove();
//    $columnsHeader = $table.find('tr.header > th');
//    rows = [];

//    match_color = $table.attr('matchRowColor');
//    if (match_color == '')
//        match_color == null;

//    var tableWidth = 0;
//    var columnArray = [];
//    $columnsHeader.each(function (index) {
//        $col = $(this);
//        var colObject = {};

//        colObject.field = $col.attr('field');
//        colObject.filter_attribute = $col.attr('filterattribute');
//        colObject.column_color = $col.attr('columncolor');
//        colObject.format_mask = $col.attr('formatmask');
//        colObject.row_content = $col.attr('rowcontent');
//        colObject.LockedHeadersPaddingDifference = $col.attr('LockedHeadersPaddingDifference');
//        colObject.width = $col.width();
//        colObject.$column = $col;

//        columnArray.push(colObject);
//    });
//    var row;
//    var widths = $table.attr('widths');
//    if (widths != null)
//        widths = $table.attr('widths').split(',');

//    $.map(json_objects, function (item) {

//        row = [];
//        row.push('<tr>');
//        $.map(columnArray, function (colObject, index) {
//            try {
//                cellStyles = [];
//                cell = [];
//                cell.push('<td');
//                cellStyles.push('style="')

//                var field = colObject.field;
//                var filter_attribute = colObject.filter_attribute;
//                var column_color = colObject.column_color;
//                var format_mask = colObject.format_mask;
//                var row_content = colObject.row_content;
//                var LockedHeadersPaddingDifference = parseInt(colObject.LockedHeadersPaddingDifference);

//                if (widths != null) {
//                    colObject.$column.width(widths[index]);
//                }


//                if (isNaN(LockedHeadersPaddingDifference)) {
//                    cellStyles.push('width:' + (colObject.$column.width()) + 'px;');
//                    cellStyles.push('min-width:' + (colObject.$column.width()) + 'px;');
//                    cellStyles.push('max-width:' + (colObject.$column.width()) + 'px;');
//                }
//                else {
//                    cellStyles.push('width:' + (colObject.$column.width() + LockedHeadersPaddingDifference) + 'px;');
//                    cellStyles.push('min-width:' + (colObject.$column.width() + LockedHeadersPaddingDifference) + 'px;');
//                    cellStyles.push('max-width:' + (colObject.$column.width() + LockedHeadersPaddingDifference) + 'px;');
//                }


//                if (rows.length == 0)
//                    tableWidth += colObject.$column.width();
//                var style = '';
//                if (field != null) {
//                    value = eval_with_this(field, item);
//                    change_color(value, cellStyles);
//                    if (format_mask != null)
//                        value = $.formatNumber(value, { format: colObject.format_mask });

//                    cell.push('field="' + field + '"');
//                }
//                else {
//                    value = '';
//                    field = '';
//                }
//                if (filter_attribute != null)
//                    cell.push(filter_attribute + '=""'); //$cell.attr(filterattribute,'');

//                if (match_value != null && match_value == item.MatchCondition && match_color != null)
//                    cellStyles.push('background-color:' + match_color + ';');//$cell.css('background-color', match_color);
//                else if (column_color != null)
//                    cellStyles.push('background-color:' + column_color + ';'); //$cell.css('background-color', column_color);


//                //append the cell details if there are row_content from the header
//                if (row_content != null) {
//                    value = value + row_content;
//                }
//                cellStyles.push('"');
//                cell.push(cellStyles.join(' '));
//                cell.push('>' + value + '</td>');
//                row.push(cell.join(' '));
//            }
//            catch (ex) { }
//        });
//        //if (rows.length<20){
//        row.push('</tr>');
//        rows.push(row.join(' '));
//        //}
//    });
//    showTimeDiff(start, 'populated rows');
//    var skipwidth = $table.attr('skipwidthcalculation')
//    if (!skipwidth)
//        $table.width(tableWidth);

//    $table.find('tbody').append(rows);
//    //find all values with storagekeyprefix,  
//    var $elementsWithStoragesKeys = $table.find('*[storagekeyprefix]')
//    $elementsWithStoragesKeys.each(function (index) {
//        var $item = $(this);
//        //append an unique index behind the key prefix make sure everything is unique.
//        $item.attr('storagekeyprefix', $item.attr('storagekeyprefix') + '' + index);
//        //load from the storage and see if we have any OLD values defined and restore them into the checkbox.
//        var value = load_storage($item.attr('storagekeyprefix'));
//        if ($item.is('[type=checkbox]')) {
//            $item.attr('checked', value ? (value.toLowerCase() == 'true' || value === true) : false);
//        } else if ($item.is('[type=textbox]')) {
//            $item.attr('value', value);
//        } else if ($item.hasClass('checkboximage')) {
//            $item.toggleClass('checked', value ? (value.toLowerCase() == 'true' || value === true) : false);
//        }
//    })
//    $table.on('change', 'input[storagekeyprefix]', function () {
//        var $item = $(this);
//        //add check change against the checkbox for now.
//        if ($item.is('[type=checkbox]')) {
//            $item.attr('checked', $item.is(':checked'));
//            save_storage($item.attr('storagekeyprefix'), $item.is(':checked'))
//        } else if ($item.is('[type=textbox]')) {//enable textbox.
//            $item.attr('value', $item.val());
//            save_storage($item.attr('storagekeyprefix'), $item.val())
//        }
//    });
//    if (typeof populate_table_overload == 'function') {
//        //alert($table[0].id);
//        populate_table_overload($table[0].id);
//    };


//    var thisTableAttr = $table.attr('tabletitle')
   
//    if (thisTableAttr) {
//        console.log($table[0].id);
//        console.log($table)s;

//       // caculateItemSlideSummary($table[0].id);
//    };
   
//}

//function change_color(value, cellStyles) {
//    if (value == null || cellStyles == null) return false;
//    if (value < 0)
//        cellStyles.push('color:#FF0000;');
//}

//function display_barcode($tr) {
//    $('div#OrderCode').text('Shelf Code: ' + $tr.find('td[field="ShelfCode"]').text());
//    UPCA.ShowBarcode($('div#UPCCode'), $tr.find('td[field="UPC"]').text());
//    $('div#Product').text($tr.find('td[field="Product"]').text());
//    $('.selected-info').width($('#tblSalesData').width());
//}

//function changeRadioGraphFilter($radioContainer, item, all_data) {
//    var $graphContainer = $('#' + $radioContainer.attr('filtertarget'));
//    var graphData = eval_with_this($graphContainer.attr('graphdata'), all_data);
//    var max_date;
//    for (var x in graphData) {
//        var record = graphData[x];
//        var daysDiff, weekDiff;
//        if (record.WeekNum == 52) {
//            max_date = record.WeekEnding;
//            daysDiff = Date.daysBetween(Date.parse(max_date), Date.today().moveToDayOfWeek(0, -1));
//            weekDiff = parseInt(daysDiff / 7);
//            break;
//        }
//    }
//    if (weekDiff == null || weekDiff == 0)
//        item.Value = 'WeekNum<13'
//    else
//        item.Value = '(WeekNum>=' + (1 + weekDiff) + ' && WeekNum<' + (13 + weekDiff) + ')'

//    return item;
//}

//Date.daysBetween = function (date1, date2) {
//    //Get 1 day in milliseconds
//    var one_day = 1000 * 60 * 60 * 24;

//    // Convert both dates to milliseconds
//    var date1_ms = date1.getTime();
//    var date2_ms = date2.getTime();

//    // Calculate the difference in milliseconds
//    var difference_ms = date2_ms - date1_ms;

//    // Convert back to days and return
//    return Math.round(difference_ms / one_day);
//}

//function filterSelectedRow(arrString, $row) {
//    var selectedOnly = arrString[0] == 'Selected';
//    var hasChecked = $row.find('div.checkboximage.checked,input:checked').length > 0;
//    $row.find('div.checkboximage,input:checkbox').parent().toggleClass('hidden', !hasChecked && selectedOnly);

//}
