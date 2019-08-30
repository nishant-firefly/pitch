(function () {//SBhindi enabled PDF creation on device
    var asmpdfhelper =
	{
	    pitch_pdf: function (HTMLform) {
	        //Show spinner while PDF creation in progress
	        var can = document.getElementsByTagName("canvas");
	        var form = HTMLform,
			cache_width = form.width();
	        window.html2canvas(form, {
	            onrendered: function (canvas) {
	                var img = canvas.toDataURL("image/png");
	                var PDFContent = '<HTML><body><img src=' + img + '></body></HTML>';
	                showSpinner(function () { ASMPDFHelper.make_pdf(PDFContent); hideSpinner(); });
	            }
	        });
	    },

	    make_pdf: function (cg_list) {

            //custom code
	        var date = new Date();
	        var filename = null;

	        if ($('.PDFMenuTitle').text() != null || $('.PDFMenuTitle').text() != "") {

	            //remove spaces in the name, get todays date format 12.12.2016
	            filename = $('.PDFMenuTitle').text().replace(/ /g, "") + (date.getMonth() + 1) + "." + date.getDate() + "." + date.getFullYear() + '_' + 'Store' + '_' + pitch_data.STORENUMBER + '.pdf';
	            console.log(filename);
	        }
	        else {
                //defualt file name if no title is given
	            filename = date.getTime() + '.pdf';
	        }


	        cg_list = cg_list.replace(/<thead>/g, '<tbody>');
	        cg_list = cg_list.replace(/<\/thead>/g, '</tbody>');
	        content = [];
	        ASMPDFHelper.ParseHtml(content, cg_list);
	        var pdf_result = pdfMake.createPdf({
	            content: content,
	            pageOrientation: ASMPDFHelper.checkOriantation(),
	            pageSize: 'A4'
	        });
	        if ('ontouchstart' in document.documentElement) {
	            pdf_result.getBase64(function (data) {
	                var file_path = filename;
	                FileSystem.root.getFile(file_path, { create: true, exclusive: false }, function (file_entry) {
	                    var url = file_entry.toURL ? file_entry.toURL() : file_entry.toURI();
	                    FileSystem.write_binary(file_entry, ASMPDFHelper.convert_data_to_array_buffer(data), function () { ASMPDFHelper.crm_open_file(url); }, function () { alert('error while writing binary data.'); }, false, false);
	                });

	            });
	        }
	        else {
	            pdf_result.getDataUrl(function (results) {
	                window.open(results);
	            });
	        }
	    },

	    convert_data_to_array_buffer: function (encodedData) {
	        //e.g. encodedData= 'JVBERi0xLjMKMyAwIG
	        var data = window.atob(encodedData),
                length = data.length,
                arrayBuffer = new window.ArrayBuffer(length),
                intArray = new window.Uint8Array(arrayBuffer),
                i;

	        for (i = 0; i < length; i++) {
	            intArray[i] = data.charCodeAt(i);
	        }
	        return arrayBuffer;
	    },

	    ParseContainer: function (cnt, e, p, styles) {
	        var elements = [];
	        var children = e.childNodes;
	        if (children.length != 0) {
	            for (var i = 0; i < children.length; i++) p = ASMPDFHelper.ParseElement(elements, children[i], p, styles);
	        }
	        if (elements.length != 0) {
	            for (var i = 0; i < elements.length; i++) cnt.push(elements[i]);
	        }
	        return p;
	    },

	    crm_open_file: function (path) {
	        SFTouch.openExternalURL(path.toString(), function () { }, function () { alert('error'); });
	    },

	    ComputeStyle: function (o, styles) {
	        for (var i = 0; i < styles.length; i++) {
	            var st = styles[i].trim().toLowerCase().split(":");
	            if (st.length > 0) {
	                switch (st[0]) {
	                    case "font-size": {
	                        o.fontSize = parseInt(st[1]);
	                        break;
	                    }
	                    case "text-align": {
	                        switch (st[1]) {
	                            case "right": o.alignment = 'right'; break;
	                            case "center": o.alignment = 'center'; break;
	                        }
	                        break;
	                    }
	                    case "font-weight": {
	                        switch (st[1]) {
	                            case "bold": o.bold = true; break;
	                        }
	                        break;
	                    }
	                    case "text-decoration": {
	                        switch (st[1]) {
	                            case "underline": o.decoration = "underline"; break;
	                        }
	                        break;
	                    }
	                    case "tableheader": {
	                        o.bold = true;
	                        o.fontSize = 13;
	                        o.color = 'black';
	                        break;
	                    }
	                    case "font-style": {
	                        switch (st[1]) {
	                            case "italic": o.italics = true; break;
	                        }
	                        break;
	                    }
	                    case "header": {
	                        switch (st[1]) {
	                            case "h1": {
	                                o.margin = [0, 20, 0, 0];
	                                o.fontSize = 32;
	                                o.bold = true;
	                                break;
	                            }
	                            case "h2": {
	                                o.margin = [0, 5, 0, 0];
	                                o.fontSize = 24;
	                                o.bold = true;
	                                break;
	                            }
	                            case "h3": {
	                                o.margin = [0, 5, 0, 0];
	                                o.fontSize = 19;
	                                o.bold = true;
	                                break;
	                            }
	                            case "h4": {
	                                o.margin = [0, 5, 0, 0];
	                                o.fontSize = 15;
	                                o.bold = true;
	                                break;
	                            }
	                            case "h5": {
	                                o.margin = [0, 5, 0, 0];
	                                o.fontSize = 13;
	                                o.bold = true;
	                                break;
	                            }
	                            case "h6": {
	                                o.margin = [0, 5, 0, 0];
	                                o.fontSize = 11;
	                                o.bold = true;
	                                break;
	                            }
	                        }
	                        break;
	                    }
	                }
	            }
	        }
	    },

	    ParseElement: function (cnt, e, p, styles) {
	        if (!styles) styles = [];
	        if (e.getAttribute) {
	            var nodeStyle = e.getAttribute("style");
	            if (nodeStyle) {
	                var ns = nodeStyle.split(";");
	                for (var k = 0; k < ns.length; k++) styles.push(ns[k]);
	            }
	        }

	        switch (e.nodeName.toLowerCase()) {
	            case "#text": {
	                var t = { text: e.textContent.replace(/\n/g, "") };
	                if (styles) ASMPDFHelper.ComputeStyle(t, styles);
	                p.text.push(t);
	                break;
	            }
	            case "b": case "strong": {
	                //styles.push("font-weight:bold");
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles.concat(["font-weight:bold"]));
	                break;
	            }
	            case "u": {
	                //styles.push("text-decoration:underline");
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles.concat(["text-decoration:underline"]));
	                break;
	            }
	            case "i": {
	                //styles.push("font-style:italic");
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles.concat(["font-style:italic"]));
	                //styles.pop();
	                break;
	                //cnt.push({ text: e.innerText, bold: false });
	            }
	            case "span": {
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles);
	                break;
	            }
	            case "br": {
	                p = ASMPDFHelper.CreateParagraph();
	                cnt.push(p);
	                break;
	            }
	            case "table":
	                {
	                    var t = {
	                        table: {
	                            widths: [],
	                            body: []
	                        }
	                    }
	                    var border = e.getAttribute("border");
	                    var isBorder = false;
	                    if (border) if (parseInt(border) == 1) isBorder = true;
	                    if (!isBorder) t.layout = 'noBorders';
	                    ASMPDFHelper.ParseContainer(t.table.body, e, p, styles);

	                    var widths = e.getAttribute("widths");
	                    if (!widths) {
	                        if (t.table.body.length != 0) {
	                            if (t.table.body[0].length != 0)
	                                for (var k = 0; k < t.table.body[0].length; k++) {
	                                    var body = t.table.body[0];
	                                    t.table.widths.push(body[k].width);
	                                }
	                        }
	                    } else {
	                        var w = widths.split(",");
	                        for (var k = 0; k < w.length; k++) t.table.widths.push(w[k]);
	                    }
	                    cnt.push(t);
	                    break;
	                }
	            case "tbody": {
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles);
	                //p = CreateParagraph();
	                break;
	            }
	            case "tr": {
	                var row = [];
	                ASMPDFHelper.ParseContainer(row, e, p, styles);
	                cnt.push(row);
	                break;
	            }
	                //SBhindi added th tag
	            case "th": {
	                p = ASMPDFHelper.CreateParagraph();
	                var st = { stack: [] }
	                st.stack.push(p);

	                var rspan = e.getAttribute("rowspan");
	                if (rspan) st.rowSpan = parseInt(rspan);
	                var cspan = e.getAttribute("colspan");
	                if (cspan) st.colSpan = parseInt(cspan);
	                if (has_value(e.width)) st.width = e.width;
	                ASMPDFHelper.ParseContainer(st.stack, e, p, styles.concat(["tableHeader"]));
	                cnt.push(st);
	                break;
	            }
	            case "td": {
	                p = ASMPDFHelper.CreateParagraph();
	                var st = { stack: [] }
	                st.stack.push(p);

	                var rspan = e.getAttribute("rowspan");
	                if (rspan) st.rowSpan = parseInt(rspan);
	                var cspan = e.getAttribute("colspan");
	                if (cspan) st.colSpan = parseInt(cspan);
	                if (has_value(e.width)) st.width = e.width;
	                ASMPDFHelper.ParseContainer(st.stack, e, p, styles);
	                cnt.push(st);
	                break;
	            }
	            case "div": case "p": {
	                p = ASMPDFHelper.CreateParagraph();
	                var st = { stack: [] }
	                st.stack.push(p);
	                ASMPDFHelper.ComputeStyle(st, styles);
	                ASMPDFHelper.ParseContainer(st.stack, e, p);

	                cnt.push(st);
	                break;
	            }
	                //SBhindi added list and lable
	            case "ul": {
	                var UL = [];
	                ASMPDFHelper.ParseContainer(UL, e, p, styles);
	                cnt.push(UL);
	                break;
	            }
	            case "label": case "li": {
	                p = ASMPDFHelper.CreateParagraph();
	                var st = { stack: [] }
	                st.stack.push(p);
	                ASMPDFHelper.ParseContainer(st.stack, e, p);
	                cnt.push(st);
	                break;
	            }
	                //SBhindi added img tag
	            case "img": {
	                0
	                //if (has_value(e.src))
	                if (e.src.length > 0) {
	                    var oriantation = ASMPDFHelper.checkOriantation();
	                    var pic;
	                    if (oriantation == "portrait") {
	                        pic = { image: e.src, fit: [841.89, 595.28] };
	                    }
	                    else
	                        pic = { image: e.src, fit: [595.28, 841.89] };
	                    cnt.push(pic);
	                }
	                break;
	            }
	                //SBhindi added header tags.
	            case "h1": {
	                //styles.push("font-weight:bold");
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles.concat(["header:h1"]));
	                break;
	            }
	            case "h2": {
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles.concat(["header:h2"]));
	                break;
	            }
	            case "h3": {
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles.concat(["header:h3"]));
	                break;
	            }
	            case "h4": {
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles.concat(["header:h4"]));
	                break;
	            }
	            case "h5": {
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles.concat(["header:h5"]));
	                break;
	            }
	            case "h6": {
	                ASMPDFHelper.ParseContainer(cnt, e, p, styles.concat(["header:h6"]));
	                break;
	            }
	            default: {
	                console.log("Parsing for node " + e.nodeName + " not found");
	                break;
	            }
	        }
	        return p;
	    },
	    checkOriantation: function () {//SBhindi changed check orientation logic as older wasn't working
	        var oriantation = "portrait";
	        if (window.innerWidth > window.innerHeight)  //Landscape Mode
	        {
	            oriantation = "landscape";
	        }
	        return oriantation;
	        //var oriantation="portrait";
	        //if(window.orientation === 90 || window.orientation === -90)
	        //oriantation="landscape";
	        //return oriantation;
	    },
	    ParseHtml: function (cnt, htmlText) {
	        var html = $(htmlText.replace(/\t/g, "").replace(/\n/g, ""));
	        var p = ASMPDFHelper.CreateParagraph();
	        for (var i = 0; i < html.length; i++) ASMPDFHelper.ParseElement(cnt, html.get(i), p);
	    },

	    CreateParagraph: function () {
	        var p = { text: [] };
	        return p;
	    },

	    getBase64Image: function (img) {
	        // Create an empty canvas element
	        var canvas = document.createElement("canvas");
	        canvas.width = img.width;
	        canvas.height = img.height;

	        // Copy the image contents to the canvas
	        var ctx = canvas.getContext("2d");
	        ctx.drawImage(img, 0, 0);

	        // Get the data-URL formatted image
	        // Firefox supports PNG and JPEG. You could check img.src to
	        // guess the original format, but be aware the using "image/jpg"
	        // will re-encode the image.
	        var dataURL = canvas.toDataURL("image/png");

	        return dataURL;//.replace(/^data:image\/(png|jpg);base64,/, "");
	    }
	};

    window.ASMPDFHelper = asmpdfhelper;
})();



function cg_fs_get_photo(cache_folder, full_file_name, success, onlyimage) {
    //Sdwivedi 20140915 - OT #1119 - PitchBook - Upgrade the visual appeal of the Pitchbook launch screen
    var img_path;
    if (has_value(cache_folder.path))
        img_path = cache_folder.path;
    else
        img_path = cache_folder;
    log.trace('cg_fs_get_photo');

    if (cache_folder) {
        var file_name;
        if (full_file_name.indexOf('/') != -1) {
            var file_path = full_file_name.split('/');
            file_name = file_path[file_path.length - 1];
        }
        else
            file_name = full_file_name;

        cg_fs_get_directory(img_path, function (entry) {
            entry.getFile(file_name, null, function (f) {
                if (using_sftouch()) {
                    var reader = new FileReader();
                    reader.onloadend = function (evt) {
                        if (onlyimage)
                            success(evt.target.result, f);
                        else
                            success('<img src="' + evt.target.result + '"></img>', f);
                    };
                    reader.readAsDataURL(f);
                }
                else {
                    if (onlyimage)
                        success(f.toURL());
                    else
                        success('<img src="' + f.toURL() + '"></img>');
                }
            });
        });
    }
}
