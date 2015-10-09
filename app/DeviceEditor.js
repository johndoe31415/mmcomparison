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
function DeviceEditor(tab, deviceCache) {
	function showMsg(msg) {
		tab.find("#message").empty().append(msg);
	}

	this.exportXML = function() {
		if (editingIndex != null) {
			tab.find("#xmlarea")[0].value = deviceCache.getDevice(editingIndex).toXML();
		} else {
			showMsg("Please select a device first before using XML export.");
		}
	}

	this.importXML = function() {
		if (editingIndex != null) {
			var parser = new DOMParser();
			var xmlDoc = parser.parseFromString(tab.find("#xmlarea")[0].value, "text/xml");
			if (xmlDoc.lastChild.tagName == "parsererror") {
				showMsg("Error parsing XML: " + xmlDoc.lastChild.textContent);
			} else {
				var newDevice = new Device();
				newDevice.fromXML(xmlDoc);
				deviceCache.replaceDevice(editingIndex, newDevice);
				showMsg("Device successfully imported.");
			}
		} else {
			showMsg("Please select a device first before using XML import.");
		}
		return editingIndex;
	}

	function loadDevice(index) {
		var dev = deviceCache.getDevice(index);
		tab.find("#vendor").empty().append(dev.getVendor());
		tab.find("#device").empty().append(dev.getName());		
		tab.find("#counts").empty().append(dev.getCounts());		
		tab.find("#enteredby").empty().append(dev.getEnteredBy());
		if (dev.getEnteredByMail()) {
			tab.find("#enteredby").append(" &lt;<a href=\"mailto:" + dev.getEnteredByMail() + "\">" + dev.getEnteredByMail() + "</a>&gt;");
		}
		if (dev.getSourceURL()) {
			tab.find("#datasource").empty().append("<a href=\"" + dev.getSourceURL() + "\">" + dev.getSource() + "</a>");
		} else {
			tab.find("#datasource").empty().append(dev.getSource());
		}
		tab.find("#xmlarea")[0].value = "";
	}

	this.edit = function(index) {
		editingIndex = index;
		loadDevice(index);
	}

	var that = this;
	var tab = tab;
	var deviceCache = deviceCache;
	var editingIndex = null;
}
