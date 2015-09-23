/**
 * Author: Tony Brix, Tony@Brix.ninja
 * License: MIT http://www.opensource.org/licenses/mit-license.php
 * Description: jQuery plugin to create a "check/uncheck all" check box
 * Website: https://github.com/UziTech/jquery.checkAll.js
 */
;
(function ($, undefined) {
	"use strict";
	var pluginName = "checkAll";
	$[pluginName] = function (el, options) {
		var plugin;
		if ($(el).data(pluginName)) {
			plugin = $(el).data(pluginName);
		} else {
			// To avoid scope issues, use 'plugin' instead of 'this'
			// to reference this class from internal events and functions.
			plugin = this;

			// Access to jQuery and DOM versions of element
			plugin.$el = $(el);
			plugin.el = el;
		}

		if (typeof (options) === "object" || options === undefined) {
			plugin._init(options);
		} else if (typeof (options) === "string" && options.substring(0, 1) !== "_" && typeof plugin[options] === "function") {
			plugin[options].apply(this, Array.prototype.slice.call(arguments, 1));
		} else {
			throw "Invalid Arguments";
		}
	};

	var pluginPrototype = {
		_defaults: {
			selector: "input[type='checkbox']"
		},
		_init: function (options) {
			var plugin = this;
			if (plugin.$el.data(pluginName)) {
				throw "Already Initialized";
			}

			plugin.options = $.extend({}, plugin._defaults, options);

			plugin.$checkboxes = $(plugin.options.selector).not(plugin.$el);

			plugin.$el.on("change.checkAll", function () {
				plugin.$el.prop({indeterminate: false});
				$(plugin.options.selector).prop({checked: plugin.el.checked});
			});
			
			var checkboxChange = function(){
				var totalChecked = 0;
				var totalUnchecked = 0;
				plugin.$checkboxes.each(function () {
					if (this.checked) {
						totalChecked++;
					} else {
						totalUnchecked++;
					}
				});
				if (totalChecked === 0) {
					plugin.$el.prop({indeterminate: false, checked: false});
				} else if (totalUnchecked === 0) {
					plugin.$el.prop({indeterminate: false, checked: true});
				} else {
					plugin.$el.prop({indeterminate: true, checked: false});
				}
			};
			plugin.$checkboxes.on("change.checkAll", checkboxChange);

			// Add a reverse reference to the DOM object
			plugin.$el.data(pluginName, plugin);
			checkboxChange();
		},
		
		destroy: function () {
			var plugin = this;

			plugin.$el.off(".checkAll");
			plugin.$checkboxes.off(".checkAll");

			delete plugin.$el.data()[pluginName];
		}
	};

	$[pluginName].prototype = pluginPrototype;

	$.fn[pluginName] = function (options) {
		return this.each(function () {
			(new $[pluginName](this, options));
		});
	};

})(jQuery);
