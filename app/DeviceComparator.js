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
function DeviceComparator(tab, deviceCache, dataSource) {
	this.updateData = function(plotOptions) {
		var unitSymbol = Utils.getUnitSymbol(plotOptions.range);
		var bestDevices = dataSource.getBestDevices();
		/* Remove last row result */
		tab.find("tr[class=cprow]").remove();
		var table = tab.find("#cptable");
		for (var i = 0; i < bestDevices.length - 1; i++) {
			var device = deviceCache.getDevice(bestDevices[i].bestIndex);			
			var fromValue = bestDevices[i].fromValue;
			var toValue = bestDevices[i + 1].fromValue;
//			alert(device);
			table.append("<tr class=\"cprow\">" +
				"<td>" + Utils.adaptiveUnitFormatter(unitSymbol, fromValue) + " - " + Utils.adaptiveUnitFormatter(unitSymbol, toValue) + "</td>" +
				"<td>" + Utils.adaptiveUnitFormatter(unitSymbol, toValue - fromValue) + "</td>" +
				"<td>" + device.getFullName() + "</td>" +
				"</tr>");
		}
	}
	
	var that = this;
	var tab = tab;
	var deviceCache = deviceCache;
	var dataSource = dataSource;
}
