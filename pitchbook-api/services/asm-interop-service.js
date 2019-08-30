(function (context) {
    'use strict';

    var _updatedElementAttributes = {};
    var InteropService = {};


    var _isObjectEmpty = function(obj) {

        for(var prop in obj) {

          if(obj.hasOwnProperty(prop)) {
            return false;
          }
        }

        return JSON.stringify(obj) === JSON.stringify({});
      }


    var _validateAttributes = function(objArray){
        //todo 
    }


    var _validateImageURL = function(url) {
        return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }


    InteropService.updateElementAttributes = function(elementName, eleAttributeList ){

        if((ASM.db).hasOwnProperty(elementName)){

            //check if attribute values are updated

            let initAttributeValues = JSON.stringify(Object.entries(eleAttributeList).sort());
            let updatedAttributeValues = JSON.stringify(Object.entries((ASM.db)[elementName]).sort());
            if(  initAttributeValues === updatedAttributeValues ){
                return;
            }

        }else{
            
            //new editable element's attributes are updated
            
            if(_isObjectEmpty(eleAttributeList)){
                return;
            }
        }
        

        _updatedElementAttributes[elementName] = eleAttributeList;
        window.parent.postMessage(_updatedElementAttributes, '*');
    }

    window.addEventListener('DOMContentLoaded', function (event) {
        //ASM.PitchBookRenderService.render();
    });

    window.addEventListener('message', function(event) {
        var renderMode = event.data["mode"];
        //console.log(`Received ${event.data} from ${event.origin}`);
        ASM.db = event.data['data']; //tobe removed later
        ASM.PitchBookRenderService.render(renderMode);
     });

    context.InteropService = InteropService;

})(ASM);
