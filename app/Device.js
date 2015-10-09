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
function Device(vendor, name, counts, source, sourceURL, enteredby, enteredbymail) {
	this.getVendor = function() {
		return vendor;
	}
	this.getName = function() {
		return name;
	}
	this.getCounts = function() {
		return counts;
	}	
	this.getSource = function() {
		return source;
	}
	this.getSourceURL = function() {
		return sourceURL;
	}
	this.getEnteredBy = function() {
		return enteredby;
	}
	this.getEnteredByMail = function() {
		return enteredbymail;
	}

	this.getFullName = function() {
		return this.getVendor() + " " + this.getName();
	}

	this.getCounts = function() {
		return counts;
	}
	
	this.getRange = function(rangename) {
		return ranges[rangename];
	}
	
	this.addRange = function(range) {
		ranges[range.getName()] = range;
	}
	
	function obfuscate(string) {
		obfuscated = "";
		for (var i in string) {
			obfuscated += String.fromCharCode(string.charCodeAt(i) + 1);
		}
		return obfuscated;
	}

	function deobfuscate(string) {
		deobfuscated = "";
		for (var i in string) {
			deobfuscated += String.fromCharCode(string.charCodeAt(i) - 1);
		}
		return deobfuscated;
	}

	this.toXML = function() {
		var xml = "";
		xml += "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n";
		xml += "<!-- \"enteredbymail\" attribute of \"device\" node is obfuscated to protect email addresses from spambots.\n"
		xml += "     Subtract 1 from ASCII value for each character to get actual string. -->\n"
		xml += "<device vendor=\"" + this.getVendor() + "\" name=\"" + this.getName() + "\" counts=\"" + this.getCounts() + "\" source=\"" + this.getSource() + "\" enteredby=\"" + this.getEnteredBy() + "\" enteredbymail=\"" + obfuscate(this.getEnteredByMail()) + "\"> \n";
		for (rangename in ranges) {
			xml += ranges[rangename].toXML();
		}
		xml += "</device>\n";
		return xml;
	}

	this.fromXML = function(xmlDoc) {
		var deviceNode = xmlDoc.evaluate("//device", xmlDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
		vendor = deviceNode.getAttribute("vendor");
		name = deviceNode.getAttribute("name");
		counts = parseInt(deviceNode.getAttribute("counts"));
		source = deviceNode.getAttribute("source");
		sourceURL = deviceNode.getAttribute("srcurl");
		enteredby = deviceNode.getAttribute("enteredby");
		enteredbymail = deobfuscate(deviceNode.getAttribute("enteredbymail"));
		var rangeNodes = xmlDoc.evaluate("//device/range", xmlDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		for (var i = 0; rangeNodes.snapshotItem(i); i++) {
			var rangeNode = rangeNodes.snapshotItem(i);
			var rangeName = rangeNode.getAttribute("name");
			var rangeComment = rangeNode.getAttribute("comment");
			var range = new MMRange(rangeName, rangeComment);
			var intervalNodes = xmlDoc.evaluate("//device/range[@name='" + rangeName + "']/interval", xmlDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for (var j = 0; intervalNodes.snapshotItem(j); j++) {
				var intervalNode = intervalNodes.snapshotItem(j);
				var maxValue = parseFloat(intervalNode.getAttribute("maxvalue"));
				var resolution = parseFloat(intervalNode.getAttribute("resolution"));
				var errorPercent = parseFloat(intervalNode.getAttribute("errorpercent"));
				
				if (intervalNode.getAttribute("errorcounts")) {
					var errorCounts = parseFloat(intervalNode.getAttribute("errorcounts"));
					range.addInterval(maxValue, resolution, errorPercent, errorCounts);
				} else {
					var errorFullScale = parseFloat(intervalNode.getAttribute("errorfullscale"));
					range.addIntervalFullScale(maxValue, resolution, errorPercent, errorFullScale);
				}
			}
			this.addRange(range);
		}
	}

	var that = this;
	var vendor = vendor;
	var name = name;
	var counts = counts;
	var source = source;
	var sourceURL = sourceURL;
	var enteredby = enteredby;
	var enteredbymail = deobfuscate(enteredbymail);
	var ranges = { };
}
