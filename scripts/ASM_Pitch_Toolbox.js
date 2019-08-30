function runSlideFunctions($table) {
    var Tid = $table.attr('id'),
        targetTable, tblCalcFunction;
    $("#" + Tid + " " + 'table[tablecalcfunction]').each(function (index, el) {
        targetTable = $(this);
        tblCalcFunction = window[targetTable.attr('tablecalcfunction')];
    });

    if (tblCalcFunction !== undefined) {
        setTimeout(function () {
            tblCalcFunction(targetTable);
        }, 500);
    }

    ////Run CustomPhoto Function that loads photos
    if (document.getElementById($table.attr('id')).hasAttribute("loadItems")) {
        BuildHTMLPDFTable();
    }
}



//For PDF Button
function create_pdf() {

    //remove the pitch border background from the pdf
    $("html").css({ 'background-color': 'white' });

    //hide the PDF button 
    $('.creatPDF').css({ 'display': 'none' });

    //generate the pdf
    ASMPDFHelper.pitch_pdf($('div.current'));

    //temp fix to put back the border around the pitch after pdf generates
    window.setTimeout(function () {
        $("html").css({ 'background-color': ' #F2F2F2' });
        $('.creatPDF').css({ 'display': 'block' });
    }, 1000);

}

function BuildHTMLPDFTable() {    
    ////var sNumber = pitch_data.STORENUMBER, key = "CORE_CustomPDF" + sNumber,
    ////selectedProducts = getProducts(key);
    //Data Object
    //var data = selectedProducts;
    var data = buildPDFData();
    
    //Get the inner divs of the html template 
    var HTMLTemplate = $("#containerPDF").children();
    //Clear the table
    //Using text('') or html('') will cause some string parsing to take place, which generally is a bad idea when working with the DOM. Try and use DOM manipulation methods that do not involve string representations of DOM objects wherever possible.
    $('#containerPDF div').empty();

    if (data.length <= 40) {
        for (var i = 0; i < data.length; i++) {
            for (var x = 0; x < data.length; x++) {
                HTMLTemplate[x].innerHTML =
                  
                "<div class='summaryTable'>" +
                       "<div class='cellProductName DCsummaryItem2'>" 
                             + data[x].product + 
                       "</div>" +
                "</div>" + 


                "<div class='summaryTable'>" +
                       "<div class='cellProductMSI DCsummaryItem2'>"
                            + "Case Pack: " + data[x].CasePack +
                       "</div>" +
                "</div>" + 

                "<div class='summaryTable'>" +
                    "<div class='cellProductQTY DCsummaryItem2'>"
                            + "Qty: " + data[x].Qty +
                    "</div>" +
             "</div>" +

                    //"<div class='cellProductMSI DCsummaryItem2'>" + "Case Pack: " + data[x].orCode + "</div>" +
                    //"<div class='cellProductQTY DCsummaryItem2'>" + "Qty: " + data[x].qty + "</div>" +
                "<img class='cellBarcode cellBarcode" + x + "'>"
                makePDfBarCode(x, data[x].UPC);
            }
        }
    }
   
}

function buildPDFData() {
    var targtTable = $("[buildPDFData='true']"), tableId = targtTable.prop('id'), selectedProducts = [],

    TableRows = document.getElementById(tableId).getElementsByTagName('tbody')[0].rows.length,
       thisRow = 0;

    while (thisRow < TableRows) {
        var elmnt = document.getElementById(tableId).getElementsByTagName('tbody')[0].children[thisRow];

        if (!$(elmnt).hasClass('hidden') && $(elmnt).find('input:checkbox').is(':checked')) {
            // Adjust accordingly/tailor fit to what you want to show on your PDF export slide.
            var myTDs = document.getElementById(tableId).getElementsByTagName('tbody')[0].children[thisRow].children,
             productName = myTDs[1].childNodes[0].data,
             $orCode = myTDs[2].childNodes[0].data,
             $upc = myTDs[3].childNodes[0].data,
             physicalOnHand = ((myTDs[5].childNodes[0].value == "") ? "N/A" : stripNonRealDigits(myTDs[5].childNodes[0].value));

            selectedProducts.push({
                "product": productName,
                "UPC": $upc,
                "CasePack": $orCode,
                "Qty": physicalOnHand,               
            });
        }
        thisRow++;
    }
    console.log(selectedProducts);
    return selectedProducts;
}
function makePDfBarCode(index, upc) {
    $('.cellBarcode' + index).JsBarcode(upc, {
        format: "upc",
        width: 1.3,
        height: 70,
        margin: 0,
    });
}





