/* $Id: filesystem.js 19664 2014-09-24 01:51:35Z JAMESR $ */
/* $URL: http://sifnzrandd1/Mobility/releases/Touch3.2.1/Touch/Touch/core/public/js/filesystem.js $ */
$(function ()
{
	var init_filesystem = function (phonegap)
	{
		// useful urls:
		// http://dev.w3.org/2009/dap/file-system/pub/FileSystem/
		// http://www.w3.org/TR/file-writer-api/
		// http://www.w3.org/TR/FileAPI/
		
		var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		if (!requestFileSystem && 'localFileSystem' in window)
			requestFileSystem = localFileSystem.requestFileSystem || localFileSystem.webkitRequestFileSystem;
		var blob = phonegap ? null : window.Blob;
		var dataView = phonegap ? null : window.DataView;
		var blobBuilder = phonegap ? null : (window.BlobBuilder || window.WebKitBlobBuilder);
		var file_system_root, file_system_temporary, file_system_persistent, file_system_caches;
		var base_file_system_root, base_file_system_temporary, base_file_system_persistent, base_file_system_caches;
		
		function tracelog(message)
		{
			alert('FileSystem: ' + message);
		}
		
		function errorlog(message)
		{
			alert('FileSystem: ' + message);
		}
		
		var describe_filesystem_error = function (code)
		{
			var msg = '';

			switch (code) {
				case FileError.QUOTA_EXCEEDED_ERR:
					msg = 'QUOTA_EXCEEDED_ERR';
					break;
				case FileError.NOT_FOUND_ERR:
					msg = 'NOT_FOUND_ERR';
					break;
				case FileError.SECURITY_ERR:
					msg = 'SECURITY_ERR';
					break;
				case FileError.INVALID_MODIFICATION_ERR:
					msg = 'INVALID_MODIFICATION_ERR';
					break;
				case FileError.INVALID_STATE_ERR:
					msg = 'INVALID_STATE_ERR';
					break;
				default:
					msg = 'Unknown Error';
					break;
			};
			
			return msg;
		};
		
		var error_handler = function(method, carryon)
		{
			return function (e)
			{
				var msg = describe_filesystem_error(e.code);
				//alert('Error ' + method + ': ' + msg);
				if (carryon) carryon(msg);
			};
		};

		if (!requestFileSystem)
			console.log('File system is not available');
		else
		{
			var init_fs = function (type, size, success)
			{
				type = 1;
				requestFileSystem(type, size, function (fs)
				{										
				//	alert('Initialized file system: ' + fs.name);
					success(fs.root);
				}, error_handler('initializing file system'));
			};
			
			init_fs(1, 1024, function (fs_root, base_root)
			{
				file_system_root = fs_root;
				base_file_system_root = base_root;
				file_system_persistent = fs_root;
				base_file_system_persistent = base_root;
				file_system_temporary = fs_root;
				base_file_system_temporary = base_root;
				init_fs(1, 1024, function (fs_root, base_root)
				{
					file_system_persistent = fs_root;
					base_file_system_persistent = base_root;
					//alert('Persistent file system root path (' + file_system_persistent.name + ') : ' + file_system_persistent.fullPath);
				});
				if (true)
				{
					var type = 2;
					init_fs(type, 1024, function (fs_root, base_root)
					{
						file_system_caches = fs_root;
						base_file_system_caches = base_root;
						//alert('Caches file system root path (' + file_system_caches.name + ') : ' + file_system_caches.fullPath);
					});
				}
				else
				{
					file_system_caches = fs_root;
					base_file_system_caches = base_root;
				}
			});
		}
	
		function enabled()
		{
			return file_system_root != null;
		}
	
		function fsroot()
		{
			return file_system_root;
		}
	
		function basefsroot()
		{
			return base_file_system_root;
		}
		
		function fstemporary()
		{
			return file_system_temporary;
		}
		
		function basefstemporary()
		{
			return base_file_system_temporary;
		}
		
		function fspersistent()
		{
			return file_system_persistent;
		}
		
		function basefspersistent()
		{
			return base_file_system_persistent;
		}
		
		function fscaches()
		{
			return file_system_caches;
		}
		
		function basefscaches()
		{
			return base_file_system_caches;
		}
		
		// convert the specified path to a path relative to the given root
		function relative_path(root, path)
		{
			var fs_root_path = root.fullPath;
			
			if (path.indexOf(fs_root_path, 0) != 0) return path;
			
			path = path.replace(new RegExp('^' + fs_root_path), '');
			if (path.indexOf('/', 0) == 0) path = path.slice(1);
			
			return path;
		}
		
		function remove_file(path, then, error)
		{
			remove_files([path], then, error);
		}
	
		function remove_files(paths, then, error)
		{
			remove_files2(file_system_root, paths, then, error);
		}
		
		function remove_file2(root, path, then, error)
		{
			remove_files2(root, [path], then, error);
		}
		
		function remove_files2(root, paths, then, error)
		{
			if (!paths) return then();
		
			async_foreach(paths, function (path, next_file)
			{
				root.getFile(path, null, function (fs_file)
				{
					fs_file.remove(next_file, FileSystem.error_handler("removing file '" + fs_file.fullPath + "'", next_file));
				}, FileSystem.error_handler("removing file '" + path + "'", function (message)
				{
					if (error) error(message);
					next_file();
				}));
			}, then);
		}
	
		function truncate(fs_file, success, failure)
		{
			fs_file.createWriter(function (writer)
			{
				writer.onerror = FileSystem.error_handler("truncating '" + fs_file.fullPath + "'", failure);
				writer.onwriteend = success;
				writer.truncate(0);
			}, FileSystem.error_handler("creating writer for file trucation '" + fs_file.fullPath + "'", failure));
		}
	
		function write_data(fs_file, value, success, failure, truncate, append)
		{
			// The Chrome filesystem API writer only handles blobs
			function convert_to_blob(value)
			{
				if (blob && dataView && value instanceof ArrayBuffer)
				{
					var view = new dataView(value);
					try
					{
						// this throws in IE10?
						return new blob([view]);
					}
					catch (m)
					{
					}
				}

				if (blob)
				{
					return new blob([value]);
				}
				else if (blobBuilder)
				{
					var bb = new blobBuilder();
					bb.append(value);
					return bb.getBlob();
				}
				else
				{
					return value;
				}
			}
			
			fs_file.createWriter(function (writer)
			{
				writer.onerror = FileSystem.error_handler("writing to '" + fs_file.fullPath + "'", failure);

				var write = function ()
				{
					var data = value;
					if (!phonegap)
					{
						data = convert_to_blob(value);
					}

					writer.onwriteend = success;
					writer.write(data);
				};
				
				if (append)
				{
					writer.seek(writer.length);
				}

				if (truncate)
				{
					writer.onwriteend = write;
					writer.truncate(0);
				}
				else
				{
					write();
				}
			}, FileSystem.error_handler("creating writer for '" + fs_file.fullPath + "'", failure));
		}
	
		function read_file(fs_file, read_method, success, failure)
		{
			fs_file.file(function (file)
			{
				var reader = new window.FileReader();
				if (reader[read_method] === undefined)
				{
					failure({ code: window.FileError.NOT_READABLE_ERR });
					return;
				}
				
				reader.onloadend = function()
				{
					success(this.result);
				};

				reader.onerror = failure;
				reader[read_method](file);
			}, failure);
		}

		function read_text_file(fs_file, success, failure)
		{
			read_file(fs_file, 'readAsText', success, failure);
		}
		
		function read_binary_string_file(fs_file, success, failure)
		{
			read_file(fs_file, 'readAsBinaryString', success, failure);
		}
		
		function read_data_url_file(fs_file, success, failure)
		{
			read_file(fs_file,'readAsDataURL', success, failure);
		}
		
		function read_array_buffer_file(fs_file, success, failure)
		{
			read_file(fs_file, 'readAsArrayBuffer', success, failure);
		}
		
		function supports_binary_read_write()
		{
			if (!window.using_sftouch()) {
				return true;
			}
			
			if (typeof window.PhoneGap.base64 === 'undefined') {
				return false;
			}

			return window.PhoneGap.base64.supported();
		}
	
		function list_directory_contents(path, success, complete, failure)
		{
			list_directory_contents2(file_system_root, path, success, complete, failure);
		}
		
		function list_directory_contents2(root, path, success, complete, failure)
		{
			root.getDirectory(path, null, function (fs_dir)
			{
				var fs_reader = fs_dir.createReader();
			
				var should_repeat = true;
				asynch_loop(function (i, next)
				{
					fs_reader.readEntries(function (fs_entries)
					{
						if (should_repeat && fs_entries.length > 0)
						{
							// phonegap 1.0 api incompatibility with HTML5 spec - repeated calls should
							// return the next block of files, not the full set every time
							should_repeat = !using_sftouch();
						
							success(fs_entries, next);
						}
						else if (complete)
							complete();
					}, FileSystem.error_handler("reading directory '" + path + "'", failure));
				});
			}, FileSystem.error_handler("getting directory '" + path + "'", failure));
		}
	
		function compress_file(root, file_name, success, failure)
		{
			var self = this;
			tracelog('compress_file: ' + file_name);
			
			var should_compress_file = function ()
			{
				tracelog('compress_file 1');
				return file_name.match(/\.txt$/);
			};
			
			if (using_sftouch() && 'compress_file' in SFTouch && should_compress_file())
			{
				tracelog('compress_file 2');
				
				root.getFile(file_name, { create: false }, function (fs_file)
				{
					tracelog('compress_file 3: ' + fs_file.fullPath);
					
					SFTouch.compress_file(fs_file.fullPath, function (compressed_file_data)
					{
						var compressed_file_name = compressed_file_data.compressed_file;
						tracelog('compress_file 4: ' + compressed_file_name);
						
						fs_file.remove(function ()
						{
							tracelog('compress_file 5');
							
							success(compressed_file_name);
						}, function (message)
						{
							var message = 'error deleting uncompressed file (sending compressed file): ' + JSON.stringify(message);
							success(compressed_file_name);
						});
					}, function (message)
					{
						var error = 'error compressing file (uploading uncompressed): ' + message;
						errorlog(error);
						failure(error);
					});
				}, function (message)
				{
					var error = 'error opening file for compression: ' + self.describe_filesystem_error(message);
					errorlog(error);
					failure(error);
				});
			}
			else
				success(file_name);
		}
		
		var filesystem =
		{
			error_handler: error_handler,
			describe_filesystem_error: describe_filesystem_error,
			relative_path: relative_path,
			remove_file: remove_file,
			remove_file2: remove_file2,
			remove_files: remove_files,
			remove_files2: remove_files2,
			write_text: write_data,
			write_binary: write_data,
			truncate: truncate,
			read_text_file: read_text_file,
			read_binary_string_file: read_binary_string_file,
			read_data_url_file: read_data_url_file,
			read_array_buffer_file: read_array_buffer_file,
			blobBuilder: blobBuilder,
			requestFileSystem: requestFileSystem,
			list_directory_contents: list_directory_contents,
			list_directory_contents2: list_directory_contents2,
			compress_file: compress_file,
			trace: function (message)
			{
				alert('FileSystem: ' + message);
			},
			error: function (message)
			{
				alert('FileSystem: ' + message);
			}
		};
	
		Object.defineProperty(filesystem, 'enabled', {
			get: enabled
		});
	
		Object.defineProperty(filesystem, 'root', {
			get: fsroot
		});
	
		Object.defineProperty(filesystem, 'baseroot', {
			get: basefsroot
		});
		
		Object.defineProperty(filesystem, 'temporary', {
			get: fstemporary
		});
		
		Object.defineProperty(filesystem, 'basetemporary', {
			get: basefstemporary
		});
		
		Object.defineProperty(filesystem, 'persistent', {
			get: fspersistent
		});
		
		Object.defineProperty(filesystem, 'basepersistent', {
			get: basefspersistent
		});
		
		Object.defineProperty(filesystem, 'caches', {
			get: fscaches
		});
		
		Object.defineProperty(filesystem, 'basecaches', {
			get: basefscaches
		});
		
		Object.defineProperty(filesystem, 'supports_binary', {
			get: supports_binary_read_write
		});
		
		window.FileSystem = filesystem;
	};
	
	if ('PhoneGap' in window)
	{
		PhoneGap.onDeviceReady.subscribeOnce(function ()
		{
			init_filesystem(true);
		});
	}
	else
		init_filesystem(false);
});
