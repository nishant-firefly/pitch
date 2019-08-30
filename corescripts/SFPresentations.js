(function ()
{
	try
	{
		console.log('loaded presentations 1: ' + location.search);
		var pg_port = 0;
		
		var match;
		if (match = /pgport=(\d+)/.exec(location.search))
			pg_port = match[1];
		
		console.log('pg_port = ' + pg_port);
		//DSMITH 20140730, modified below code for transition from Touch 3 to Touch 4
		var presentationID;
              if (match = /presentationID=(.{8}-.{4}-.{4}-.{4}-.{12})/.exec(location.search))
                     presentationID = match[1];
		
		console.log('presentationID = ' + presentationID);
		
		var include = function (file)
		{
			var tag = '<script src="' + file + '"></script>';
			console.log('writing script tag: ' + tag);
			document.write(tag);
		};
		console.log('loaded presentations 2');
		
		var shell_hosted_file = function (file)
		{
			return "http://localhost:" + pg_port + "/" + file + "?time=" + encodeURIComponent(Date.now());
		};
		var SFPresentationAPI = {
			presentationID: presentationID,
			
			ready: function (handler)
			{
				device_ready_handlers.push(handler);
				clear_device_ready_handlers();
			}
		};
		
		console.log('loaded presentations 3');
		include(shell_hosted_file('sfpresentationhandler.js'));
		include(shell_hosted_file('phonegap.js'));
		include(shell_hosted_file('sftouch.js'));
		
		var device_is_ready = false;
		var device_ready_handlers = [];
		
		console.log('loaded presentations 4');
		var device_ready = function ()
		{
			console.log('device ready handler');
			device_is_ready = true;
			clear_device_ready_handlers();
		};
		
		var clear_device_ready_handlers = function ()
		{
			if (!device_is_ready) return;
			for (var i in device_ready_handlers)
			{
				var handler = device_ready_handlers[i];
				handler(presentationID);
			}
			
			device_ready_handlers = [];
		};
		
		console.log('loaded presentations 5');
		var wait_for_ondeviceready = function ()
		{
			console.log('loaded presentations 5.1 (waiting for phonegap ondeviceready to be available)');
			
			if ('PhoneGap' in window && 'onDeviceReady' in PhoneGap)
				PhoneGap.onDeviceReady.subscribeOnce(device_ready);
			else
				setTimeout(wait_for_ondeviceready, 200);
		};
		
		setTimeout(wait_for_ondeviceready, 200);
		
		console.log('loaded presentations 6');
		window.SFPresentationAPI = SFPresentationAPI;
	}
	catch (m)
	{
		console.error('presentation load error: ' + m);
	}
})();