function getProducts(key) {
    var myData = JSON.parse(localStorage.getItem(key));
    if (!myData) {
        return [];
    } else {
        return myData;
    }
}


function checkboxcheck(element, productName, orCode, upc, qty) {
    var sNumber = pitch_data.STORENUMBER, key = "CORE_CustomPDF" + sNumber,
    selectedProducts = getProducts(key);

    var count = $("#tblSugOrd_All1 input[type='checkbox']:checked").length;
    var $element = $(element);
    var checkbox = $(element.parentNode.parentNode.cells[0].childNodes[0]);
    var productName = $(element.parentNode.parentNode.cells[productName].childNodes[0]);
    var $upc = $(element.parentNode.parentNode.cells[upc].childNodes[0].data);
    var $orCode = $(element.parentNode.parentNode.cells[orCode].childNodes[0].data);
    var qty = ((element.parentNode.parentNode.cells[qty].childNodes[0].value == "") ? 0 : stripNonRealDigits(element.parentNode.parentNode.cells[qty].childNodes[0].value));
    var barcode = $('#UPCCode').html();

    if (count <= 20) {
        //if (checkbox.prop('checked') == true) {
        //    //check if in the array, if it is remove it or push it if not in array
        //    if ($.inArray($upc.selector, selectedProducts == 0)) {
        //        for (i = 0; i < selectedProducts.length; i++) {
        //            if (selectedProducts[i].UPC == $upc.selector) {
        //                selectedProducts.splice([i], 1);
        //                // console.log("deleting identical item");
        //            }
        //        }
        //        //console.log("pushing another element in the array", count);
        //        selectedProducts.push({
        //            "product": productName[0].data,
        //            "UPC": $upc.selector,
        //            "orCode": $orCode.selector,
        //            "barcode": barcode,
        //            "qty": qty
        //        });
        //    }
        //}
        //if (checkbox.prop('checked') == false) {
        //    if (selectedProducts.length != 0) {
        //        for (i = 0; i < selectedProducts.length; i++) {
        //            if (selectedProducts[i].UPC == $upc.selector) {
        //                selectedProducts.splice([i], 1);
        //            }
        //        }
        //    }
        //}
        //save_storage(key, JSON.stringify(selectedProducts));
    } else {
        checkbox.prop('checked', false);
        confirm("You cannot select more then 20 products!");
    }
}


function stripNonRealDigits(numberSource) {
    var m_strOut = new String(numberSource);
    m_strOut = m_strOut.replace(/[^\d.]/g, '');
    return m_strOut;
}

