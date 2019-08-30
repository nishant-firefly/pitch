window.addEventListener('error', function (e) {
    //console.log(e);
    var message = e.target.src;
    var myContents = new Object();

    if (message) {
        
        var client = new XMLHttpRequest();
        client.open("GET", message, true);
        client.send();
        client.onreadystatechange = function () {
            if (this.readyState == this.HEADERS_RECEIVED) {              
                myContents.responseURL = this.responseURL;
                myContents.status = this.status;
                myContents.statusText = this.statusText;
                appendErrorToLog(myContents);
            }
        }
    }

    if (e.error) {
        myContents.responseURL = e.filename;
        myContents.status = e.lineno;
        myContents.statusText = e.message;

        appendErrorToLog(myContents);
    }
   

}, true);


function appendErrorToLog(obj) {
  
    var tempLte = $('.logTemplate1').clone();
    tempLte = tempLte[0].childNodes[1].childNodes;

    tempLte[3].innerHTML = obj.responseURL;
    tempLte[9].innerHTML = obj.status;
    tempLte[15].innerHTML = obj.statusText;

    $('#errorLog').append(tempLte);
}

function appendErrorToLog2(obj) {

    var tempLte = $('.logTemplate2').clone();
    tempLte = tempLte[0].childNodes[1].childNodes;

    console.log(tempLte);

 
    tempLte[3].innerHTML = obj.statusText;

    $('#errorLog').append(tempLte);
}





//window.onerror = function (msg, url, lineNo, columnNo, error) {
//    console.log("hell yeah", msg)

//    var string = msg.toLowerCase();
//    var substring = "script error";
//    if (string.indexOf(substring) > -1) {
//        alert('Script Error: See Browser Console for Detail');
//    } else {
//        var message = [
//            'Message: ' + msg,
//            'URL: ' + url,
//            'Line: ' + lineNo,
//            'Column: ' + columnNo,
//            'Error object: ' + JSON.stringify(error)
//        ].join(' - ');

//        alert(message);
//    }

//    return false;
//};