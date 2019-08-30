
function runFunction(currentPage) {
    if (currentPage == "#MWCD_CStore_ProfitCalcSumm1") {
        setTimeout(function () {
            // SummaryScreen2();
            ProfitCalculatorSummary();
        }, 500);
    }
}

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



    (function ($, undefined) {
        $.fn.clearable = function () {
            var $this = this;
            $this.wrap('<div class="clear-holder" />');
            var helper = $('<span class="clear-helper">x</span>');
            $this.parent().append(helper);
            helper.click(function(){
                $this.val("");               
                //console.log($($this).attr('storagekeyprefix'))
                save_storage($($this).attr('storagekeyprefix'), "");
                FilterGridDataByTextInput($($this));

                //var $pNode = $('#' + recalculate_table).prop('parentNode');
                //if ($($pNode).find('input.PCInputSearch')) {
                //    var $pcInput = $($pNode).find('input.PCInputSearch');                
                //    save_storage($pcInput.attr('storagekeyprefix'), "");
                //    FilterGridDataByTextInput($pcInput);
                //}
            });
        };
    })(jQuery);

    if (document.getElementById($table.attr('id')).hasAttribute("clearablesearch")) {
       
            
        var myInput = $('#'+Tid).find('input[customsearchbar]').attr('id');
        $("#" + myInput).clearable();
        

        //(function ($, undefined) {
        //    $.fn.clearable = function () {
        //        var $this = this;
        //        $this.wrap('<div class="clear-holder" />');
        //        var helper = $('<span class="clear-helper">x</span>');
        //        $this.parent().append(helper);
        //        helper.click(function(){
        //            $this.val("");               
        //            //console.log($($this).attr('storagekeyprefix'))
        //            save_storage($($this).attr('storagekeyprefix'), "");
        //            FilterGridDataByTextInput($($this));

        //            //var $pNode = $('#' + recalculate_table).prop('parentNode');
        //            //if ($($pNode).find('input.PCInputSearch')) {
        //            //    var $pcInput = $($pNode).find('input.PCInputSearch');                
        //            //    save_storage($pcInput.attr('storagekeyprefix'), "");
        //            //    FilterGridDataByTextInput($pcInput);
        //            //}
        //        });
        //    };
        //})(jQuery);

       

       

        //$('input[customsearchbar]').each(function () {
        //    // console.log($(this).attr('id'))
        //    var inputId = $(this).attr('id');
        //   
        //});
       
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

    //Data Object   
    var data = buildPDFData();

    //Get the inner divs of the html template 
    var HTMLTemplate = $("#containerPDF").children();
    //Clear the table
    //Using text('') or html('') will cause some string parsing to take place, which generally is a bad idea when working with the DOM. Try and use DOM manipulation methods that do not involve string representations of DOM objects wherever possible.
    $('#containerPDF div').empty();

    if (data.length <= 20) {
        for (var i = 0; i < data.length; i++) {
            for (var x = 0; x < data.length; x++) {
                HTMLTemplate[x].innerHTML =
                   "<div class='cellProductName'>" + data[x].product + "</div>" +
                    "<div class='cellProductUPC'>" + "UPC: " + data[x].UPC + "</div>" +
                     "<div class='cellProductDC'>" + "Distributor #: " + data[x].DistributorNum + "</div>" +

                      "<div class='imageWrapper'>" +
                            "<div id='cellProductImage" + x + "'>" +
                            "</div>" +
                   "</div>" +
                   "<img class='cellBarcode cellBarcode" + x + "'>"
                makePDfBarCode(x, data[x].UPC);
                buildPDFImage(data[x].UPC, x);
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
            var myTDs = document.getElementById(tableId).getElementsByTagName('tbody')[0].children[thisRow].children;
            // Adjust accordingly/tailor fit to what you want to show on your PDF export slide.
            var productName = myTDs[1].childNodes[0].data,
            $DistributorNum = myTDs[4].innerHTML,
            $upc = myTDs[3].childNodes[0].data;
          
            selectedProducts.push({
                "product": productName,
                "UPC": $upc,
                "DistributorNum": $DistributorNum,
            });
        }
        thisRow++;
    }
    //console.log(selectedProducts);
    return selectedProducts;
}

function makePDfBarCode(index, upc) {
    $('.cellBarcode' + index).JsBarcode(upc, {
        format: "upc",
        width: .9,
        height: 65,
        margin: 1,
    });
}

function buildPDFImage(upc, index) {

    var tmpImg = new Image();
    tmpImg.src = "./images/Products/" + upc + ".png";

    $(tmpImg).one('load', function () {
        //console.log(tmpImg.src);
        //console.log("width: " + tmpImg.width + " height: " + tmpImg.height);

        orgWidth = tmpImg.width;
        orgHeight = tmpImg.height;

        //landscape
        //if (orgWidth >= 219) {
        if (orgHeight < orgWidth) {
            tmpImg.height = 50;
            //tmpImg.style.marginTop = "43px";
            tmpImg.style.width = "112px";
        }
        else {
            //if (orgHeight >= 219) {
            //Portrait
            if (orgHeight > orgWidth) {
                tmpImg.width = 60;
                tmpImg.height = 78;
            }
            else {
                console.log("no image found");
            }
        }

        $('#cellProductImage' + index).html(tmpImg);

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


function checkboxcheck(element, productName, upc, orCode, qty) {

    var sNumber = pitch_data.STORENUMBER, key = "CORE_CustomPDF" + sNumber,
   selectedProducts = getProducts(key);

    var myCells = $(element.parentNode.parentNode.cells),
        count = $("#tblSugOrd_All1 input[type='checkbox']:checked").length,
        checkbox = $(element.parentNode.parentNode.cells[0].childNodes[1]),
    Product = $($.grep(myCells, function (a) { if ($(a).attr("field") === 'Product') { return $(a) } })).prop('innerHTML'),
    UPC = stripNonRealDigits($($.grep(myCells, function (a) { if ($(a).attr("field") === 'UPC') { return $(a) } })).prop('innerHTML')),
    DistributorNum = Number(stripNonRealDigits($($.grep(myCells, function (a) { if ($(a).attr("field") === 'DistributorNum') { return $(a) } })).prop('innerHTML')));

    if (count <= 16) {
        if (checkbox.prop('checked') == true) {
            //check if in the array, if it is remove it or push it if not in array
            if ($.inArray(UPC, selectedProducts == 0)) {
                for (i = 0; i < selectedProducts.length; i++) {
                    if (selectedProducts[i].UPC == UPC) {
                        selectedProducts.splice([i], 1);
                        // console.log("deleting identical item");
                    }
                }
                //console.log("pushing another element in the array", count);
                selectedProducts.push({
                    "Product": Product,
                    "UPC": UPC,
                    "DistributorNum": DistributorNum
                });
            }
        }
        if (checkbox.prop('checked') == false) {
            if (selectedProducts.length != 0) {
                for (i = 0; i < selectedProducts.length; i++) {
                    if (selectedProducts[i].UPC == UPC) {
                        selectedProducts.splice([i], 1);
                    }
                }
            }
        }
        save_storage(key, JSON.stringify(selectedProducts));
    } else {
        checkbox.prop('checked', false);
        confirm("You cannot select more than 16 products!");
    }
}


function stripNonRealDigits(numberSource) {
    var m_strOut = new String(numberSource);
    m_strOut = m_strOut.replace(/[^\d.]/g, '');
    return m_strOut;
}

function ClearAll(container_name, recalculate_table) {
    if (container_name == null)
        container_name = $(event.srcElement).parent().attr('id');

    var $container;
    $container = $('#' + container_name);

    var $multiSelects = $container.find('select[multiselect=true][storagekeyprefix]');
    $multiSelects.multiselect("uncheckAll");
    $multiSelects.multiselect("close");
    var $Selects = $container.find('select[multiselect=false][storagekeyprefix]');
    $Selects.val('');
    $Selects.change();

    var $elementsWithStoragesKeys = $container.find('*[storagekeyprefix]')
    $elementsWithStoragesKeys.each(function (index) {
        var $item = $(this); // $itemUPC = $item.parent().parent()[0].children[3].innerText;

        if($item.parent().parent()[0].children[3].innerText != undefined) $itemUPC = $item.parent().parent()[0].children[3].innerText; //SUGGESSTED ORDER FIX

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
        }  else if ($item.is('[type=text]')) {         
            $item.val('');
            $item.change();
        }
    });
  
   

    //change this by calculator
    if (recalculate_table.substring(0, 7) == 'MWCD_Pr') {
        // BigBetsRecalculateTable(recalculate_table);
        caculateItemSlideSummary(recalculate_table);
    }

    //if(recalculate_table == ''){
    $('tr', $('#' + recalculate_table + " " + 'tbody')).each(function () {
        $(this).attr('hidden', false); 
    });
    //} 
    FilterGridDataByTextInput($($this));

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
        if (filterDiv.substring(0, 7) == 'MWCD_Pr') {
            var tblDiv = 'tbl' + filterDiv.replace("_filters", "");
            // BigBetsRecalculateTable(tblDiv);
            caculateItemSlideSummary(tblDiv);
        }
    })

    var sNumber = pitch_data.STORENUMBER, key = "CORE_CustomPDF" + sNumber,
    pdfData = getProducts(key);

    //confirm(pdfData);
    //console.log(pdfData);
    if (pdfData.length > 0) {
        setTimeout(function () {
            BuildHTMLPDFTable(pdfData);
        }, 2000);
    }


    setTimeout(function () {
        listIPTableIDs();
    }, 2000);

})