function ClearAll(container_name, recalculate_table) // This is a clear function athat wipes out saved values (whether checkbox, text box, or filter) and re-filters the table. Because some tables need to have special recalculation functions, we can activate custom functions by table-name.
{
    if (container_name == null)
        container_name = $(event.srcElement).parent().attr('id');

    var $container;
    $container = $('#' + container_name);

    //Gets all the highlighted rows in the table.
    var tableCompleteRows = $container.children().children().children().children();

    var $multiSelects = $container.find('select[multiselect=true][storagekeyprefix]');
    $multiSelects.multiselect("uncheckAll");
    $multiSelects.multiselect("close");
    var $Selects = $container.find('select[multiselect=false][storagekeyprefix]');
    $Selects.val('');
    $Selects.change();

    var $elementsWithStoragesKeys = $container.find('*[storagekeyprefix]');
    $elementsWithStoragesKeys.each(function (index) {
        var $item = $(this), $itemUPC = $item.parent().parent()[0].children[3].innerText;
       
        /*Custom Code for Suggested Order
           *
           *   add classes for input tags in HTML
           *   i.e. suggOrder1 & suggOrder
           *   
           */
        if ($item.hasClass('suggOrder')) {
            if ($item.is('[type=checkbox]')) {
                var myIndex = stripNonRealDigits($item[0].className);
                clearSuggOrderJSONs(myIndex, recalculate_table, $itemUPC);
                $item.attr('checked', false);

            } else if ($item.is('[type=tel]')) {
                var myIndex = stripNonRealDigits($item[0].className);
                clearSuggOrderJSONs(myIndex, recalculate_table, $itemUPC);
                $item.attr('value', " ");
            }
        } else if ($item.is('[type=checkbox]')) {
            $item.attr('checked', false);
            //remove highlighted row
            tableCompleteRows.removeClass('complete');
            $item.change();
        } else if ($item.hasClass('checkboximage')) {
            if ($item.hasClass('checked'))
                $item.click();
        } else if ($item.is('[type=tel]')) {
            $item.val('');
            $item.change();
        }

    });
}

// Suggested Order FX
function clearSuggOrderJSONs(myIndex, tableId, $itemUPC) {
    var key = tableId + "_" + $itemUPC;
    var myData = JSON.parse(localStorage.getItem(key));
    
    if (!myData) return;

    if (myIndex == 1) {
        myData[0][myIndex] = false;
    } else {
        myData[0][myIndex] = " ";
    }
    save_storage(key, JSON.stringify(myData));
}


$(window).ready(function () {
    $('body select[filterTarget]').bind('custom_multi_select', function () {
        //when any of those select values are changed, it will run this function
        //the selected values are returned within the arrSelected array.
        //to convert to string,  use the $.map function.
        var arrSelected = $(this).multiselect("getChecked");
        var arrString = $.map(arrSelected, function (item) {
            return item.value;
        });
        var filterDiv = $(this).closest("div").attr("id");
        if (filterDiv.substring(0, 6) == 'MLF_PC') {
            var tblDiv = 'tbl' + filterDiv.replace("_filters", "");
            BigBetsRecalculateTable(tblDiv);
        }
    })


})

//EvenListener that grey out the row that was clicked on
document.addEventListener("change", function (event) {
    //get the element that was clicked on
    var el = $(event.target);
    //get the TR that contains the checkbox
    var tableRow = el.closest("tr");
    if (el.attr("checked") == "checked") {
        tableRow.addClass("complete");
    }
    else {
        tableRow.removeClass("complete");
    }

});

