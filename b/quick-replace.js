/*global console*/

/*
* show word count, char count on hover - show dimensions for img
* click to show editable field, buttons to save/cancel?
* drag local image over img, drop to replace
*/

(window.quickReplace = function($, document, window, undefined) {

	var BASE_URL = 'http://quick-replace.com/b/',
		CLASS_PREFIX = 'QKRP',
		$info = null,
		$body = null,
		$btnClose = null,
		supportsFile = false,
		isEnabled = false,

		init = function() {

			$body = $(document.body);

			// check for File support
			supportsFile = (window.File && window.FileReader);

			// load styles ---
			
			$('head').append($('<link />', {
				"href": BASE_URL + "quick-replace.css",
				"rel": "stylesheet",
				"id": CLASS_PREFIX + "-styles"
			}));

			// create info tag ---

			$info = $('<div />', {
				"class": CLASS_PREFIX + "-info"
			});

			$body.append($info);
			$info.hide();

			// create close button ---

			$btnClose = $('<a />', {
				"href": "#",
				"title": "Exit Quick Replace",
				"class": CLASS_PREFIX + '-btn-close'
			}).text('X').click(function(e) {
				e.preventDefault();
				disable();
			});

			$body.append($btnClose);


			// get to it ---

			enable();

		},

		enable = function() {

			isEnabled = true;
			$btnClose.show();

			// mouse actions -------

			$body.on('click.' + CLASS_PREFIX, function(e) {
				//console.log('click', e.target);

				var $target = $(e.target),
					tagName = $target.prop('tagName'),
					text = cleanText($target.text()),
					result;

				if ($target.hasClass(CLASS_PREFIX + '-btn-close')) {
					return;
				}

				e.preventDefault();
				e.stopPropagation();

				if (text.length === 0) {
					return;
				}

				result = window.prompt('Edit ' + tagName.toUpperCase() + ' text', text);

				if (result) {
					$target.text(result);
				}

			});

			$body.on('mouseover.' + CLASS_PREFIX, function(e) {
				//console.log('over', e.target);

				var $target = $(e.target),
					tagName = $target.prop('tagName'),
					text = cleanText($target.text()),
					offset = $target.offset(),
					charCount = getCharCount(text),
					wordCount = getWordCount(text),
					charS = charCount === 1 ? '' : 's',
					wordS = wordCount === 1 ? '' : 's',
					infoTop = 0,
					infoLeft = 0,
					info = '';

				if ($target.hasClass(CLASS_PREFIX + '-btn-close')) {
					return;
				}

				e.preventDefault();
				$target.addClass(CLASS_PREFIX + '-mouse-over');

				// construct info ---

				info += '<span class="tag-name">' + tagName + ':</span> ';

				if (tagName.toLowerCase() === 'img') {
					info += getImgDimensions($target);
				} else {
					info += charCount + ' char' + charS + ', ';
					info += wordCount + ' word' + wordS;
				}

				// show it ---

				$info.html(info);
				$info.show();

				// position it ---
				
				infoTop = offset.top - ($info.outerHeight() + 2);
				infoLeft = offset.left - 2;

				if (infoTop < 0) {
					infoTop = offset.top + $target.height() + 2;
				}

				if (infoTop + $info.outerHeight() > $body.height()) {
					infoTop = $body.height() - $info.height();
				}

				$info.css({
					"top": infoTop + 'px',
					"left": infoLeft + 'px'
				});

			});

			$body.on('mouseout.' + CLASS_PREFIX, function(e) {
				//console.log('out', e.target);

				var $target = $(e.target);

				if ($target.hasClass(CLASS_PREFIX + '-btn-close')) {
					return;
				}

				e.preventDefault();
				$target.removeClass(CLASS_PREFIX + '-mouse-over');
				$info.hide();

			});

			// drag actions -----

			if (!supportsFile) {
				return;
			}

			$body.on('dragenter.' + CLASS_PREFIX, 'img', function(e) {

				var $target = $(e.target);
				e.preventDefault();
				$target.addClass(CLASS_PREFIX + '-drag-over');

			});

			$body.on('dragleave.' + CLASS_PREFIX, 'img', function(e) {

				var $target = $(e.target);
				e.preventDefault();
				$target.removeClass(CLASS_PREFIX + '-drag-over');

			});

			$body.on('dragover.' + CLASS_PREFIX, 'img', function(e) {
				e.preventDefault();
				e.originalEvent.dataTransfer.dropEffect = 'copy';
			});

			$body.on('drop.' + CLASS_PREFIX, 'img', function(e) {

				var $target = $(e.target),
					fileList = e.originalEvent.dataTransfer.files || [],
					file,
					fileType,
					fileReader;

				//console.log(e, fileList);
				e.preventDefault();
				e.stopPropagation();
				$target.removeClass(CLASS_PREFIX + '-drag-over');

				if (fileList.length === 0) {
					console.log('No files to load...');
					return;
				}

				file = fileList[0]; // assuming one file...
				fileType = file.type.toLowerCase();

				// check if is image file ---

				if (!fileType.match('image.*')) {
					window.alert('Not a valid image format - try GIF, JPG or PNG');
					return;
				}

				// load image ----

				fileReader = new FileReader();

				fileReader.onload = function() {
					$target.attr('src', this.result);
				};

				fileReader.onerror = function() {
					window.alert('Could not load image!');
				};

				fileReader.readAsDataURL(file);

			});

		},

		disable = function() {

			isEnabled = false;
			$btnClose.hide();
			$info.hide();

			// mouse actions -------

			$body.off('click.' + CLASS_PREFIX);
			$body.off('mouseover.' + CLASS_PREFIX);
			$body.off('mouseout.' + CLASS_PREFIX);

			// drag actions -----

			if (!supportsFile) {
				return;
			}

			$body.off('dragenter.' + CLASS_PREFIX);
			$body.off('dragleave.' + CLASS_PREFIX);
			$body.off('dragover.' + CLASS_PREFIX);
			$body.off('drop.' + CLASS_PREFIX);

		},

		toggle = function() {

			if (isEnabled) {
				disable();
			} else {
				enable();
			}

		},

		cleanText = function(str) {
			str = $.trim(str);
			str = str.replace(/\s+/g, ' ');
			return str;
		},

		getCharCount = function(str) {
			return str.length;
		},

		getWordCount = function(str) {
			if (str.length === 0) {
				return 0;
			}
			return str.split(/\s+/).length;
		},

		getImgDimensions = function($img) {

			var dim = '',
				w = $img.width(),
				h = $img.height(),
				nImg = new Image(),
				nW,
				nH;

			nImg.src = $img.attr("src");
			nW = nImg.width;
			nH = nImg.height;

			dim = w + ' x ' + h;

			if (nW !== w || nH !== h) {
				dim += ' (Natural: ' + nW + ' x ' + nH + ')';
			}

			return dim;

		};

	// one time setup
	init();

	// return object for external calls later
	return {
		enable: enable,
		disable: disable,
		toggle: toggle
	};

});

(function() {

	var script,
		ready = function() {
			// kind of weird, but run a one-time setup and return an object for later
			window.quickReplace = window.quickReplace(window.jQuery, document, window);
		};

	// load jquery if needed ---

	if (window.jQuery && window.jQuery.fn.jquery >= '1.8.3') {

		ready();

	} else {

		script = document.createElement('script');
		script.src =  '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js';

		script.onload = function(){
			ready();
		};

		document.body.appendChild(script);

	}

}());


// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