//List IDs with object in it
function listIPTableIDs() {
    // console.log("creating objects")
    var myLC = [], tPrps = new Object(), myTableIds = [];

    $('table', $('#pageholder')).each(function () {
        var Id = $(this).attr("tabletitle"), tname;
        if (Id) {
            var $this = $(this), arry = [];
            tname = $this[0].id

            if (localStorage.getItem(tname) === null) {
                save_storage(tname, JSON.stringify(arry));
                myLC = JSON.parse(localStorage.getItem(tname));
                //hardcoded [8]
                tTitle = $this[0].attributes[8].value
                tPrps.add = [],
                tPrps.sub = [],
                tPrps.tTitle = tTitle
                tPrps.sSmry = [0, 0, 0, 0],
                myLC.push(tPrps);
                save_storage(tname, JSON.stringify(myLC));
            }
        }
    });

    if (localStorage.getItem("TableIds") === null) {
        save_storage("TableIds", JSON.stringify(myTableIds));

        myTableIds = JSON.parse(localStorage.getItem("TableIds"));

        $('table', $('#pageholder')).each(function () {
            var Id = $(this).attr("tabletitle"), tname;
            if (Id) {
                var $this = $(this), arry = [];
                tname = $this[0].id
                myTableIds.push(tname);
            }
        });
        save_storage("TableIds", JSON.stringify(myTableIds));
    } else {
        return;
    }
}

function caculateItemSlideSummary(TableDivId) {

    var AddTarget = 8; //Cell that holds add checkbox hardcoded
    var SubtractTarget = 7; //Cell that holds subtract checkbox hardcoded
    var ValueTarget = 6; //Cell that contains the value

    //makes variable table id + string that is bellow
    var AddValueTarget = TableDivId + '_AddValue';
    var SubtractValueTarget = TableDivId + '_SubtractValue';
    var ImpactValueTarget = TableDivId + '_ImpactValue';
    var NetValueTarget = TableDivId + '_NetValue';

    var AddValue = 0;
    var SubtractValue = 0;
    var ImpactValue = 0;
    var NetValue = 0;

    var AddedItemArray = [];
    var SubractedItemArray = [];
    var slideSummaryArray = [];

    var TableRows = document.getElementById(TableDivId).getElementsByTagName('tbody')[0].rows.length;
    var thisRow = 0;

    while (thisRow < TableRows) {
        //alert(thisRow);
        var CaseRowElement = document.getElementById(TableDivId).getElementsByTagName('tbody')[0].getElementsByTagName('tr')[thisRow];
        //alert(CaseRowElement.className)
        if (!$(CaseRowElement).hasClass('hidden')) {
            if (document.getElementById(TableDivId).getElementsByTagName('tbody')[0].children[thisRow].children[ValueTarget] != null) {
                var rowElement = document.getElementById(TableDivId).getElementsByTagName('tbody')[0].children[thisRow];
                var targetValue = parseFloat(stripNonRealDigits(rowElement.children[ValueTarget].innerHTML));
                var targetValueRounded = targetValue.toFixed(2);

                //gets the product name KB
                var colName = document.getElementById(TableDivId).getElementsByTagName('tbody')[0].rows[thisRow].cells[2].innerHTML;

                //gets the table title attribute
                var tableTitle = document.getElementById(TableDivId).getAttribute("tabletitle");

                if ($(rowElement.children[AddTarget].childNodes[0]).hasClass('checked')) {
                    AddValue = AddValue + targetValue;
                    AddedItemArray.push(colName)
                }

                if ($(rowElement.children[SubtractTarget].childNodes[0]).hasClass('checked')) {
                    SubtractValue = SubtractValue + targetValue;
                    SubractedItemArray.push(colName)
                }
            }
        }
        thisRow++;
    }

    ImpactValue = AddValue - SubtractValue;
    //alert(ImpactValue);
    if (SubtractValue != 0) {
        NetValue = ImpactValue / SubtractValue * 100;
    }
    else {
        NetValue = 0
    }


    //  alert(NetValue);
    //Now to format these
    var AddValueFormatted = '$' + Math.round(AddValue);
    var SubtractValueFormatted = '$' + Math.round(SubtractValue);
    var ImpactValueFormatted = '$' + Math.round(ImpactValue);
    var NetValueFormatted = Math.round(NetValue) + '%';

    var IndicatorArrow = '';
    if (NetValue != 0) {
        if (NetValue < 0) {
            IndicatorArrow = '<img src="images/red_down.png">';
        }
        else {
            IndicatorArrow = '<img src="images/green_up.png">';
        }
    }

    // Now output them to the Divs
    document.getElementById(AddValueTarget).innerHTML = AddValueFormatted;
    document.getElementById(SubtractValueTarget).innerHTML = SubtractValueFormatted;
    document.getElementById(ImpactValueTarget).innerHTML = ImpactValueFormatted;
    document.getElementById(NetValueTarget).innerHTML = NetValueFormatted + IndicatorArrow;

    slideSummaryArray.push(AddValue, SubtractValue);

    var PCSlideObj = JSON.parse(localStorage.getItem(TableDivId));

    PCSlideObj[0].add = AddedItemArray;
    PCSlideObj[0].sub = SubractedItemArray;
    PCSlideObj[0].sSmry = slideSummaryArray;

    save_storage(TableDivId, JSON.stringify(PCSlideObj));
}

