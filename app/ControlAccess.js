/*
	This file is part of MMPlot.

	MMPlot is free software: you can redistribute it and/or modify
	it under the terms of the GNU General Public License as published by
	the Free Software Foundation, either version 3 of the License, or
	(at your option) any later version.

	MMPlot is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with MMPlot.  If not, see <http://www.gnu.org/licenses/>.
 */
function ControlAccess() {
	this.addCheckboxGroup = function(tab, name) {
		controls.push({
			"type":		"checkbox",
			"tab":		tab,
			"name":		name,
		});
	}
	
	this.addRadioGroup = function(tab, name) {
		controls.push({
			"type":		"radio",
			"tab":		tab,
			"name":		name,
		});
	}

	function getRadioGroupValue(tab, name) {
		var items = tab.find("input[type=radio][name=" + name + "]");
		for (var i = 0; i < items.length; i++) {
			if (items[i].checked) {
				return items[i].value;
			}
		}
		return null;
	}

	function setRadioGroupValue(tab, name, value) {
		if (value != null) {
			tab.find("input[type=radio][name=" + name + "][value=" + value + "]").attr("checked", true);
		} else {
			/* Deselect all */
			tab.find("input[type=radio][name=" + name + "]").attr("checked", false);
		}
	}

	function getCheckboxGroupValue(tab, name) {
		var items = tab.find("input[type=checkbox][name=" + name + "]");
		var result = [ ];
		for (var i = 0; i < items.length; i++) {
			if (items[i].checked) {
				result.push(items[i].value);
			}
		}
		return result;
	}

	function setCheckboxGroupValue(tab, name, value) {
		/* Deselect all first */
		tab.find("input[type=checkbox][name=" + name + "]").attr("checked", false);
		for (var i = 0; i < value.length; i++) {
			tab.find("input[type=checkbox][name=" + name + "][value=" + value[i] + "]").attr("checked", true);
		}
	}

	this.get = function() {
		var values = { };
		for (var i = 0; i < controls.length; i++) {
			var control = controls[i];
			if (control.type == "radio") {
				values[control.name] = getRadioGroupValue(control.tab, control.name);
			} else if (control.type == "checkbox") {
				values[control.name] = getCheckboxGroupValue(control.tab, control.name);
			}
		}
		return values;
	}	
	
	this.set = function(values) {
		for (var i = 0; i < controls.length; i++) {
			var control = controls[i];
			if (control.type == "radio") {
				setRadioGroupValue(control.tab, control.name, values[control.name]);
			} else if (control.type == "checkbox") {
				setCheckboxGroupValue(control.tab, control.name, values[control.name]);
			}
		}
	}

	var that = this;
	var controls = [ ];
}

