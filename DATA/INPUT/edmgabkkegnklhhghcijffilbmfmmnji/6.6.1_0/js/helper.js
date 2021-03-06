String.prototype.getValueByKey = function(k){
	var p = new RegExp('\\b'+k+'\\b','gi');
	return this.search(p) != -1 ? decodeURIComponent(this.substr(this.search(p)+k.length+1).substr(0,this.substr(this.search(p)+k.length+1).search(/(&|;|$)/))) : "";
};

(function(window, $) {

	var Helper = function(){};

	/** Object to store session data  */
	Helper.prototype._ = {};

	/**
	 * Modifies session data and returns
	 * @param key
	 * @param value
	 * @return value
	 */
	Helper.prototype.set = function(key, value) {
		this._[key] = value;
		return value;
	};

	/**
	 * Returns the session data
	 * @param key
	 * @param _default
	 * @return string | bool | object
	 */
	Helper.prototype.get = function(key, _default) {
		return this._[key] == undefined ?
			_default == undefined ? false : _default
			: this._[key];
	};

	Helper.prototype.ksort = function(inputArr, sort_flags) {
		var tmp_arr = {},
			keys = [],
			sorter, i, k, that = this,
			strictForIn = false,
			populateArr = {};

		switch (sort_flags) {
			case 'SORT_STRING':        // compare items as strings
				sorter = function (a, b) {
					return that.strnatcmp(a, b);
				};
				break;
			case 'SORT_LOCALE_STRING':
				// compare items as strings, based on the current locale (set with  i18n_loc_set_default() as of PHP6)
				var loc = this.i18n_loc_get_default();
				sorter = this.php_js.i18nLocales[loc].sorting;
				break;
			case 'SORT_NUMERIC':
				// compare items numerically
				sorter = function (a, b) {
					return ((a + 0) - (b + 0));
				};
				break;
			// case 'SORT_REGULAR': // compare items normally (don't change types)
			default:
				sorter = function (a, b) {
					var aFloat = parseFloat(a),
						bFloat = parseFloat(b),
						aNumeric = aFloat + '' === a,
						bNumeric = bFloat + '' === b;
					if (aNumeric && bNumeric) {
						return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
					} else if (aNumeric && !bNumeric) {
						return 1;
					} else if (!aNumeric && bNumeric) {
						return -1;
					}
					return a > b ? 1 : a < b ? -1 : 0;
				};
				break;
		}
		// Make a list of key names
		for (k in inputArr) {
			if (inputArr.hasOwnProperty(k)) {
				keys.push(k);
			}
		}
		keys.sort(sorter);

		// BEGIN REDUNDANT
		this.php_js = this.php_js || {};
		this.php_js.ini = this.php_js.ini || {};
		// END REDUNDANT
		strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js.ini['phpjs.strictForIn'].local_value !== 'off';
		populateArr = strictForIn ? inputArr : populateArr;
		// Rebuild array with sorted key names
		for (i = 0; i < keys.length; i++) {
			k = keys[i];
			tmp_arr[k] = inputArr[k];
			if (strictForIn) {
				delete inputArr[k];
			}
		}
		for (i in tmp_arr) {
			if (tmp_arr.hasOwnProperty(i)) {
				populateArr[i] = tmp_arr[i];
			}
		}

		return strictForIn || populateArr;
	};

	window.framework_helper = new Helper();

})(window, jQuery);