function ProfitCalculatorSummary() {
    document.getElementById('add').innerHTML = "";
    document.getElementById('sub').innerHTML = "";
    var AddedItemArray, SubractedItemArray, AddValueX = 0, SubtractValueX = 0, ImpactValueX = 0, NetValueX = 0;

    myTableIds = JSON.parse(localStorage.getItem("TableIds"));

    for (var i = 0; i < myTableIds.length; i++) {
        var SData = JSON.parse(localStorage.getItem(myTableIds[i]));

        AddedItemArray = SData[0].add;
        if (AddedItemArray.length > 0) {
            var str = '<p class="SummaryScreen_UL_Text">' + SData[0].tTitle + '</p>' + '<ul>';

            for (a = 0; a < AddedItemArray.length; ++a) {
                str += '<li>' + AddedItemArray[a] + '</li>';
            }
            str += '</ul>';
            $('#add').append(str);
            str = "";
        }

        SubractedItemArray = SData[0].sub;
        if (SubractedItemArray.length > 0) {
            var str2 = '<p class="SummaryScreen_UL_Text">' + SData[0].tTitle + '</p>' + '<ul>';
            for (h = 0; h < SubractedItemArray.length; ++h) {
                str2 += '<li>' + SubractedItemArray[h] + '</li>';
            }
            str2 += '</ul>';
            $('#sub').append(str2);
            str2 = "";
        }
        AddValueX = AddValueX + SData[0].sSmry[0];
        SubtractValueX = SubtractValueX + SData[0].sSmry[1];
        ImpactValueX = AddValueX - SubtractValueX;
        if (SubtractValueX != 0) {
            NetValueX = ImpactValueX / SubtractValueX * 100;
        }
        else {
            NetValueX = 0
        }

    }

    //console.debug("AddValueX", AddValueX.toFixed(2), "SubtractValueX", SubtractValueX.toFixed(2), "ImpactValueX", ImpactValueX.toFixed(2), "NetValueX", NetValueX.toFixed(2))

    document.getElementById('kgbtblDEMO_PC_IC1_AddValue').innerHTML = "$" + AddValueX.toFixed(2).toString();
    document.getElementById('kgbtblDEMO_PC_IC1_SubtractValue').innerHTML = "$" + SubtractValueX.toFixed(2).toString();
    document.getElementById('kgbtblDEMO_PC_IC1_ImpactValue').innerHTML = "$" + ImpactValueX.toFixed(2).toString();
    document.getElementById('kgbtblDEMO_PC_IC1_NetValue').innerHTML = NetValueX.toFixed(2);

    if (document.getElementById('kgbtblDEMO_PC_IC1_NetValue').innerHTML >= 0) {
        document.getElementById('kgbtblDEMO_PC_IC1_NetValue').innerHTML += "%" + "<img src=\"images/green_up.png\">";
    }
    else {
        document.getElementById('kgbtblDEMO_PC_IC1_NetValue').innerHTML += "%" + "<img src=\"images/red_down.png\">";
    }

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function BigBetsfindit(element, ColumnToShow, ColumnToChange) {
    var $element = $(element);
    //use the follow items to changet check state,
    //also save the updated check states to storage.
    $element.toggleClass('checked');
    save_storage($element.attr('storagekeyprefix'), $element.hasClass('checked'));

    var CBChecked = $element.hasClass('checked');

    if (CBChecked == 1) {
        var $otherCheckbox = $(element.parentNode.parentNode.cells[ColumnToChange].childNodes[0]);
        if ($otherCheckbox.hasClass('checked')) {
            $otherCheckbox.removeClass('checked');
            save_storage($otherCheckbox.attr('storagekeyprefix'), $otherCheckbox.hasClass('checked'));
        }
    }
    var TableName = element.parentNode.parentNode.parentNode.parentNode.id;
    // BigBetsRecalculateTable(TableName);
    caculateItemSlideSummary(TableName);
}


function DynamicPitch_SetStringAndWrite(data_hash_table) {
    //alert('start');
    var Activities = data_hash_table['ARTS_Client_Activities'];

    if (!data_hash_table['ARTS_Client_Activities']) return;

    // console.log(Activities);
    var ListString = '';
    var addString = false;
    var tableRows = 0;
    var items = 0;
    var activityItems = 0;
    var allItems = 0;
    var Consumption = false;
    //   if (typeof Activities[x].distribution_folder[i]['OS'] != "undefined" && typeof Activities[x].distribution_folder[i]['AC'] != "undefined") {
    for (var x = 0; x < Activities.length; x++) {
        for (var i in Activities[x].distribution_folder) { //Ok, now we are in each product.
            //check if OS exist in the object
            allItems = allItems + 1;
            if (typeof Activities[x].distribution_folder[i]['OS'] != "undefined") {
                activityItems = activityItems + 1;
                if (Activities[x].distribution_folder[i]['OS'].pt == "Distribution Void (DV)") {
                    items = items + 1;
                    addString = checkOpeningAndActionStatus(Activities[x].distribution_folder[i], Consumption);
                    var UPC = Activities[x].distribution_folder[i]['codes'].substring(1, 13);

                    if (addString) {
                        tableRows = tableRows + 1;
                        if (Activities[x].distribution_folder[i].pt) {
                            ListString += ',{"Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","UPC":"' + UPC + '","ORP":"' + getORP(Activities[x].distribution_folder[i]) + '","CI":"' + getCI(Activities[x].distribution_folder[i]) + '","CF":"' + getCF(Activities[x].distribution_folder[i]) + '","NA":"' + getNoAction(Activities[x].distribution_folder[i]) + '"}';
                        }
                        else if (Activities[x].distribution_folder[i].prompt) {
                            ListString += ',{"Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","UPC":"' + UPC + '","ORP":"' + getORP(Activities[x].distribution_folder[i]) + '","CI":"' + getCI(Activities[x].distribution_folder[i]) + '","CF":"' + getCF(Activities[x].distribution_folder[i]) + '","NA":"' + getNoAction(Activities[x].distribution_folder[i]) + '"}';
                        }
                    } else {
                        console.log("non item", Activities[x].distribution_folder[i])
                    }
                }
            }
        }//end Distribution Folder
    }//end Activities

    //Massage data quick and easy since client wants PF from Json displayed as EX 10373 -> Core 40
    //+ '","Family":"' + getFamily(Activities[x].distribution_folder[i]['oth_info'])
    //'","Status":"' + getStatus(Activities[x].distribution_folder[i]['oth_info']) +
    ListString = ListString.replace(/11012/g, 'Front End');

    ListString = ListString.replace(/11013/g, 'In Aisle');
    //FC Chocolate & Fruity Conf  = 11658
    ListString = ListString.replace(/11658/g, 'FC Chocolate & Fruity Conf');
    //IC Chocolate & Fruity Conf = 11761
    ListString = ListString.replace(/11761/g, 'IC Chocolate & Fruity Conf');
    //IC Gum & Mint 11764
    ListString = ListString.replace(/11764/g, 'IC Gum & Mint');
    //Blockbuster - Chocolate = 12212
    ListString = ListString.replace(/12212/g, 'Blockbuster - Chocolate');
    //Blockbuster - Fruity Conf = 12213
    ListString = ListString.replace(/12213/g, 'Blockbuster - Fruity Conf');
    //Blockbuster - Gum/Mint = 12214
    ListString = ListString.replace(/12214/g, 'Blockbuster - Gum/Mint');
    //Extended - Chocolate = 12215
    ListString = ListString.replace(/12215/g, 'Extended - Chocolate');
    //Extended - Fruity Conf = 12216
    ListString = ListString.replace(/12216/g, 'Extended - Fruity Conf');
    //Extended - Gum/Mint = 12217
    ListString = ListString.replace(/12217/g, 'Extended - Gum/Mint');
    //FC Priority - Chocolate = 12218
    ListString = ListString.replace(/12218/g, 'FC Priority - Chocolate');
    //FC Priority - Fruity Conf = 12219
    ListString = ListString.replace(/12219/g, 'FC Priority - Fruity Conf');
    //Snacking = 12222
    ListString = ListString.replace(/12222/g, 'Snacking');
    //Snacking - Priority = 12223
    ListString = ListString.replace(/12223/g, 'Snacking - Priority');
    //Extended - Gum = 12424
    ListString = ListString.replace(/12424/g, 'Extended - Gum');
    //Extended - Mint = 12422
    ListString = ListString.replace(/12422/g, 'Blockbuster - Gum');
    //Blockbuster - Gum = 12425
    ListString = ListString.replace(/12425/g, 'Extended - Mint');
    //Blockbuster - Mint = 12423
    ListString = ListString.replace(/12423/g, 'Blockbuster - Mint');
    //Innovation - Mint = 12430
    ListString = ListString.replace(/12430/g, 'Innovation');
    //FC Chocolate 12426
    ListString = ListString.replace(/12426/g, 'FC Chocolate');
    //FC Fruity Conf 12427
    ListString = ListString.replace(/12427/g, 'FC Fruity Conf');
    //IC Fruity Conf 12428
    ListString = ListString.replace(/12428/g, 'IC Fruity Conf');
    //IC Chocolate 11659
    ListString = ListString.replace(/11659/g, 'IC Chocolate');
    //IC Gum 11739
    ListString = ListString.replace(/11739/g, 'IC Gum');
    //IC Mint 11740
    ListString = ListString.replace(/11740/g, 'IC Mint');


    //ListString = ListString.replace(/Distribution Void \(DV\)/g, "DV")
    //ListString = ListString.replace(/Out-Of-Stock \(OOS\)/g, 'OOS');
    //ListString = ListString.replace(/On Shelf \(SH\)/g, 'ORS');
    //ListString = ListString.replace(/On Shelf Discontinue \(SD\)/g, 'SD');
    //ListString = ListString.replace(/No Tag \(NT\)/g, 'NT');
    //ListString = ListString.replace(/On Shelf \(SH\)/g, 'SH');

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

    console.log("tableRows", tableRows, "items", items, "activityItems", activityItems, "allItems", allItems)
    //merge dynamic object
    $.extend(true, data_hash_table, OOSobj);
    return data_hash_table;
}


function checkOpeningAndActionStatus(data, Consumption) {
    //console.log(data['OS']['pt']);
    if (data['OS']['pt'] == "On Shelf (SH)") {

        if (typeof data['AC'] != 'undefined' || data['AC'] != null) {
            if (Consumption && data['AC'].pt == 'Confirmed (CF)' ) {
                console.log('Consumption', 'Confirmed (CF)');
                return true;
            }
        }
        // console.log('Out-Of-Stock (OOS)', data);
        if (typeof data['AC'] == 'undefined' || data['AC'] == null) {
            return false;
        } else if (data['AC'].pt == 'Confirmed (CF)') {
            return true;
        }

        
    }

    if (data['OS']['pt'] == "Distribution Void (DV)") { 
        if (typeof data['AC'] != 'undefined' || data['AC'] != null) {
            if (Consumption && (data['AC'].pt == 'Cut-In (CI)' || data['AC'].pt == 'Ordered (OR)')) {
                //console.log('Consumption', 'Cut-In (CI)');
                return true;
            }        
        }

        if (typeof data['AC'] == 'undefined' || data['AC'] == null) {
            //console.log('undefined', data);
            return true;
        } else if (data['AC'].pt == 'Cut-In (CI)' || data['AC'].pt == 'Confirmed (CF)') {
            // console.log('Tagged (TG)', data);
            return true;
        }      
    }

    return false;
    // Distribution Void (DV)
    // Out-Of-Stock (OOS) 
    // On Shelf (SH)
    // Confirmed (CF)
    // Cut-In (CI)
}

function getORP(data) {

    if (typeof data['AC'] != "undefined" && data['AC'] != null) {
        if (data['AC']['pt'] == "Order Placed (ORP)") {
            // console.log(data['AC']['pt']);
            return 1;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

function getCI(data) {
    if (typeof data['AC'] != "undefined" && data['AC'] != null) {
        if (data['AC']['pt'] == "Cut-In (CI)") {
            //console.log(data['AC']['pt']);
            return 1;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}


function getCF(data) {
    if (typeof data['AC'] != "undefined" && data['AC'] != null) {
        if (data['AC']['pt'] == "Confirmed (CF)") {
            // console.log(data['AC']['pt']);
            return 1;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

function getNoAction(data) {
    if (data['AC'] == null) {
        //console.log("no action");
        return 1;
    } else {
        return 0;
    }
    //if (typeof data['AC'] != "undefined" && data['AC'] != null) {
    //    if (data['AC']['pt'] == "Confirmed (CF)") {
    //        // console.log(data['AC']['pt']);
    //        return 1;
    //    } else {
    //        return 0;
    //    }
    //} else {
    //    return 0;
    //}
}
   
//count all Order Placed (ORP), Cut-In (CI) and Confirmed (CF) items
function countORPCICF() {
    //console.log("countORPCICF");
    var ORP = 0, CI = 0, CF = 0, NA = 0, row = 0,

        fcChocFrt = 0,
    //FC Chocolate & Fruity Conf  = 11658
        icChocFrt = 0,
    //IC Chocolate & Fruity Conf = 11761
        icGumMnt = 0,
    //IC Gum & Mint 11764
        blckChoc = 0,
    //Blockbuster - Chocolate = 12212
        blckFrtConf = 0,
    //Blockbuster - Fruity Conf = 12213
        blckGumMnt = 0,
    //Blockbuster - Gum/Mint = 12214    
        extChoc = 0,
    //Extended - Chocolate = 12215
        extFrtConf = 0,
    //Extended - Fruity Conf = 12216
        extGumMnt = 0,
    //Extended - Gum/Mint = 12217
        fcPrtyChoc = 0,
    //FC Priority - Chocolate = 12218
        fcPrtyFrtConf = 0,
    //FC Priority - Fruity Conf = 12219
        snckng = 0,
    //Snacking = 12222
        snckngPrty = 0;
    //Snacking - Priority = 12223

    // NEW
    var blckGum = 0,
    //Blockbuster - Gum = 12422
    blckMnt = 0,
    //Blockbuster - Mint = 12423
    extGum = 0,
    //Extended - Gum = 12424
    extMnt = 0,
    //Extended - Mint = 12425
    Innovation = 0,
    //Innovation = 12430
    FCChocolate = 0,
    //FC Chocolate 12426
    FCFruityConf = 0,
    //FC Fruity Conf 12427
    ICFruityConf = 0,
    //IC Fruity Conf 12428
    ICChocolate = 0,
    //IC Chocolate 11659
    ICGum = 0,
    //IC Gum 11739
    ICMint = 0;
    //IC Mint 11740

    //OVERVIEW
    document.getElementById('sgDVORPContent').innerHTML = '';
    document.getElementById('sgDVCIContent').innerHTML = '';
    document.getElementById('sgSHCFContent').innerHTML = '';

    //FAMILIES
    document.getElementById('blckChocContent').innerHTML = '';
    document.getElementById('extChocContent').innerHTML = '';
    document.getElementById('fcPrtyChocContent').innerHTML = '';
    document.getElementById('fcPrtyFrtConfContent').innerHTML = '';

    document.getElementById('blckFrtConfContent').innerHTML = '';
    document.getElementById('extFrtConfContent').innerHTML = '';
    document.getElementById('blckGumContent').innerHTML = '';
    document.getElementById('extGumContent').innerHTML = '';

    document.getElementById('blckMintContent').innerHTML = '';
    document.getElementById('extMintContent').innerHTML = '';
    document.getElementById('InnovationContent').innerHTML = '';


    //document.getElementById('blckGumMntContent').innerHTML = '';      
    //document.getElementById('extGumMntContent').innerHTML = '';    
    //document.getElementById('fcChocFrtContent').innerHTML = '';
    //document.getElementById('icChocFrtContent').innerHTML = '';
    //document.getElementById('icGumMntContent').innerHTML = '';
    //document.getElementById('snckngContent').innerHTML = '';
    //document.getElementById('snckngPrtyContent').innerHTML = '';

    //console.log(pitch_data);

    //var 

    $('tr', $('#tblSugOrd_All1' + " " + 'tbody')).each(function () {
        row = row + 1;
        var myClass = $(this).attr("class"), myUPC = '';
        if (!$(this).hasClass("hidden")) {
            //console.log($(this));
            $('td', $($(this))).each(function (x) {
                //console.log($(this)[0].attributes[0].value, x);
                var field = $(this)[0].attributes[0].value;

                if (field == "ORP") {

                    if ($(this)[0].innerHTML !== "0") {
                        ORP = ORP + 1;
                    }
                }

                if (field == "CI") {
                    //console.log($(this));
                    if ($(this)[0].innerHTML !== "0") {
                        CI = CI + 1;
                    }
                }

                if (field == "CF") {
                    //console.log($(this));
                    if ($(this)[0].innerHTML !== "0") {
                        CF = CF + 1;
                    }
                }

                if (field == "NA") {
                    //console.log($(this));
                    if ($(this)[0].innerHTML !== "0") {
                        NA = NA + 1;
                    }
                }

                if (field == "Family") {
                    var famName = $(this)[0].innerHTML;
                    switch (famName) {
                        case 'FC Chocolate &amp; Fruity Conf':
                            fcChocFrt = fcChocFrt + 1;
                            break;
                        case 'IC Chocolate &amp; Fruity Conf':
                            icChocFrt = icChocFrt + 1;
                            break
                        case 'IC Gum &amp; Mint':
                            icGumMnt = icGumMnt + 1;
                            break;
                        case 'Blockbuster - Chocolate': //
                            blckChoc = blckChoc + 1;
                            break;
                        case 'Blockbuster - Fruity Conf': //
                            blckFrtConf = blckFrtConf + 1;
                            break;
                        case 'Blockbuster - Gum/Mint':
                            blckGumMnt = blckGumMnt + 1;
                            break
                        case 'Blockbuster - Mint': //
                            blckMnt = blckMnt + 1;
                            break;
                        case 'Blockbuster - Gum': //
                            blckGum = blckGum + 1;
                            break;
                        case 'Extended - Chocolate': //
                            extChoc = extChoc + 1;
                            break;
                        case 'Extended - Fruity Conf': //
                            extFrtConf = extFrtConf + 1;
                            break;
                        case 'Extended - Gum/Mint':
                            extGumMnt = extGumMnt + 1;
                            break;
                        case 'Extended - Mint': //
                            extMnt = extMnt + 1;
                            break;
                        case 'Extended - Gum': //
                            extGum = extGum + 1;
                            break;
                        case 'FC Priority - Chocolate': //
                            fcPrtyChoc = fcPrtyChoc + 1;
                            break;
                        case 'FC Priority - Fruity Conf': //
                            fcPrtyFrtConf = fcPrtyFrtConf + 1;
                            break;
                        case 'Snacking':
                            snckng = snckng + 1;
                            break;
                        case 'Snacking - Priority':
                            snckngPrty = snckngPrty + 1;
                            break;
                        case 'Innovation':
                            Innovation = Innovation + 1; //
                            break;
                        default:
                            // code block
                    }
                }
            });
        }
    });

    console.log("CF", CF, "CI", CI, "NA", NA, "row", row)

    //console.log('fcChocFrt', fcChocFrt, 'icChocFrt', icChocFrt,'icGumMnt',icGumMnt,'blckChoc',blckChoc,'blckFrtConf',blckFrtConf,'blckGumMnt',blckGumMnt,'extChoc',extChoc,'extFrtConf',extFrtConf,'extGumMnt',extGumMnt,'fcPrtyChoc',fcPrtyChoc,'fcPrtyFrtConf',fcPrtyFrtConf,'snckng',snckng,'snckngPrty',snckngPrty);

    //OVERVIEW
    document.getElementById('sgDVORPContent').innerHTML = NA;
    document.getElementById('sgDVCIContent').innerHTML = CI;
    document.getElementById('sgSHCFContent').innerHTML = CF;

    //FAMILIES
    document.getElementById('blckChocContent').innerHTML = blckChoc;
    document.getElementById('extChocContent').innerHTML = extChoc;
    document.getElementById('fcPrtyChocContent').innerHTML = fcPrtyChoc; 
    document.getElementById('fcPrtyFrtConfContent').innerHTML = fcPrtyFrtConf;
   
    document.getElementById('blckFrtConfContent').innerHTML = blckFrtConf;
    document.getElementById('extFrtConfContent').innerHTML = extFrtConf;
    document.getElementById('blckGumContent').innerHTML = blckGum;
    document.getElementById('extGumContent').innerHTML = extGum;

    document.getElementById('blckMintContent').innerHTML = blckMnt;
    document.getElementById('extMintContent').innerHTML = extMnt;
    document.getElementById('InnovationContent').innerHTML = Innovation;

    //document.getElementById('extGumMntContent').innerHTML = extGumMnt;
    //document.getElementById('fcChocFrtContent').innerHTML = fcChocFrt;
    //document.getElementById('blckGumMntContent').innerHTML = blckGumMnt;
    //document.getElementById('icChocFrtContent').innerHTML = icChocFrt;
    //document.getElementById('icGumMntContent').innerHTML = icGumMnt;
    //document.getElementById('snckngContent').innerHTML = snckng;
    //document.getElementById('snckngPrtyContent').innerHTML = snckngPrty;

    setTimeout(function () {
        hydrateDistributors()
    }, 500);

}

//var OSAdata = { 'MPC_LostSales_All1': data_hash_table[prop] };
//$.extend(true, data_hash_table, OSAdata);

function hydrateDistributors() {
    console.log('hydrateDistributors');

    var myASMID, itemDCode = pitch_data['MWCD_DistributorCodes_All1'], newARY = [];

    if (!pitch_data['ARTS_Client_Distributors']) return;

    var myIDfx = myID();

    $.when(myIDfx).done(makeArryFx).done(displayDIDno);

    setTimeout(function () { myID(); }, 1200);
    setTimeout(function () { makeNewArray(); }, 2200);
    setTimeout(function () { displayDID(); }, 3200);

    function myID() {
        // confirm('get asmID');
        var distASMID = pitch_data['ARTS_Client_Distributors'].id;
        distASMID = distASMID.toLowerCase()
        var dASMIDList = pitch_data['MWCD_DistASMID_All1'];

        myASMID = dASMIDList.filter(function (item) {
            var str = item.pikDistributorTeam
            str = str.toLowerCase()
            return str == distASMID;
        });

        myASMID = myASMID[0].ASMID;

    }

    var makeArryFx = makeNewArray();
    var displayDIDno = displayDID();

    function makeNewArray() {
        // confirm('makeNewArray');
        var myfilteredData;

        myfilteredData = itemDCode.filter(function (item) {
            return item.DistASMID == myASMID;
        });

        // console.log(myfilteredData);

        var OSAdata = { 'NewMWCD_DistributorCodes_All1': myfilteredData };
        $.extend(true, pitch_data, OSAdata);
    }

    function displayDID() {
        // confirm('displayDID');
        $('tr', $('#tblSugOrd_All1' + " " + 'tbody')).each(function () {

            var myCells = $(this).prop('cells'), offer = '', offerCell = '',
            myUPC = '';
            myUPC = $.grep(myCells, function (a) { if ($(a).attr("field") === 'UPC') { return $(a) } }),
            myDistNumFld = $.grep(myCells, function (a) { if ($(a).attr("field") === 'DistributorNum') { return $(a); } });

            myUPC = $(myUPC).prop('innerHTML')

            var itemDCode = pitch_data['NewMWCD_DistributorCodes_All1'];
            var dCode = " ";

            $.grep(itemDCode, function (element) {
                if (element.UPC == myUPC) {
                    dCode = element.DistCode;
                };
            });

            $(myDistNumFld).prop('innerHTML', dCode);
        });
    }

}


function contCompDistributionDataConstruct(data_hash_table) {
    /// console.log("contCompDistributionDataConstruct");
    if (!data_hash_table['ARTS_Client_Activities']) return;
   
    var Activities = data_hash_table['ARTS_Client_Activities'], Consumption = true;
  
    $('table[targetdistribution]').each(function () {
        var dataSource = $(this).attr("data"),   
            targetdistribution = $(this).attr("targetdistribution"),
            tableId = $(this).attr("id"), dataSrcArry = [], dataSrcObj = {},
            ICFCdata =$(this).attr("consumptiondata"),
            consumptiondata =  data_hash_table[ICFCdata],       
        
            myfilteredData = consumptiondata.filter(function (item) {
                return item.CONSUMPTION == targetdistribution;
            });       
       
        //console.log(myfilteredData);

        $('th', $('#' + tableId + " " + 'thead tr')).each(function () {
            var propT = $(this).attr("field")
            propT = propT.replace(/ /g, '');
            //console.log(propT)
            dataSrcObj[propT] = 0;          
        });

       
        var totalItems = 0, consideredItems = 0, distItems = 0;

        // console.log(data_hash_table);

        //   if (typeof Activities[x].distribution_folder[i]['OS'] != "undefined" && typeof Activities[x].distribution_folder[i]['AC'] != "undefined") {
        for (var x = 0; x < Activities.length; x++) {
            for (var i in Activities[x].distribution_folder) { //Ok, now we are in each product.
                //check if OS exist in the object
                addString =false;

                if (typeof Activities[x].distribution_folder[i]['OS'] != "undefined") {
                    distItems += 1;
                    if (Activities[x].distribution_folder[i]['OS'].pt == "Distribution Void (DV)" || Activities[x].distribution_folder[i]['OS'].pt == "On Shelf (SH)") {

                        addString = checkOpeningAndActionStatus2(Activities[x].distribution_folder[i], Consumption);
                        var UPC = Activities[x].distribution_folder[i]['codes'].substring(1, 13);
                      
                        if (addString) {
                            totalItems += 1;
                            var distributionItem = myfilteredData.filter(function (item) {
                                return item.UPC == UPC;
                            }); 
                            
                           // console.log(Activities[x].distribution_folder[i], 'distributionItem', distributionItem);  

                            if(distributionItem.length > 0){
                                consideredItems += 1;
                                var CATEGORY= $(distributionItem).prop("CATEGORY"); 
                                CATEGORY = CATEGORY.replace(/ /g, '');                               
                                if (CATEGORY == 'GUM' && dataSource == 'MWCD_CompDistIC_All1'){
                                    console.log(Activities[x].distribution_folder[i]['prompt'])
                                }
                                ICFCConsumptionCat = dataSrcObj[CATEGORY];
                                ICFCConsumptionCat += 1;
                                dataSrcObj[CATEGORY] = ICFCConsumptionCat;
                            }
                        } else {
                           // console.log("non item", Activities[x].distribution_folder[i])
                        }
                    }
                }
            }//end Distribution Folder
        }//end Activities
        //console.log("distItems", distItems,"totalItems", totalItems, "consideredItems", consideredItems );

        dataSrcArry.push(dataSrcObj);


        var myNObj = { [dataSource] : dataSrcArry };       
        $.extend(true, data_hash_table, myNObj);
       
    });

    //console.log(data_hash_table);           
    return data_hash_table;
}


function checkOpeningAndActionStatus2(data, Consumption) {
    if (data['OS']['pt'] == null) return;
    //console.log(data['OS']['pt']);
    if (data['OS']['pt'] == "On Shelf (SH)") {        
        if (typeof data['AC'] != 'undefined' && data['AC'] != null) {          
            if (Consumption && data['AC'].pt == 'Confirmed (CF)' ) {
                //if(Consumption){
                //    console.log('Consumption', 'Confirmed (CF)');
                //    console.log(data);
                //}
              
                return true;
            }
        }              
    }

    if (data['OS']['pt'] == "Distribution Void (DV)") {        
        //console.log(typeof data['AC'] != 'undefined' || data['AC'] != null);
        if (typeof data['AC'] != 'undefined' && data['AC'] != null) {      
            if (Consumption && (data['AC'].pt == 'Cut-In (CI)' || data['AC'].pt == 'Order Placed (ORP)')) {
               // console.log('Consumption', 'Cut-In (CI)', 'Order Placed (ORP)');
                return true;
            }        
        }       
    }

    return false;
    // Distribution Void (DV)
    // Out-Of-Stock (OOS) 
    // On Shelf (SH)
    // Confirmed (CF)
    // Cut-In (CI)
    // Order Placed (ORP)
}

function mwcdTDLinxIdPull(data_hash_table) {
    if (data_hash_table["storeTDLinxID"] == null) {
        data_hash_table["storeTDLinxID"] = {
            TDLinx: ""
        };
    }

    if (!data_hash_table['ARTS_Client_TDLinx_MWCD']) return data_hash_table;
    var storeProfile = data_hash_table['ARTS_Client_TDLinx_MWCD'], Consumption = true;


    return data_hash_table;
}

function launchMTPApp() {
    console.log('launchMTPApp');

    var tdlinx = pitch_data["storeTDLinxID"]["TDLinx"];
    if (tdlinx == "") return;


    //mtpmobile://enrollstore/0062484
}

function findByVal(obj, id) {
    var result;
    for (var p in obj) {
        if (obj.id === id) {
            return obj;
        } else {
            if (typeof obj[p] === 'object') {
                result = findByVal(obj[p], id);
                if (result) {
                    return result;
                }
            }
        }
    }
    return result;
}


//var AddedItemArray = [];
//var SubractedItemArray = [];
//var AddedItemArray2 = [];
//var SubractedItemArray2 = [];
//var AddedItemArray3 = [];
//var SubractedItemArray3 = [];
//var AddedItemArray4 = [];
//var SubractedItemArray4 = [];
//var AddedItemArray5 = [];
//var SubractedItemArray5 = [];
//var AddedItemArray6 = [];
//var SubractedItemArray6 = [];

//var TABLEID1 = "tblMWCD_PC_Gum1";
//var TABLEID2 = "tblMWCD_PC_Confection1";
//var TABLEID3 = "tblMWCD_PC_Mint1";
//var TABLEID4 = "tblMWCD_PC_Peg1";
//var TABLEID5 = "tblMWCD_PC_All1";
//var TABLEID6 = "tblMWCD_PCCombos_All1";

//function BigBetsRecalculateTable(TableDivId) {

//    var AddTarget = 8; //Cell that holds add checkbox hardcoded
//    var SubtractTarget = 7; //Cell that holds subtract checkbox hardcoded
//    var ValueTarget = 6; //Cell that contains the value

//    //makes variable table id + string that is bellow
//    var AddValueTarget = TableDivId + '_AddValue';
//    var SubtractValueTarget = TableDivId + '_SubtractValue';
//    var ImpactValueTarget = TableDivId + '_ImpactValue';
//    var NetValueTarget = TableDivId + '_NetValue';

//    var AddValue = 0;
//    var SubtractValue = 0;
//    var ImpactValue = 0;
//    var NetValue = 0;

//    //Gets the count of how many rows are in the table.
//    var TableRows = document.getElementById(TableDivId).getElementsByTagName('tbody')[0].rows.length;
//    var thisRow = 0;

//    /*clear array to rebuild the data*/
//    if (TableDivId == TABLEID1) {
//        AddedItemArray = [];
//        SubractedItemArray = [];
//    }
//    if (TableDivId == TABLEID2) {
//        AddedItemArray2 = [];
//        SubractedItemArray2 = [];
//    }
//    if (TableDivId == TABLEID3) {
//        AddedItemArray3 = [];
//        SubractedItemArray3 = [];
//    }
//    if (TableDivId == TABLEID4) {
//        AddedItemArray4 = [];
//        SubractedItemArray4 = [];
//    }
//    if (TableDivId == TABLEID5) {
//        AddedItemArray5 = [];
//        SubractedItemArray5 = [];
//    }
//    if (TableDivId == TABLEID6) {
//        AddedItemArray6 = [];
//        SubractedItemArray6 = [];
//    }


//    while (thisRow < TableRows) {
//        //alert(thisRow);
//        var CaseRowElement = document.getElementById(TableDivId).getElementsByTagName('tbody')[0].getElementsByTagName('tr')[thisRow];
//        //alert(CaseRowElement.className)
//        if (!$(CaseRowElement).hasClass('hidden')) {
//            if (document.getElementById(TableDivId).getElementsByTagName('tbody')[0].children[thisRow].children[ValueTarget] != null) {
//                var rowElement = document.getElementById(TableDivId).getElementsByTagName('tbody')[0].children[thisRow];
//                var targetValue = parseFloat(stripNonRealDigits(rowElement.children[ValueTarget].innerHTML));
//                var targetValueRounded = targetValue.toFixed(2);

//                //gets the product name KB
//                var colName = document.getElementById(TableDivId).getElementsByTagName('tbody')[0].rows[thisRow].cells[2].innerHTML;

//                //gets the table title attribute
//                var tableTitle = document.getElementById(TableDivId).getAttribute("tabletitle");

//                if ($(rowElement.children[AddTarget].childNodes[0]).hasClass('checked')) {
//                    AddValue = AddValue + targetValue;

//                    if (TableDivId == TABLEID1) {
//                        /*add the item to array */
//                        AddedItemArray.push(colName)
//                    }
//                    else if (TableDivId == TABLEID2) {
//                        /*add the item to array */
//                        AddedItemArray2.push(colName)
//                    }
//                    else if (TableDivId == TABLEID3) {
//                        /*add the item to array */
//                        AddedItemArray3.push(colName)
//                    }
//                    else if (TableDivId == TABLEID4) {
//                        /*add the item to array */
//                        AddedItemArray4.push(colName)
//                    }
//                    else if (TableDivId == TABLEID5) {
//                        /*add the item to array */
//                        AddedItemArray5.push(colName)
//                    }
//                    else if (TableDivId == TABLEID6) {
//                        /*add the item to array */
//                        AddedItemArray6.push(colName)
//                    }
//                }

//                if ($(rowElement.children[SubtractTarget].childNodes[0]).hasClass('checked')) {
//                    SubtractValue = SubtractValue + targetValue;
//                    if (TableDivId == TABLEID1) {
//                        /*add the item to array */
//                        SubractedItemArray.push(colName)
//                    }
//                    else if (TableDivId == TABLEID2) {
//                        /*add the item to array */
//                        SubractedItemArray2.push(colName)
//                    }
//                    else if (TableDivId == TABLEID3) {
//                        /*add the item to array */
//                        SubractedItemArray3.push(colName)
//                    }
//                    else if (TableDivId == TABLEID4) {
//                        /*add the item to array */
//                        SubractedItemArray4.push(colName)
//                    }
//                    else if (TableDivId == TABLEID5) {
//                        /*add the item to array */
//                        SubractedItemArray5.push(colName)
//                    }
//                    else if (TableDivId == TABLEID6) {
//                        /*add the item to array */
//                        SubractedItemArray6.push(colName)
//                    }
//                }

//            }
//        }
//        thisRow++;
//    }
//    ImpactValue = AddValue - SubtractValue;
//    //alert(ImpactValue);
//    if (SubtractValue != 0) {
//        NetValue = ImpactValue / SubtractValue * 100;
//    }
//    else {
//        NetValue = 0
//    }


//    //alert(NetValue);

//    //Now to format these
//    var AddValueFormatted = '$' + Math.round(AddValue);
//    //alert(AddValueFormatted);
//    var SubtractValueFormatted = '$' + Math.round(SubtractValue);
//    //alert(SubtractValueFormatted);
//    var ImpactValueFormatted = '$' + Math.round(ImpactValue);
//    //alert(ImpactValueFormatted);
//    var NetValueFormatted = Math.round(NetValue) + '%';
//    //alert(NetValueFormatted);

//    var IndicatorArrow = '';
//    if (NetValue != 0) {
//        if (NetValue < 0) {
//            IndicatorArrow = '<img src="images/red_down.png">';
//        }
//        else {
//            IndicatorArrow = '<img src="images/green_up.png">';
//        }
//    }

//    // Now output them to the Divs
//    document.getElementById(AddValueTarget).innerHTML = AddValueFormatted;
//    document.getElementById(SubtractValueTarget).innerHTML = SubtractValueFormatted;
//    document.getElementById(ImpactValueTarget).innerHTML = ImpactValueFormatted;
//    document.getElementById(NetValueTarget).innerHTML = NetValueFormatted + IndicatorArrow;


//    /*  PopUpWithFadeIn(0, 200, 50, 400, 800, colNameAddArray, colNameSubArray, AddValueFormatted,
//     SubtractValueFormatted, ImpactValueFormatted, NetValueFormatted, IndicatorArrow);
//     */

//    /*Push the data to array each time something changes*/
//    SummaryScreen2(TableDivId, AddValue, SubtractValue, ImpactValue, NetValue, IndicatorArrow);

//    /*Prints the added and removed names to summary screen*/
//    AddRemovePrintFunc(AddedItemArray, SubractedItemArray, AddedItemArray2, SubractedItemArray2, AddedItemArray3, SubractedItemArray3, AddedItemArray4, SubractedItemArray4, AddedItemArray5, SubractedItemArray5, AddedItemArray6, SubractedItemArray6, tableTitle, TableDivId);
//}


//var title1 = null;
//var title2 = null;
//var title3 = null;
//var title4 = null;
//var title5 = null;
//var title6 = null;


//function AddRemovePrintFunc(AddedItemArray, SubractedItemArray, AddedItemArray2, SubractedItemArray2, AddedItemArray3, SubractedItemArray3, AddedItemArray4, SubractedItemArray4, AddedItemArray5, SubractedItemArray5, AddedItemArray6, SubractedItemArray6, tableTitle, TableDivId) {

//    document.getElementById('add').innerHTML = "";
//    document.getElementById('sub').innerHTML = "";


//    if (TableDivId == TABLEID1) {
//        title1 = tableTitle;
//    }
//    else if (TableDivId == TABLEID2) {
//        title2 = tableTitle;
//    }
//    else if (TableDivId == TABLEID3) {
//        title3 = tableTitle;
//    }
//    else if (TableDivId == TABLEID4) {
//        title4 = tableTitle;
//    }
//    else if (TableDivId == TABLEID5) {
//        title5 = tableTitle;
//    }
//    else if (TableDivId == TABLEID6) {
//        title6 = tableTitle;
//    }
//    else {
//        console.log("error with summary screen table title");
//    }


//    /*Outputs add array 1 and 2 and appends the list to add id on the summary screen page*/
//    /*ADDED*/
//    if (AddedItemArray.length > 0) {
//        /* $("#add").append('<ul>');*/
//        var str = '<p class="SummaryScreen_UL_Text">' + title1 + '</p>' + '<ul>';

//        for (a = 0; a < AddedItemArray.length; ++a) {
//            /*$("#add").append('<li>' + AddedItemArray[a] + '</li>');*/
//            str += '<li>' + AddedItemArray[a] + '</li>';
//        }
//        str += '</ul>';
//        $('#add').append(str);

//        str = "";
//    }

//    if (AddedItemArray2.length > 0) {

//        var str1 = '<p class="SummaryScreen_UL_Text">' + title2 + '</p>' + '<ul>';
//        for (b = 0; b < AddedItemArray2.length; ++b) {
//            /*$("#add").append('<li>' + AddedItemArray2[b] + '</li>');*/
//            str1 += '<li>' + AddedItemArray2[b] + '</li>';
//        }
//        str1 += '</ul>';
//        $('#add').append(str1);

//        str1 = "";
//    }

//    if (AddedItemArray3.length > 0) {

//        var str11 = '<p class="SummaryScreen_UL_Text">' + title3 + '</p>' + '<ul>';
//        for (c = 0; c < AddedItemArray3.length; ++c) {
//            /*$("#add").append('<li>' + AddedItemArray2[b] + '</li>');*/
//            str11 += '<li>' + AddedItemArray3[c] + '</li>';
//        }
//        str11 += '</ul>';
//        $('#add').append(str11);

//        str11 = "";
//    }

//    if (AddedItemArray4.length > 0) {

//        var str12 = '<p class="SummaryScreen_UL_Text">' + title4 + '</p>' + '<ul>';
//        for (d = 0; d < AddedItemArray4.length; ++d) {
//            str12 += '<li>' + AddedItemArray4[d] + '</li>';
//        }
//        str12 += '</ul>';
//        $('#add').append(str12);

//        str12 = "";
//    }

//    if (AddedItemArray5.length > 0) {

//        var str13 = '<p class="SummaryScreen_UL_Text">' + title5 + '</p>' + '<ul>';
//        for (d = 0; d < AddedItemArray5.length; ++d) {
//            str13 += '<li>' + AddedItemArray5[d] + '</li>';
//        }
//        str13 += '</ul>';
//        $('#add').append(str13);

//        str13 = "";
//    }

//    if (AddedItemArray6.length > 0) {

//        var str14 = '<p class="SummaryScreen_UL_Text">' + title6 + '</p>' + '<ul>';
//        for (d = 0; d < AddedItemArray6.length; ++d) {
//            str14 += '<li>' + AddedItemArray6[d] + '</li>';
//        }
//        str14 += '</ul>';
//        $('#add').append(str14);

//        str14 = "";
//    }
//    /*REMOVED*/
//    if (SubractedItemArray.length > 0) {
//        var str2 = '<p class="SummaryScreen_UL_Text">' + title1 + '</p>' + '<ul>';
//        for (h = 0; h < SubractedItemArray.length; ++h) {
//            /*$("#sub").append('<li>' + SubractedItemArray[h] + '</li>');*/
//            str2 += '<li>' + SubractedItemArray[h] + '</li>';
//        }
//        str2 += '</ul>';
//        $('#sub').append(str2);

//        str2 = "";
//    }

//    if (SubractedItemArray2.length > 0) {
//        var str3 = '<p class="SummaryScreen_UL_Text">' + title2 + '</p>' + '<ul>';
//        for (i = 0; i < SubractedItemArray2.length; ++i) {
//            /*$("#sub").append('<li>' + SubractedItemArray2[i] + '</li>');*/
//            str3 += '<li>' + SubractedItemArray2[i] + '</li>';
//        }
//        str3 += '</ul>';
//        $('#sub').append(str3);

//        str3 = "";
//    }
//    if (SubractedItemArray3.length > 0) {
//        var str4 = '<p class="SummaryScreen_UL_Text">' + title3 + '</p>' + '<ul>';
//        for (j = 0; j < SubractedItemArray3.length; ++j) {
//            /*$("#sub").append('<li>' + SubractedItemArray2[i] + '</li>');*/
//            str4 += '<li>' + SubractedItemArray3[j] + '</li>';
//        }
//        str4 += '</ul>';
//        $('#sub').append(str4);

//        str4 = "";
//    }

//    if (SubractedItemArray4.length > 0) {
//        var str5 = '<p class="SummaryScreen_UL_Text">' + title4 + '</p>' + '<ul>';
//        for (k = 0; k < SubractedItemArray4.length; ++k) {
//            /*$("#sub").append('<li>' + SubractedItemArray2[i] + '</li>');*/
//            str5 += '<li>' + SubractedItemArray4[k] + '</li>';
//        }
//        str5 += '</ul>';
//        $('#sub').append(str5);

//        str5 = "";
//    }

//    if (SubractedItemArray5.length > 0) {
//        var str6 = '<p class="SummaryScreen_UL_Text">' + title5 + '</p>' + '<ul>';
//        for (k = 0; k < SubractedItemArray5.length; ++k) {
//            /*$("#sub").append('<li>' + SubractedItemArray2[i] + '</li>');*/
//            str6 += '<li>' + SubractedItemArray5[k] + '</li>';
//        }
//        str6 += '</ul>';
//        $('#sub').append(str6);

//        str6 = "";
//    }

//    if (SubractedItemArray6.length > 0) {
//        var str7 = '<p class="SummaryScreen_UL_Text">' + title6 + '</p>' + '<ul>';
//        for (k = 0; k < SubractedItemArray6.length; ++k) {
//            /*$("#sub").append('<li>' + SubractedItemArray2[i] + '</li>');*/
//            str7 += '<li>' + SubractedItemArray6[k] + '</li>';
//        }
//        str7 += '</ul>';
//        $('#sub').append(str7);

//        str7 = "";
//    }
//}


////TODO:check statement to make sure the value is not null - DONE
////TODO:CSS format the div to look good - DONE
////TODO: Green arrow append to the end of the percent  - DONE
////TODO: Add a category to the table so it will be at the top. - DONE

//var table1Array = [];
//var table2Array = [];
//var table3Array = [];
//var table4Array = [];
//var table5Array = [];
//var table6Array = [];

///*Holds data for each time something is changed on any table*/
//function SummaryScreen2(TableDivId, AddValue, SubtractValue, ImpactValue, NetValue, IndicatorArrow) {

//    /********************************************
//     * Stores value from the rebuild function
//     * Reference: BigBetsRecalculateTable
//     ********************************************/
//    if (TableDivId == "tblMWCD_PC_Gum1") {

//        if (table1Array.length > 0) {
//            table1Array = [];
//        }
//        table1Array.push(TableDivId, AddValue, SubtractValue, ImpactValue, NetValue, IndicatorArrow);
//        // console.log(table1Array);
//    }
//    else if (TableDivId == "tblMWCD_PC_Confection1") {

//        if (table2Array.length > 0) {
//            table2Array = [];
//        }
//        table2Array.push(TableDivId, AddValue, SubtractValue, ImpactValue, NetValue, IndicatorArrow);
//        /*console.log(table1Array);*/
//    }
//    else if (TableDivId == "tblMWCD_PC_Mint1") {

//        if (table3Array.length > 0) {
//            table3Array = [];
//        }
//        table3Array.push(TableDivId, AddValue, SubtractValue, ImpactValue, NetValue, IndicatorArrow);
//        // console.log(table3Array);
//    }
//    else if (TableDivId == "tblMWCD_PC_Peg1") {

//        if (table4Array.length > 0) {
//            table4Array = [];
//        }
//        table4Array.push(TableDivId, AddValue, SubtractValue, ImpactValue, NetValue, IndicatorArrow);
//        //  console.log(table4Array);
//    }
//    else if (TableDivId == "tblMWCD_PC_All1") {

//        if (table5Array.length > 0) {
//            table5Array = [];
//        }
//        table5Array.push(TableDivId, AddValue, SubtractValue, ImpactValue, NetValue, IndicatorArrow);
//        //   console.log(table5Array);
//    }

//    else if (TableDivId == "tblMWCD_PCCombos_All1") {

//        if (table6Array.length > 0) {
//            table6Array = [];
//        }
//        table6Array.push(TableDivId, AddValue, SubtractValue, ImpactValue, NetValue, IndicatorArrow);
//        // console.log(table6Array);
//    }



//    /***********************************
//     * Logic to build the summary screen
//     ***********************************/

//    /*AddValue*/
//    if (table1Array[1] == null) {
//        table1Array[1] = 0;
//    }
//    if (table2Array[1] == null) {
//        table2Array[1] = 0;
//    }
//    if (table3Array[1] == null) {
//        table3Array[1] = 0;
//    }
//    if (table4Array[1] == null) {
//        table4Array[1] = 0;
//    }
//    if (table5Array[1] == null) {
//        table5Array[1] = 0;
//    }
//    if (table6Array[1] == null) {
//        table6Array[1] = 0;
//    }
//    //document.getElementById('kgbtblDEMO_PC_IC1_AddValue').innerHTML = "$" + (Math.round(table1Array[1]) + Math.round(table2Array[1]) + Math.round(table3Array[1]) + Math.round(table4Array[1]) + Math.round(table5Array[1]) + Math.round(table6Array[1])).toString();


//    /*SubtractValue*/
//    if (table1Array[2] == null) {
//        table1Array[2] = 0;
//    }
//    if (table2Array[2] == null) {
//        table2Array[2] = 0;
//    }
//    if (table3Array[2] == null) {
//        table3Array[2] = 0;
//    }
//    if (table4Array[2] == null) {
//        table4Array[2] = 0;
//    }
//    if (table5Array[2] == null) {
//        table5Array[2] = 0;
//    }
//    if (table5Array[2] == null) {
//        table5Array[2] = 0;
//    }
//    //document.getElementById('kgbtblDEMO_PC_IC1_SubtractValue').innerHTML = "$" + (Math.round(table1Array[2]) + Math.round(table2Array[2]) + Math.round(table3Array[2]) + Math.round(table4Array[2]) + Math.round(table5Array[1]) + Math.round(table6Array[1])).toString();


//    /*ImpactValue*/
//    if (table1Array[3] == null) {
//        table1Array[3] = 0;
//    }
//    if (table2Array[3] == null) {
//        table2Array[3] = 0;
//    }
//    if (table3Array[3] == null) {
//        table3Array[3] = 0;
//    }
//    if (table4Array[3] == null) {
//        table4Array[3] = 0;
//    }
//    if (table5Array[3] == null) {
//        table5Array[3] = 0;
//    }
//    if (table6Array[3] == null) {
//        table6Array[3] = 0;
//    }
//    //document.getElementById('kgbtblDEMO_PC_IC1_ImpactValue').innerHTML = "$" + (Math.round(table1Array[3]) + Math.round(table2Array[3]) + Math.round(table3Array[3]) + Math.round(table4Array[3]) + Math.round(table5Array[1]) + Math.round(table6Array[1])).toString();


//    /*NetValue*/
//    if (table1Array[4] == null) {
//        table1Array[4] = 0;
//    }
//    if (table2Array[4] == null) {
//        table2Array[4] = 0;
//    }
//    if (table3Array[4] == null) {
//        table3Array[4] = 0;
//    }
//    if (table4Array[4] == null) {
//        table4Array[4] = 0;
//    }
//    if (table5Array[4] == null) {
//        table5Array[4] = 0;
//    }
//    if (table6Array[4] == null) {
//        table6Array[4] = 0;
//    }
//    //document.getElementById('kgbtblDEMO_PC_IC1_NetValue').innerHTML = (Math.round(table1Array[4]) + Math.round(table2Array[4]) + Math.round(table3Array[4]) + Math.round(table4Array[4]) + Math.round(table5Array[1]) + Math.round(table6Array[1])).toString();


//    /*Green and Red Arrow HTML*/

//    //if (document.getElementById('kgbtblDEMO_PC_IC1_NetValue').innerHTML >= 0) {
//    //    document.getElementById('kgbtblDEMO_PC_IC1_NetValue').innerHTML += "%" + "<img src=\"images/green_up.png\">";
//    //}
//    //else {
//    //    document.getElementById('kgbtblDEMO_PC_IC1_NetValue').innerHTML += "%" + "<img src=\"images/red_down.png\">";
//    //}


//}


//function DynamicPitch_SetStringAndWrite(data_hash_table) {
//    //alert('start');
//    var Activities = data_hash_table['ARTS_Client_Activities'];
//    var ListString = '';

//    //CORE Counter
//    var coreFamilyOutOfStockCounter = 0;
//    var coreFamilyDistributionVoidsCounter = 0;

//    //FLEX Counter
//    var flexFamilyOutOfStockCounter = 0;
//    var flexFamilyDistributionVoidsCounter = 0;

//    //Peg
//    var pegFamilyOutOfStockCounter = 0;
//    var pegFamilyDistributionVoidsCounter = 0;

//    for (var x = 0; x < Activities.length; x++) {


//        for (var i in Activities[x].distribution_folder) { //Ok, now we are in each product.

//            //check if OS exist in the object
//            if (typeof Activities[x].distribution_folder[i]['OS'] != "undefined") {

//                //Core Family
//                if (Activities[x].distribution_folder[i]['PF'] == "10373") {

//                    if (Activities[x].distribution_folder[i]['OS'].pt == "Distribution Void (DV)") {
//                        coreFamilyDistributionVoidsCounter++;

//                        //Building the string that will be later converted into Object to be used as a datasouce by a table on the front end
//                        if (ListString == '' && (Activities[x].distribution_folder[i]['prompt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (ListString == '' && (Activities[x].distribution_folder[i]['pt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['prompt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['pt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }

//                    }
//                    else if (Activities[x].distribution_folder[i]['OS'].pt == "Out-Of-Stock (OOS)") {
//                        coreFamilyOutOfStockCounter++;

//                        //Building the string that will be later converted into Object to be used as a datasouce by a table on the front end
//                        if (ListString == '' && (Activities[x].distribution_folder[i]['prompt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (ListString == '' && (Activities[x].distribution_folder[i]['pt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['prompt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['pt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                    }

//                }

//                //Flex Family
//                if (Activities[x].distribution_folder[i]['PF'] == "10375") {

//                    if (Activities[x].distribution_folder[i]['OS'].pt == "Distribution Void (DV)") {
//                        flexFamilyDistributionVoidsCounter++;

//                        //Building the string that will be later converted into Object to be used as a datasouce by a table on the front end
//                        if (ListString == '' && (Activities[x].distribution_folder[i]['prompt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (ListString == '' && (Activities[x].distribution_folder[i]['pt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['prompt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['pt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                    }
//                    else if (Activities[x].distribution_folder[i]['OS'].pt == "Out-Of-Stock (OOS)") {
//                        flexFamilyOutOfStockCounter++;

//                        //Building the string that will be later converted into Object to be used as a datasouce by a table on the front end
//                        if (ListString == '' && (Activities[x].distribution_folder[i]['prompt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (ListString == '' && (Activities[x].distribution_folder[i]['pt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['prompt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['pt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                    }


//                }

//                //Peg Family
//                if (Activities[x].distribution_folder[i]['PF'] == "5441") {

//                    if (Activities[x].distribution_folder[i]['OS'].pt == "Distribution Void (DV)") {
//                        pegFamilyDistributionVoidsCounter++;

//                        //Building the string that will be later converted into Object to be used as a datasouce by a table on the front end
//                        if (ListString == '' && (Activities[x].distribution_folder[i]['prompt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (ListString == '' && (Activities[x].distribution_folder[i]['pt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['prompt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['pt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                    }
//                    else if (Activities[x].distribution_folder[i]['OS'].pt == "Out-Of-Stock (OOS)") {
//                        pegFamilyOutOfStockCounter++;

//                        //Building the string that will be later converted into Object to be used as a datasouce by a table on the front end
//                        if (ListString == '' && (Activities[x].distribution_folder[i]['prompt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (ListString == '' && (Activities[x].distribution_folder[i]['pt'])) {
//                            ListString += '{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['prompt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['prompt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                        else if (Activities[x].distribution_folder[i]['pt']) {
//                            ListString += ',{"UPC":"' + Activities[x].distribution_folder[i]['codes'].substring(1, 13) + '","Product":"' + Activities[x].distribution_folder[i]['pt'] + '","Family":"' + Activities[x].distribution_folder[i]['PF'] + '","Status":"' + Activities[x].distribution_folder[i]['OS'].pt + '"}';
//                        }
//                    }

//                }
//            }


//        }//end Distribution Folder
//    }//end Activities


//    //Massage data quick and easy since client wants PF from Json displayed as EX 10373 -> Core 40
//    ListString = ListString.replace(/10373/g, 'Core 40');
//    ListString = ListString.replace(/10375/g, 'Flex 35');
//    ListString = ListString.replace(/5441/g, 'Peg');

//    ListString = ListString.replace(/Distribution Void \(DV\)/g, "DV")
//    ListString = ListString.replace(/Out-Of-Stock \(OOS\)/g, 'OOS');


//    if (ListString == '') {
//        ListString = 'No Distribution items able to be listed.';
//    }
//    else {
//        ListString = '{WSF_SugOrd_All1:[' + ListString + ']}';
//        var OOSobj = eval("(" + ListString + ')');
//    }


//    //sort
//    OOSobj.WSF_SugOrd_All1.sort(function (a, b) {
//        // return (a.Product) - (b.Product);
//        return (a.Product > b.Product) - (a.Product < b.Product)
//    });


//    //Populate the summary overview on the page with couter values
//    //Core
//    document.getElementById('coreFamilyOutOfStockCounterContent').innerHTML = coreFamilyOutOfStockCounter;
//    document.getElementById('coreFamilyDistributionVoidsCounterContent').innerHTML = coreFamilyDistributionVoidsCounter;
//    //Flex
//    document.getElementById('flexFamilyOutOfStockCounterContent').innerHTML = flexFamilyOutOfStockCounter;
//    document.getElementById('flexFamilyDistributionVoidsCounterContent').innerHTML = flexFamilyDistributionVoidsCounter;
//    //Peg
//    document.getElementById('pegFamilyOutOfStockCounterContent').innerHTML = pegFamilyOutOfStockCounter;
//    document.getElementById('pegFamilyDistributionVoidsCounterConent').innerHTML = pegFamilyDistributionVoidsCounter;


//    //merge dynamic object
//    $.extend(true, data_hash_table, OOSobj);

//    return data_hash_table;

////}

function MoveToButtonTabSlide(theButton, theTab, theSlide, pageIndex) {
    $.each($('div#left').children(), function (index, target_button) {
        if (theButton == target_button.innerHTML.substring(0, theButton.length)) {  //get the button with the name passed.
            //alert(target_button.innerHTML);
            //alert('Start!!');
            $(target_button).parent().children().removeClass('selected'); //unselect all buttons
            $(target_button).addClass('selected'); //select this button
            //alert('colors!!');
            var button_data = $(target_button).data('button') // load button data
            if (button_data.tabs == null || button_data.tabs.length == 0) { // there are no tabs in the button? impossible.
                //alert('REturn!!');
                return;
            } else {
                $('div#maintop').empty(); //empty the tab screen at the top
                $.each(button_data.tabs, function (index, tab_name) { //now write out each tab
                    var tab = page_settings.tabs[tab_name];
                    if (tab != null) {
                        $('div#maintop').append($('<div>').text(tab.tab_title).data('tab', tab)); // this is each tab
                    }
                });
                $('div#maintop').find('div').click(function () { // this find goes through each tab and build a function that displays itself (except the one you are on)
                    var $tab = $(this);
                    //if ($tab.hasClass('selected')) return;
                    if ($tab.hasClass('selected')) return;
                    showSpinner(function () {
                        $('#pageholder > div').hide();
                        var tab_data = $tab.data('tab');
                        $tab.parent().children().removeClass('selected');
                        $tab.addClass('selected');
                        if (tab_data.pages == null || tab_data.pages.length == 0) {
                            $('div#pageholder > div.current').removeClass('current');
                            return;
                        }
                        var page_name = tab_data.pages[0];
                        $.each(tab_data.pages, function (index, page) {
                            $('#' + page).show();
                        });
                        build_indicator(tab_data.pages);
                        $.transit.enabled = false;
                        core.gotoPage($('#' + page_name), true);
                        $.transit.enabled = true;
                    });
                });
                $.each($('div#maintop').children(), function (index, target_tab) {
                    var $tab = $(this);
                    var tab_data = $tab.data('tab');
                    if (theTab == tab_data.tab_title) { //this is the one I want
                        //alert('go! '+tab_data.tab_title);
                        //alert($('#pageholder > div').attr('id'));
                        $('#pageholder > div').hide();
                        $tab.parent().children().removeClass('selected');
                        $tab.addClass('selected');
                        if (tab_data.pages == null || tab_data.pages.length == 0) {
                            $('div#pageholder > div.current').removeClass('current');
                            return;
                        }
                        var page_name = tab_data.pages[1];
                        $.each(tab_data.pages, function (index, page) {
                            $('#' + page).show();
                            //alert(page);
                        });
                        build_indicator(tab_data.pages);
                        $.transit.enabled = false;
                        core.gotoSpecificPage($('#' + theSlide), tab_data.pages, pageIndex);
                        $.transit.enabled = true;

                    }
                    //alert(target_tab);
                });
            }
            ;
        }
        ;
    });
    //alert('done');
};

function PopUpWithFadeIn(image, MarginLeft, MarginTop, DivHeight, DivWidth) {
    if (image == null) { image = '<p>No image found</p>' } 		//in case there is no image source code entered in the index.html

    // Creates the div
    var msg = "<div id='pop' class='parentDisable' style='display: block;'>" +
				  "<div id='popup' style='margin-left:" + MarginLeft + "px; margin-top:" + MarginTop + "px; height: " + DivHeight + "px; width: " + DivWidth + "px; display: none;'>" +
					  "<a href='#' id='close' class='end'>" +
						  "<img src='images/close.png'>" +
					  "</a>" +
					  image +
				  "</div>" +
			  "</div>" + "";

    var elNote = document.createElement('div');         // Creates a new element
    elNote.setAttribute('id', 'newDiv');                // Adds an id of newDiv
    elNote.innerHTML = msg;                             // Adds the message
    document.body.appendChild(elNote);				    // Adds it to the page

    var div = document.getElementById('pop');			//Creates variable div for calling 'pop' for the newly created div (above)
    var step = 0; steps = 10; speed = 60; fade = 0.0; color = 0.7; //variables for adjusting amount of steps and the darkness/transparency level of the background

    //alert('FadeInPOP(step = '+step+',steps='+steps+',speed='+speed+',fade='+fade+',color = '+color+',div='+div);

    FadeInPOP(div, step, steps, speed, fade, color);  //function call

    function FadeInPOP(div, step, steps, speed, fade, color) { //begin function
        fade += color / steps; 							 //fade will adjust by dividing color with steps
        div.style.background = 'rgba(0,0,0,' + fade + ')';//adjusts the 'style' for the fade in
        //alert(steps);
        if (step < steps) { //evaluates the steps
            step += 1;
            setTimeout(function () { FadeInPOP(div, step, steps, speed, fade, color) }, 1000 / speed);
        }  //Timer to slow down or speed up via speed variable
        else {   //execute last in order to make the div with image appear
            document.getElementById('popup').style.display = 'block';
        }  //makes the div with image appear
    }

    function dismissNote() {                          	  // Declare function
        document.body.removeChild(elNote);              // Remove the note
    }

    var elClose = document.getElementById('close');   		   // Get the close button
    elClose.addEventListener('click', dismissNote, false); // Click close-clear note
}


function displayPitchData() {

    //var myH3 = document.createElement('h3');
    //console.log($(myH3));

    /*
        for (var prop in pitch_data) {
            //console.log(prop)
            var myH3 = document.createElement('h3');
            $(myH3)[0].innerHTML = prop;
    
            var myDiv = document.createElement('div');
    
    
    
            $(myDiv)[0].innerHTML = pitch_data[prop];
            document.getElementById('scrollable').appendChild(myH3);
            document.getElementById('scrollable').appendChild(myDiv);
    
        }
    */
    //ARTS_Client_Surveys   

    // var myDiv = document.createElement('div');
    // var data = pitch_data['ARTS_Client_ImageFiles'];
    //             var htmlText = '';
    //             htmlText += '<pre>';
    //              htmlText += JSON.stringify(data, null, 2);
    //             htmlText += '</pre>';
    //$(myDiv)[0].innerHTML = htmlText;
    //document.getElementById('scrollable').appendChild(myDiv);

    var myDiv = document.createElement('div');
    var data = pitch_data['ARTS_Client_Distributors'].id;

    console.log(data);

    var htmlText = '';
    htmlText += '<pre>';
    htmlText += JSON.stringify(data, null, 2);
    htmlText += '</pre>';
    $(myDiv)[0].innerHTML = htmlText;
    document.getElementById('scrollable').appendChild(myDiv);

    var myDiv = document.createElement('div');
    var data = pitch_data['NewMWCD_DistributorCodes_All1'];

    console.log(data);

    var htmlText = '';
    htmlText += '<pre>';
    htmlText += JSON.stringify(data, null, 2);
    htmlText += '</pre>';
    $(myDiv)[0].innerHTML = htmlText;
    document.getElementById('scrollable').appendChild(myDiv);



}