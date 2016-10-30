/**
 * Above the fold external resource proxy
 *
 * @package    abovethefold
 * @subpackage abovethefold/public
 * @author     PageSpeed.pro <info@pagespeed.pro>
 */

(function(window, Abtf) {

	/**
	 * Proxy url
	 */
	var PROXY_URL;
	var PROXY_BASE;

	/**
	 * Proxy enabled
	 */
	var PROXY_JS = false;
	var PROXY_CSS = false;

	// global CDN
	var PROXY_CDN = false;

	var PROXY_JS_INCLUDE = false;
	var PROXY_JS_EXCLUDE = false;
	var PROXY_CSS_INCLUDE = false;
	var PROXY_CSS_EXCLUDE = false;

	var PROXY_PRELOAD = false;
	var PROXY_PRELOAD_URLS = [];
	var PROXY_PRELOAD_HASHES = [];
	var PROXY_PRELOAD_REGEX = [];
	var PROXY_PRELOAD_CDN = {};

	var CDN_URLS = [];

	/**
	 * Proxy setup
	 */
	window['Abtf'].proxy_setup = function(cnf) {
		
		if (typeof ajaxurl === 'undefined') {
			var ajaxurl = false;
		}

		PROXY_URL = cnf.url || ajaxurl;
		if (!PROXY_URL) {
			if (ABTFDEBUG) {
	            console.error('Abtf.proxy()', 'no proxy url', cnf);
	        }
		}

		PROXY_JS = cnf.js || false;
		PROXY_CSS = cnf.css || false;
		PROXY_CDN = cnf.cdn || false;
		if (PROXY_CDN) {
			CDN_URLS.push(PROXY_CDN);
		}

		PROXY_JS_INCLUDE = cnf.js_include || false;
		PROXY_JS_EXCLUDE = cnf.js_exclude || false;
		PROXY_CSS_INCLUDE = cnf.css_include || false;
		PROXY_CSS_EXCLUDE = cnf.css_exclude || false;

		if (cnf.preload) {
			PROXY_PRELOAD = true;

			var url;
			for (var i = 0; i < cnf.preload.length; i++) {

				if (cnf.preload[i][0] === 'regex') {

					PROXY_PRELOAD_REGEX.push([cnf.preload[i][2],cnf.preload[i][3],cnf.preload[i][1]]);

					// resource specific CDN
					if (cnf.preload[i][4]) {
						PROXY_PRELOAD_CDN[cnf.preload[i][0]] = cnf.preload[i][4];
						if (CDN_URLS.indexOf(cnf.preload[i][4]) === -1) {
							CDN_URLS.push(cnf.preload[i][4]);
						}
					}

				} else {
					PROXY_PRELOAD_URLS.push(cnf.preload[i][0]);
					PROXY_PRELOAD_HASHES.push(cnf.preload[i][1]);

					// resource specific CDN
					if (cnf.preload[i][4]) {
						PROXY_PRELOAD_CDN[cnf.preload[i][0]] = cnf.preload[i][4];
						if (CDN_URLS.indexOf(cnf.preload[i][4]) === -1) {
							CDN_URLS.push(cnf.preload[i][4]);
						}
					}
				}

			}

			PROXY_BASE = cnf.base || false;
		}

		if (CDN_URLS.length === 0) {
			CDN_URLS = false;
		} else {

			// parse CDN urls
			var l = CDN_URLS.length;
			for (var i = 0; i < l; i++) {
				CDN_URLS[i] = PARSE_URL(CDN_URLS[i]);
			}
		}
		
	};

	/**
	 * Elements to listen on
	 */
	var ListenerTypeNames = ['Element','Document'];

	var ListenerTypes = {
	    'Element': (typeof Element !== 'undefined') ? Element : false,
	    'Document': (typeof Document !== 'undefined') ? Document : false
	};

	// Reference to original function
	var ORIGINAL = {
		append: {},
		insert: {}
	};

	for (var type in ListenerTypes) {
	    if (!ListenerTypes.hasOwnProperty(type)) {
	        continue;
	    }
	    if (ListenerTypes[type]) {
	        ORIGINAL.append[type] = ListenerTypes[type].prototype.appendChild;
	        ORIGINAL.insert[type] = ListenerTypes[type].prototype.insertBefore;
	    }
	}

	var SITE_URL = document.createElement('a');
	SITE_URL.href = document.location.href;

	/**
	 * Parse URL (e.g. protocol relative URL)
	 */
	var PARSE_URL = function(url) {
		var parser = document.createElement('a');
		parser.href = url;
		return parser;
	};

	/**
	 * Return proxy or direct cache url based on preload list
	 */
	var PROXIFY_URL = function(url,type) {

		if (ABTFDEBUG) {
			var regexmatch = false;
			var originalUrl;
		}

		// check preload list
		if (PROXY_PRELOAD) {

			// check preload list
			var isCached = PROXY_PRELOAD_URLS.indexOf(url);
			if (isCached > -1) {

				// cache hash for url
				var cachehash = PROXY_PRELOAD_HASHES[isCached];

			} else if (PROXY_PRELOAD_REGEX.length > 0) {

				var l = PROXY_PRELOAD_REGEX.length;
				var r, error;
				for (var i = 0; i < l; i++) {

					error = false;

					// parse regex
					try {
						r = new RegExp(PROXY_PRELOAD_REGEX[i][0],PROXY_PRELOAD_REGEX[i][1] || '');
					} catch (e) {
						error = true;
					}
					if (error) {
						continue;
					}

					if (r.test(url)) {

						if (ABTFDEBUG) {
							regexmatch = true;
							originalUrl = url;
				        }

						// cache hash
						if (PROXY_PRELOAD_REGEX[i][2]) {
							cachehash = PROXY_PRELOAD_REGEX[i][2];
						} else if (PROXY_PRELOAD_REGEX[i][3]) {

							// replace url with target
							url = PROXY_PRELOAD_REGEX[i][3];
						}

						break;
					}
				}
			}

			if (cachehash) {

				// custom resource CDN
				if (typeof PROXY_PRELOAD_CDN[url] !== 'undefined') {
					var path = PROXY_PRELOAD_CDN[url];
				} else {
					var path = PROXY_BASE;
				}

				path += cachehash.substr(0,2) + '/';
				path += cachehash.substr(2,2) + '/';
				path += cachehash.substr(4,2) + '/';
				path += cachehash.substr(6,2) + '/';
				path += cachehash.substr(8,2) + '/';
				path += cachehash;

				if (type === 'js') {
					path += '.js';
				} else if (type === 'css') {
					path += '.css';
				}

				if (ABTFDEBUG) {
					if (regexmatch) {
						console.log('Abtf.proxy()', 'capture', originalUrl, 'regex', '➤', 'cache:' + cachehash);
					} else {
		            	console.log('Abtf.proxy()', 'capture', url, '➤', 'cache:' + cachehash);
		        	}
		        }

				return path;
			}
		}

		if (ABTFDEBUG) {
			if (regexmatch) {
				console.log('Abtf.proxy()', 'capture', originalUrl, 'regex', '➤', url);
			} else {
            	console.log('Abtf.proxy()', 'capture', url);
        	}
        }

		if (type === 'css') {

        	return PROXY_URL
				.replace('{PROXY:URL}',escape(url))
				.replace('{PROXY:TYPE}',escape(type));

        } else if (type === 'js') {

        	return PROXY_URL
				.replace('{PROXY:URL}',escape(url))
				.replace('{PROXY:TYPE}',escape(type));
        }

	}

	/**
	 * Detect if node is external script or stylesheet
	 */
	var IS_EXTERNAL_RESOURCE = function(node) {

		if (node.nodeName) {
			if (node.nodeName.toUpperCase() === 'SCRIPT') {

				if (!PROXY_JS) {
					return false;
				}

				if (node.src) {

					// parse url
					var parser = PARSE_URL(node.src);

					if (CDN_URLS) {

						// test CDN urls
						var l = CDN_URLS.length;
						var cdnparser;
						for (var i = 0; i < l; i++) {

							if (parser.href.indexOf(CDN_URLS[i].href) !== -1) {
								// resource is on CDN = local url
								return false;
							}
						}
					}

					// local url
					if (parser.host === SITE_URL.host) {
						return false;
					}

					// verify include list
					if (PROXY_JS_INCLUDE) {

						var match = false;
						var l = PROXY_JS_INCLUDE.length;
						for (var i = 0; i < l; i++) {
							if (parser.href.indexOf(PROXY_JS_INCLUDE[i]) !== -1) {
								match = true;
								break;
							}
						}

						// not in include list
						if (!match) {
							return false;
						}
					}

					// verify exclude list
					if (PROXY_JS_EXCLUDE) {

						var l = PROXY_JS_EXCLUDE.length;
						for (var i = 0; i < l; i++) {
							if (parser.href.indexOf(PROXY_JS_EXCLUDE[i]) !== -1) {

								// ignore file
								return false;
							}
						}
					}

					// external url
					return 'js';
				}
			} else if (node.nodeName.toUpperCase() === 'LINK' && node.rel.toLowerCase() === 'stylesheet') {

				if (!PROXY_CSS) {
					return false;
				}

				if (node.href) {
					var parser = PARSE_URL(node.href);

					if (CDN_URLS) {

						// test CDN urls
						var l = CDN_URLS.length;
						var cdnparser;
						for (var i = 0; i < l; i++) {

							if (parser.href.indexOf(CDN_URLS[i].href) !== -1) {
								// resource is on CDN = local url
								return false;
							}
						}
					}

					// local url
					if (parser.host === SITE_URL.host) {
						return false;
					}

					// verify include list
					if (PROXY_CSS_INCLUDE) {

						var match = false;
						var l = PROXY_CSS_INCLUDE.length;
						for (var i = 0; i < l; i++) {
							if (parser.href.indexOf(PROXY_CSS_INCLUDE[i]) !== -1) {
								match = true;
								break;
							}
						}

						// not in include list
						if (!match) {
							return false;
						}
					}

					// verify exclude list
					if (PROXY_CSS_EXCLUDE) {

						var l = PROXY_CSS_EXCLUDE.length;
						for (var i = 0; i < l; i++) {
							if (parser.href.indexOf(PROXY_CSS_EXCLUDE[i]) !== -1) {

								// ignore file
								return false;
							}
						}
					}

					// external url
					return 'css';
				}
			}
		}

		return false;
	}

	/**
	 * Proxy injected script or stylesheet URL
	 */
	var PROXY = function(node) {

		var type = IS_EXTERNAL_RESOURCE(node);
		if (!type) {
			return false;
		}

    	/**
    	 * Translate relative url
    	 * 
    	 * @since  2.5.3
    	 */
    	var url = PARSE_URL((type === 'css') ? node.href : node.src).href;

    	// proxy or direct cache url
    	var proxy_url = PROXIFY_URL(url, type);

        if (type === 'css') {

        	node.href = proxy_url;

        } else if (type === 'js') {

        	node.src = proxy_url;
        }

	}

	/**
	 * Capture appendChild
	 */
	var CAPTURE = {

		/**
		 * appendChild handler
		 */
		appendChild: function(type, aChild) {
		    var target = this;

		    PROXY(aChild);

		    // call original method
		    return ORIGINAL.append[type].call(this, aChild);
		},

		/**
		 * insertBefore handler
		 */
		insertBefore: function(type, newNode, referenceNode) {
		    var target = this;

		    PROXY(newNode);

		    // call original method
		    return ORIGINAL.insert[type].call(this, newNode, referenceNode);
		}
	};

	/**
	 * Rewrite listener methods for objects and elements
	 */
	for (var type in ListenerTypes) {
	    if (!ListenerTypes.hasOwnProperty(type)) {
	        continue;
	    }
	    if (ListenerTypes[type]) {
	        (function(type) {

	        	/**
	        	 * Capture appendChild
	        	 */
	            ListenerTypes[type].prototype.appendChild = function(aChild) {
	                return CAPTURE.appendChild.call(this, type, aChild);
	            };

	        	/**
	        	 * Capture insertBefore
	        	 */
	            ListenerTypes[type].prototype.insertBefore = function(newNode, referenceNode) {
	                return CAPTURE.insertBefore.call(this, type, newNode, referenceNode);
	            };
	        })(type);
	    }
	}

})(window, window['Abtf']);