function DynamicPitch_SetStringAndWrite(data_hash_table) {
    //alert('start');
    var Activities = data_hash_table['ARTS_Client_Activities'];
    var ClientList = data_hash_table['SIF_ClientList_All1'];
    // console.log(Activities);
    var ListString = '';
    var addString = false;
    //   if (typeof Activities[x].distribution_folder[i]['OS'] != "undefined" && typeof Activities[x].distribution_folder[i]['AC'] != "undefined") {
    for (var x = 0; x < Activities.length; x++) {
        for (var i in Activities[x].distribution_folder) { //Ok, now we are in each product.
            //check if OS exist in the object
            if (typeof Activities[x].distribution_folder[i]['OS'] != "undefined") {
                if ((Activities[x].distribution_folder[i]['OS'].pt == "Distribution Void (DV)" || Activities[x].distribution_folder[i]['OS'].pt == "Out-Of-Stock (OOS)" || Activities[x].distribution_folder[i]['OS'].pt == "No Tag (NT)")) {

                    if (Activities[x].distribution_folder[i]['AC'] == null) {
                        continue;
                    }

                    addString = checkOpeningAndActionStatus(Activities[x].distribution_folder[i]);

                    if (addString) {
                        if (Activities[x].distribution_folder[i].pt) {
                            ListString += ',{"Product":"' + Activities[x].distribution_folder[i]['pt'] + '","UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","shlfCode":"' + getShelfCode(Activities[x].distribution_folder[i]['oth_info']) + '","Category":"' + Activities[x].distribution_folder[i].CPT + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
                        }
                        else if (Activities[x].distribution_folder[i].prompt) {
                            ListString += ',{"Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","shlfCode":"' + getShelfCode(Activities[x].distribution_folder[i]['oth_info']) + '","Category":"' + Activities[x].distribution_folder[i].CPT + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
                        }
                    }
                }
            }
        }//end Distribution Folder
    }//end Activities

    //Massage data quick and easy since client wants PF from Json displayed as EX 10373 -> Core 40
    ListString = ListString.replace(/11012/g, 'Front End');
    ListString = ListString.replace(/11013/g, 'In Aisle');

    ListString = ListString.replace(/Distribution Void \(DV\)/g, "DV")
    ListString = ListString.replace(/Out-Of-Stock \(OOS\)/g, 'OOS');
    //ListString = ListString.replace(/On Shelf \(SH\)/g, 'ORS');
    ListString = ListString.replace(/On Shelf Discontinue \(SD\)/g, 'SD');
    ListString = ListString.replace(/No Tag \(NT\)/g, 'NT');
    ListString = ListString.replace(/On Shelf \(SH\)/g, 'SH');



    if (ListString == '') {
        ListString = 'No Distribution items able to be listed.';
    }
    else {
        ListString = '{SugOrd_All1:[' + ListString + ']}';
        var OOSobj = eval("(" + ListString + ')');
    }

    //console.log("OOSobj", OOSobj);
    //check if obj there or crashs the app if there is no data for this data source.
    if (OOSobj != undefined) {
        //sort
        OOSobj.SugOrd_All1.sort(function (a, b) {
            // return (a.Product) - (b.Product);
            return (a.Product > b.Product) - (a.Product < b.Product)
        });
    }

    //merge dynamic object
    $.extend(true, data_hash_table, OOSobj);

    return data_hash_table;
}


// Only Chrome & Opera pass the error object.
window.onerror = function (message, file, line, col, error) {
    console.log(message, "from", error.stack);
    // You can send data to your server
    // sendError(data);
};
// Only Chrome & Opera have an error attribute on the event.
window.addEventListener("error", function (e) {
    console.log(e.error.message, "from", e.error.stack);
    // You can send data to your server
    // sendError(data);
})

function checkOpeningAndActionStatus(data) {

    if (data['OS']['pt'] == "Out-Of-Stock (OOS)") {
        // console.log('Out-Of-Stock (OOS)', data);
        if (typeof data['AC'] == 'undefined' || data['AC'] == null) {
            return false;
        } else if (data['AC'].pt == 'Order Suggested (ORS)') {
            return true;
        }
    }

    if (data['OS']['pt'] == "Distribution Void (DV)") {
        // console.log('No Tag (NT)', data);
        if (typeof data['AC'] == 'undefined' || data['AC'] == null) {
            console.log('undefined', data);
            return false;
        } else if (data['AC'].pt == 'Order Suggested (ORS)' || data['AC'].pt == 'Tagged (TG)') {
            //console.log('Tagged (TG)', data);
            return true;
        }
    }

    if (data['OS']['pt'] == "No Tag (NT)") {
        //console.log('No Tag (NT)', data);
        if (typeof data['AC'] == 'undefined' || data['AC'] == null) {
            console.log('undefined', data);
            return false;
        } else if (data['AC'].pt == 'Tagged (TG)') {
            //console.log('Tagged (TG)', data);
            return true;
        }
    }

    return false;
    // Distribution Void (DV)
    // Out-Of-Stock (OOS) 
}

