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
function DeviceCache() {
	this.getDevice = function(index) {
		var device = cache[index];
		if (!device) {
			deviceXML = getXMLDocument(devices[index].href);
			device = new Device();
			device.fromXML(deviceXML);
			cache[index] = device;
		}
		return device;
	}

	/* Do not need to load whole device description for just the name */
	this.getDeviceFullName = function(index) {
		return devices[index].vendor + " " + devices[index].name;
	}

	this.addDevice = function(device) {
		var newIndex = devices.length;
		devices.push({
			"vendor":	device.getVendor(),
			"name":		device.getName(),
			"href":		null,
		});
		cache[newIndex] = device;
		return newIndex;
	}
	
	this.getDeviceCount = function() {
		return devices.length;
	}

	this.replaceDevice = function(index, newDevice) {
		devices[index] = {
			"vendor":	newDevice.getVendor(),
			"name":		newDevice.getName(),
			"href":		null,
		};
		cache[index] = newDevice;
	}

	function getXMLDocument(url) {
		var url = "devs/" + url;
		var request = new XMLHttpRequest();
		request.open("GET", url, false);
		request.send(null);
		//if (xmlDoc.lastChild.tagName == "parsererror") {
		//		showMsg("Error parsing XML: " + xmlDoc.lastChild.textContent);
		//}
		return request.responseXML;
	}

	function loadInitialDeviceList() {
		var toc = getXMLDocument("toc.xml");
		var deviceNodes = toc.evaluate("//devices/device", toc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0; deviceNodes.snapshotItem(i); i++) {
			var device = deviceNodes.snapshotItem(i);
			devices.push({
				"vendor":	device.getAttribute("vendor"),
				"name":		device.getAttribute("name"),
				"href":		device.getAttribute("href"),
			});
		}
	}

	var that = this;
	var devices = [ ];
	var cache = { };
	loadInitialDeviceList();
}
