(function (context) {
    'use strict';

    var PitchBookRenderService = {

    };

    function _getAllEditableElements() {
        var elements = document.querySelectorAll('[asm-editable="true"]');
        return elements;
    }

    /**
     * Checks to make sure an editable element has all required properties.  If it failed an object is returned containing
     * the list of validation errors.  If it succeeds, true is returned
     * @param el
     */
    function _validateEdiableElement(el) {

        var valid = true;

        if (el.id) {

        } else {
            valid = false;
            ASM.DebugService.logError( 'An id is required for all ediable fields.  An element of type (' + el.nodeName + ') is missing a id attribute.', 'missingId', 'domError', el);

        }

        return valid;
    }


    /**
     * Apply all properties in the specified data to the element as attributes
     * @param el
     * @param dataToApply
     * @private
     */
    function _applyDataToElement(el, dataToApply) {
        var directApplyProperties = {
            'innerText': true,
            'width': true,
            'height': true
        };


        for (var propertyName in dataToApply) {
            if (directApplyProperties[propertyName]) {
                el[propertyName] = dataToApply[propertyName];
            } else if (propertyName === 'innerHTML') {
                // TODO: Sanitize the data before applying it to innerHTML
                el[propertyName] = dataToApply[propertyName];
            } else {
                el.setAttribute(propertyName, dataToApply[propertyName]);
            }

        }
    }


    /**
     * Find the name of the element in our combined database and replace any properties with the ones found in it
     * @param el The element to apply attributes to
     * @param db The JSON database that contains the element with the specified name
     */
    function _processEditableElement(el, db, renderMode) {

        var elementType = el.nodeName.toLowerCase();
        var elementWidth;
        var elementHeight;

        if (elementType === "img"){
            elementHeight = el.height;
            elementWidth = el.width;
        }

        var dataToApply;

        if (db && db[el.id]) {
            dataToApply = db[el.id];
            _applyDataToElement(el, dataToApply);
        }

        if(renderMode === "edit"){

        switch (elementType) {
            case 'span':
                _processsEditableText(el);
                break;
            case 'div':
                break;
            case 'img':
                _processsImageElement(el, elementWidth, elementHeight);
                break;
            default:
                ASM.DebugService.logError('Unsupported element type found ' + elementType, 'missingName', 'domError', el);
                break;
        }

    }

        // After the item is processed add the rendered class.  This keeps the item invisible until we are done rendering it
        el.classList.add('rendered');
    }

    /**
     * Reach out to all datasources and build a database that will combine all sources into a single JSON object
     * @private
     */
    function _buildDatabase() {
        // TODO: Gather data from all the applicable sources
        return ASM.db;
    }

    function _processsEditableText(el){

        var maxLength = el.getAttribute("asm-maxlength");

        function saveTextChangesToPitch(el){
            var attributeList = {};
            attributeList['elementId'] = el.id;
            attributeList['innerText'] = el.innerText;
            attributeList['style'] = el.style.cssText;;
            window.parent.postMessage({"mode":"textedit", "attributes":attributeList}, '*');
        }

        el.onkeydown = function(){
            toolbar.style.left = ((el.offsetWidth - 196)/2) + "px";
        }

        el.onkeyup = function(){
            toolbar.style.left = ((el.offsetWidth - 196)/2) + "px";
        }

        el.addEventListener("paste", function(e) {

            e.preventDefault();
            var text = e.clipboardData.getData("text/plain");
            if((el.innerText.length + text.length) >= maxLength){
                window.parent.postMessage({"mode":"error", "message":"maximum characters allowed are : "+ maxLength}, '*');
            }else{
                document.execCommand("insertHTML", false, text);
            };
            
        });

        el.onkeypress = function(e){

            if (e.target.innerText.length >= maxLength) {
                window.parent.postMessage({"mode":"error", "message":"maximum characters allowed are : "+ maxLength}, '*');
                e.preventDefault();
                return false;
            }else{
                saveTextChangesToPitch(el);
            }
        }

        let toolbar = document.createElement('span');
        toolbar.setAttribute("class","toolbar");
        el.appendChild(toolbar);

        toolbar.contentEditable = false;

        let textIcon = document.createElement('div');
        textIcon.setAttribute("class","text-icon");
        toolbar.appendChild(textIcon);

        let pencilBtn = document.createElement('div');
        pencilBtn.setAttribute("class","img-edit-btn");
        toolbar.appendChild(pencilBtn);

        let boldBtn = document.createElement('div');
        boldBtn.setAttribute("class","bold-text-btn");
        toolbar.appendChild(boldBtn);

        let italicBtn = document.createElement('div');
        italicBtn.setAttribute("class","italic-text-btn");
        toolbar.appendChild(italicBtn);

        let leftAlignBtn = document.createElement('div');
        leftAlignBtn.setAttribute("class","lefta-text-btn");
        toolbar.appendChild(leftAlignBtn);

        let centerAlignBtn = document.createElement('div');
        centerAlignBtn.setAttribute("class","centera-text-btn");
        toolbar.appendChild(centerAlignBtn);

        let rightAlignBtn = document.createElement('div');
        rightAlignBtn.setAttribute("class","righta-text-btn");
        toolbar.appendChild(rightAlignBtn);

        el.onmouseover = function(){
            toolbar.style.left = ((el.offsetWidth - 196)/2) + "px";
            toolbar.classList.remove("hide-controls");
            toolbar.classList.add("show-controls");
            el.classList.add("asm-text-highlighter");
        }

        el.onmouseout = function(){
            toolbar.style.left = ((el.offsetWidth - 196)/2) + "px";
            toolbar.classList.remove("show-controls");
            toolbar.classList.add("hide-controls");
            el.classList.remove("asm-text-highlighter");
            el.classList.remove("asm-text-editable");
        }

        pencilBtn.addEventListener('click', function(){
            el.contentEditable = true;
            el.classList.add("asm-text-editable");
            el.focus();
        });

        boldBtn.addEventListener('click', function(){
            addStyleToText(el, "font-weight: bold;");
        });

        italicBtn.addEventListener('click', function(e){
            addStyleToText(el, "font-style: italic;");
        });

        leftAlignBtn.addEventListener('click', function(e){
            alignText(el, "text-align: left;");
        });

        rightAlignBtn.addEventListener('click', function(e){
            alignText(el, "text-align: right;");
        });

        centerAlignBtn.addEventListener('click', function(e){
            alignText(el, "text-align: center;");
        });

        function addStyleToText(el, string){
            var  strStyle = el.style['cssText'];
            if(strStyle.includes(string)){
                el.style.cssText = strStyle.replace(string, '');
            }else{
                el.style.cssText += string;
            }

            saveTextChangesToPitch(el);
        }

        function alignText(el, string){
            var  strStyle = el.style['cssText'];

            if(strStyle.includes("text-align: center;")){
                el.style.cssText = strStyle.replace("text-align: center;", string);
            }else if (strStyle.includes("text-align: left;")){
                el.style.cssText = strStyle.replace("text-align: left;", string);
            }else if (strStyle.includes("text-align: right;")){
                el.style.cssText = strStyle.replace("text-align: right;", string);
            }else{
                el.style.cssText += string;
            }

            saveTextChangesToPitch(el);
        }

    }

    function _processsImageElement(el, elementWidth, elementHeight){

        //el.onmouseover = function(){

        if(el.parentNode.id != 'asm-container'){ 

            let wrapper = document.createElement('div');
            let resizer = document.createElement('div');
            el.parentNode.insertBefore(wrapper, el);
            wrapper.appendChild(el);
            wrapper.appendChild(resizer);
            resizer.setAttribute("class","resizer");
    
            wrapper.setAttribute("id","asm-container");
            wrapper.setAttribute("position", "relative");
            wrapper.setAttribute("box-sizing", "border-box");        
        
            let imgIcon = document.createElement('div');
            imgIcon.setAttribute("class","img-icon");
            resizer.appendChild(imgIcon);

            let btnEdit = document.createElement('span');
            resizer.appendChild(btnEdit);
            btnEdit.setAttribute("class","img-edit-btn");

            let btnResize = document.createElement('span');
            resizer.appendChild(btnResize);
            btnResize.setAttribute("class","img-resize-btn");

            resizer.classList.add("hide-controls");


        //wrapper.setAttribute("box-sizing", "border-box");

                var attrs = Array.prototype.slice.call(el.attributes);
                var attributesList = {};
    
                for(var i = attrs.length - 1; i >= 0; i--) {
                    attributesList[attrs[i].name] = attrs[i].value;
                }
                
                var numHeight = elementHeight + "px";

                wrapper.style.height = numHeight;

               // el.setAttribute("class", "asmimage");

                /*el.onload = function(){
                    var elementComputedHeight = (elementWidth/(el.naturalWidth/el.naturalHeight));
                    wrapper.style.paddingTop = (elementHeight - elementComputedHeight)/2+"px";
                };*/


                btnEdit.addEventListener('click', function(){
                    attributesList['absolutePath'] = el.src;
                    attributesList['naturalWidth'] = elementWidth;
                    attributesList['naturalHeight'] = elementHeight;
                    window.parent.postMessage({"mode":"edit", "attributes":attributesList}, '*');
                });

                btnResize.addEventListener('click', function(){
                    attributesList['absolutePath'] = el.src;
                    attributesList['naturalWidth'] = el.naturalWidth;
                    attributesList['naturalHeight'] = el.naturalHeight;
                    window.parent.postMessage({"mode":"resize", "attributes":attributesList}, '*');
                });

                wrapper.onmouseover = function(){
                    resizer.classList.remove("hide-controls");
                    resizer.classList.add("show-controls");
                    resizer.classList.add("resizer");
                    wrapper.classList.add("asm-img-highlighter");
                }

                wrapper.onmouseout = function(){
                    resizer.classList.remove("show-controls");
                    resizer.classList.add("hide-controls");
                    resizer.classList.add("resizer");
                    resizer.setAttribute("class","hide-controls");
                    wrapper.classList.remove("asm-img-highlighter");
                }
        
        }

    //}

    }


    /**
     * Get all the editable elements, validate them, then process any editable attributes
     */
    PitchBookRenderService.render = function render(renderMode) {

        var db = _buildDatabase();

        var editableElements = _getAllEditableElements();
        //console.log('lengtH: ' + editableElements.length);
        for (var i = 0; i < editableElements.length; i++) {
            var el = editableElements[i];
            var isValid = _validateEdiableElement(el);
            if (isValid) {
                _processEditableElement(el, db, renderMode);
            }
        }
    };

    context.PitchBookRenderService = PitchBookRenderService;
})(ASM);


