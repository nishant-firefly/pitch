﻿var UPCA = {
	ShowBarcode:function($holder, barcodeValue){
		var bc0 = "<div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\">\
		 <\/div>";

		var bc1 = "<div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\">\
		 <\/div>";

		var bc2 = "<div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\">\
		 <\/div>";

		var bc3 = "<div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\">\
		 <\/div>";

		var bc4 = "<div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\">\
		 <\/div>";

		var bc5 = "<div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\">\
		 <\/div>";

		var bc6 = "<div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\">\
		 <\/div>";

		var bc7 = "<div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\">\
		 <\/div>";

		var bc8 = "<div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\">\
		 <\/div>";

		var bc9 = "<div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m o\"><\/div><div \
		 class=\"m e\"><\/div><div \
		 class=\"m e\">\
		 <\/div>";
		 
		var barcodeHolder='<div class="upc-a">'+
			'<div class="upc-wrap">' +
			'<div class="m e long">' +
			'</div>' +
			'<div class="m o long">' +
			'</div>' +
			'<div class="m e long">' +
			'</div>' +
			'<div class="l">' +
			'<div class="l1">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'<div class="l2">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'<div class="l3">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'<div class="l4">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'<div class="l5">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'<div class="l6">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="m o long">' +
			'</div>' +
			'<div class="m e long">' +
			'</div>' +
			'<div class="m o long">' +
			'</div>' +
			'<div class="m e long">' +
			'</div>' +
			'<div class="m o long">' +
			'</div>' +
			'<div class="r">' +
			'<div class="r1">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'<div class="r2">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'<div class="r3">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'<div class="r4">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'<div class="r5">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'<div class="r6">' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m o">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'<div class="m e">' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="m e long">' +
			'</div>' +
			'<div class="m o long">' +
			'</div>' +
			'<div class="m e long">' +
			'</div>' +
			'</div>' +
			'<div class="l-prefix digits"></div>'+
			'<div class="l-digits digits"></div>'+
			'<div class="r-digits digits"></div>'+
			'<div class="r-suffix digits"></div>'+
			'</div>';
			
			
		if ($holder.find('.upc-a').length==0)
			$holder.append(barcodeHolder);
		
		var bcnum = barcodeValue;
		var intcheck = /^\d+$/; // regex only 0-9
		if ( (intcheck.test(bcnum)) && (bcnum.length == 12) ) {
			bcnum = bcnum.substring(0,11);
			// update graphics for first 11
			var elements = ['l1','l2','l3','l4','l5','l6','r1','r2','r3','r4','r5'];

			jQuery.each(elements, function(i, val) {
				var code_update = bcnum.substring(i,i+1);
				var bcx = eval("bc".concat(code_update));
				$("." + this).html(bcx);
			});

			// calculate last digit and update

			var bcdigits = bcnum.split('');

			var checksum_s1 = 0; //init odd holder
			var checksum_s2 = 0; //init even holder

			jQuery.each(bcdigits, function(i,val){
				if(i%2 == 0) {
					checksum_s1 += parseInt(val);
				} else {
					checksum_s2 += parseInt(val);
				}
			});

			var checksum_s3 = checksum_s1*3 + checksum_s2;

			var s3_string = checksum_s3.toString();
			var s3_last = s3_string.substring(s3_string.length - 1);

			if (s3_last == "0") {
				$holder.find(".r6").html(bc0);
				var diff = 0;
			} else {
				var diff = 10 - parseInt(s3_last);
				var diff_bc = eval("bc".concat(diff));
				$holder.find(".r6").html(diff_bc);
			};

			$holder.find('.l-prefix').text(bcnum.slice(0,1));
			$holder.find('.l-digits').text(bcnum.slice(1,6));
			$holder.find('.r-digits').text(bcnum.slice(6,11));
			$holder.find('.r-suffix').text(diff);
			$holder.show();
		}else 
			$holder.hide();	
	}
}