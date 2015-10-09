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
function CSVExport(tab, deviceCache, dataSource) {
	function csvAddRow(csvrow, stringBuffer) {
		for (var i = 0; i < csvrow.length; i++) {
			stringBuffer.append("\"" + csvrow[i] + "\"");
			if (i != (csvrow.length - 1)) {
				stringBuffer.append(",");
			}
		}
		stringBuffer.append("\n");
	}

	this.updateData = function(plotOptions) {
		var textArea = tab.find("#csvarea")[0];
		var activeDevices = dataSource.getActiveDataSources();
		
		textArea.value = "";

		var stringBuffer = new StringBuffer();
		csvrow = [ ];
		for (deviceIndex in activeDevices.ranges) {
			csvrow.push(deviceCache.getDeviceFullName(deviceIndex));
		}
		csvAddRow(csvrow, stringBuffer);

		var xdata = dataSource.getRawDataX();
		var ydata = dataSource.getRawDataY();
		for (var i = 0; i < xdata.length; i++) {
			csvrow = [ ];
			for (deviceIndex in activeDevices.ranges) {
				csvrow.push(ydata[deviceIndex][i]);
			}
			csvAddRow(csvrow, stringBuffer);
		}

		textArea.value = stringBuffer.toString();
	}

	var that = this;
	var tab = tab;
	var deviceCache = deviceCache;
	var dataSource = dataSource;
}