//function getStatus(data) {
//    if (data['OS']['pt'] == "Out-Of-Stock (OOS)") {
//        if (typeof data['AC'] != "undefined" && data['AC']['pt'] == "Filled (F)") {
//            return 'OOS\/F';
//        } else {
//            return 'OOS'
//        }
//    } else {
//        return data['OS']['pt'];
//    }
//}

//function getTagged(data) {

//    if (typeof data['AC'] != "undefined") {
//        if (data['AC']['pt'] == "Tagged (TG)") {
//            // console.log(data['AC']['pt']);
//            return 1;
//        } else {
//            return 0;
//        }
//    } else {
//        return 0;
//    }

//}

//function getFilled(data) {

//    if (typeof data['AC'] != "undefined") {
//        if (data['AC']['pt'] == "Filled (F)") {
//            // console.log(data['AC']['pt']);
//            return 1;
//        } else {
//            return 0;
//        }
//    } else {
//        return 0;
//    }

//}


//function getRotated(data) {

//    if (typeof data['AC'] != "undefined") {
//        if (data['AC']['pt'] == "Rotated (R)") {
//            // console.log(data['AC']['pt']);
//            return 1;
//        } else {
//            return 0;
//        }
//    } else {
//        return 0;
//    }

//}

function getShelfCode(data) {

    //Getting Case Pack for ACY not shelfcode 
   /// var CP = stripNonRealDigits(data.split('~')[1]);
    var CP = data, pipe = 0, ary=[];

    for (var i = 0; i < CP.length; i++) {      
        if (CP[i] == "|") {
            pipe = pipe + 1;
        }

        if (pipe == 4 && pipe < 5) {
            if (CP[i] == "|") {
                continue;
            }
            ary.push(CP[i]);
        }       
    }

   // console.log(ary.join(''));
    if (CP === "") {
        //SC = data.substring(1, 13)
        CP = "NA";
    }

    return ary.join('');
}

//function getClientName(id, list) {
//    var result = $.grep(list, function (e) { return e.ClientId == id; });
//    return result[0].Name;
//}

function countTaggedFilledRotatedInstanced() {
    //console.log("countTaggedFilledRotatedInstanced");

    var Tagged = 0, Rotated = 0, Filled = 0;

    document.getElementById('coreTaggedContent').innerHTML = '';
    document.getElementById('coreRotatedContent').innerHTML = '';
    document.getElementById('coreFilledContent').innerHTML = '';



    $('tr', $('#tblSugOrd_All1' + " " + 'tbody')).each(function () {
        var myClass = $(this).attr("class");

        if (!$(this).hasClass("hidden")) {
            //console.log($(this));
            $('td', $($(this))).each(function (x) {
                // console.log($(this)[0].attributes[0].value, x);
                var field = $(this)[0].attributes[0].value
                if (field == "Tagged") {
                    // console.log($(this));
                    if ($(this)[0].innerHTML !== "0") {
                        Tagged = Tagged + 1;
                    }
                }

                if (field == "Rotated") {
                    //console.log($(this));
                    if ($(this)[0].innerHTML !== "0") {
                        Rotated = Rotated + 1;
                    }
                }

                if (field == "Filled") {
                    //console.log($(this));
                    if ($(this)[0].innerHTML !== "0") {
                        Filled = Filled + 1;
                    }
                }
            });
        }
    });

    document.getElementById('coreTaggedContent').innerHTML = Tagged;
    document.getElementById('coreRotatedContent').innerHTML = Rotated;
    document.getElementById('coreFilledContent').innerHTML = Filled;
}

$(document).ready(function () {
    var sNumber = pitch_data.STORENUMBER, key = "CORE_CustomPDF" + sNumber,
    pdfData = getProducts(key);

    //confirm(pdfData);
    //console.log(pdfData);
    if (pdfData.length > 0) {
        setTimeout(function () {
            BuildHTMLPDFTable(pdfData);
        }, 2000);
    }
});