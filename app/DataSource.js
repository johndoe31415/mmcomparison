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
function DataSource(deviceCache) {
	/* Fetch and return the ranges of devices which support the selected range.
	 * Also return the number of devices which do not support the selected
	 * range. */
	function getDeviceRanges() {		
		var result = {
			ranges: { },
			activeDevCnt: 0,
			ignoredDevCnt: 0,
		};
		
		for (var i = 0; i < userSettings.showdevices.length; i++) {
			var deviceIndex = userSettings.showdevices[i];
			var range = deviceCache.getDevice(deviceIndex).getRange(userSettings.range);
			if (range) {
				/* Device offers the selected range */
				result.ranges[deviceIndex] = range;
				result.activeDevCnt += 1;
			} else {
				/* Device does not offer the range */
				result.ignoredDevCnt += 1;
			}
		}
		return result;
	}
	
	this. getReferenceDeviceIndex = function() {
		return referenceDeviceIndex;
	}

	function getRange() {
		if ((userSettings.range == "DCV") || (userSettings.range == "ACV")) {
			return [ 0.01, 1000 ];
		} else if ((userSettings.range == "DCA") || (userSettings.range == "ACA")) {
			return [ 0.01, 20 ];
		} else if (userSettings.range == "Ohm") {
			return [ 0.01, 10e6 ];
		} else if (userSettings.range == "F") {
			return [ 1e-9, 10e-6 ];
		} else if (userSettings.range == "Hz") {
			return [ 1, 100e3 ];
		} else if (userSettings.range == "H") {
			return [ 1e-6, 1e-3 ];
		} else {
			var err = new Error();
			err.name = "Plot.getRange(): Invalid value for userSettings.range '" + userSettings.range + "'";
			throw err;
		}
	}

	function appendErrorMsg(msg) {
		errorMessages.push(msg);
	}

	function calculateXRange(rngtype, min, max) {
		var result = [ ];
		if (rngtype == "log") {
			var value = min;
			var factor = Math.pow((max / min), (1 / (targetPointCount - 1)));
			for (var i = 0; i < targetPointCount; i++) {
				result.push(value);
				value *= factor;
			}
		} else if (rngtype == "lin") {
			var value = min;
			var step = (max - min) / (targetPointCount - 1);
			for (var i = 0; i < targetPointCount; i++) {
				result.push(value);
				value += step;
			}
		} else {
			var err = new Error();
			err.name = "Do not know how to generate X range of type '" + rngtype + "'.";
			throw err;
		}
		return result;
	}

	function calculateDataAbsolute() {
		if (activeDevices.activeDevCnt < 1) {
			appendErrorMsg("Please select at least one device to display data for absolute error mode.");
			return false;
		}

		for (var deviceIndex in activeDevices.ranges) {
			var dataseries = [ ];
			for (var i = 0; i < datarangex.length; i++) {
				var xvalue = datarangex[i];
				dataseries.push(activeDevices.ranges[deviceIndex].getError(xvalue));
			}
			datarangey[deviceIndex] = dataseries;
		}
		return true;
	}

	function calculateDataRelative() {
		if (activeDevices.activeDevCnt < 1) {
			appendErrorMsg("Please select at least one device to display data for relative error mode.");
			return false;
		}

		for (var deviceIndex in activeDevices.ranges) {
			var dataseries = [ ];
			for (var i = 0; i < datarangex.length; i++) {
				var xvalue = datarangex[i];
				var error = activeDevices.ranges[deviceIndex].getError(xvalue);
				if (error != null) {
					error = 100 * error / xvalue;
				}
				dataseries.push(error);
			}
			datarangey[deviceIndex] = dataseries;
		}
		return true;
	}
	
	function calculateDataComparison() {
		if (activeDevices.activeDevCnt < 2) {
			appendErrorMsg("Please select at least two devices to display data for comparison mode.");
			return false;
		}

		referenceDeviceIndex = userSettings.reference;
		if (activeDevices.ranges[referenceDeviceIndex] == null) {
			/* Selected reference device does not offer selected capability,
			 * select a new reference device */
			for (deviceIndex in activeDevices.ranges) {
				referenceDeviceIndex = deviceIndex;
				break;
			}
		}

		/* Calculate reference settings first */
		var refData = [ ];
		for (var i = 0; i < datarangex.length; i++) {
			var xvalue = datarangex[i];
			refData.push(activeDevices.ranges[referenceDeviceIndex].getError(xvalue));
		}

		/* Then calculate remaining data */
		for (var deviceIndex in activeDevices.ranges) {
			if (deviceIndex == referenceDeviceIndex) {
				/* Omit reference series */
				continue;
			}

			var dataseries = [ ];
			for (var i = 0; i < datarangex.length; i++) {
				var xvalue = datarangex[i];
				var error = activeDevices.ranges[deviceIndex].getError(xvalue);
				var refError = refData[i];				
				if ((error != null) && (refError != null)) {
					if (error > refError) {
						error = 100 * (error - refError) / refError;
					} else {
						error = -100 * (refError - error) / error;
					}
				} else {
					error = null;
				}
				dataseries.push(error);
			}
			datarangey[deviceIndex] = dataseries;
		}
		return true;
	}

	function rebuildPlotArray() {
		var jqplotData = [ ];
		for (var deviceIndex in activeDevices.ranges) {
			if (datarangey[deviceIndex]) {
				var series = [ ];
				for (var i = 0; i < datarangex.length; i++) {
					series.push([ datarangex[i], datarangey[deviceIndex][i] ]);
				}
				jqplotData.push(series);
			}
		}
		return jqplotData;
	}

	this.getJqPlotData = function() {
		return plotArray;
	}

	this.getActiveDataSources = function() {
		return activeDevices;
	}

	this.getErrors = function() {
		msg = "";
		for (var i = 0; i < errorMessages.length; i++) {
			msg += errorMessages[i] + " ";
		}
		return msg;
	}

	this.getBestDevices = function() {
		var bestDevices = [ ];

		if (activeDevices.activeDevCnt > 0) {
			var lastBestIndex = null;
			for (var i = 0; i < datarangex.length; i++) {
				var xvalue = datarangex[i];
				var bestIndex = null;
				var bestValue = null;
				for (var deviceIndex in datarangey) {
					if ((bestIndex == null) || (datarangey[deviceIndex][i] < bestValue)) {
						bestValue = datarangey[deviceIndex][i];
						bestIndex = deviceIndex;
					}
				}
				if ((bestIndex != lastBestIndex) || (i == datarangex.length - 1)) {
					bestDevices.push({
						fromValue: datarangex[i],
						bestIndex: bestIndex,
					});

					lastBestIndex = bestIndex;
				}
			}
		}
		return bestDevices;
	}

	this.updateData = function(newUserSettings) {
		if (newUserSettings == userSettings) {
			/* Nothing changed, quit */
			return false;
		}
		userSettings = newUserSettings;
	
		errorMessages = [ ];

		/* Calculate X axis values */
		{
			var xRange;
			try {
				xRange = getRange();
			} catch (e) {
				/* No range given */
				return;
			}
			datarangex = calculateXRange("log", xRange[0], xRange[1]);
		}	

		/* Clear old graph data */
		datarangey = { };

		/* Get the devices which should be plotted */
		activeDevices = getDeviceRanges();

		/* Warn if devices were selected which do not offer the requested capability */
		if (activeDevices.ignoredDevCnt == 1) {
			appendErrorMsg("Warning: " + activeDevices.ignoredDevCnt + " selected device does not offer " + userSettings.range + " capability and was ignored.");
		} else if (activeDevices.ignoredDevCnt > 1) {
			appendErrorMsg("Warning: " + activeDevices.ignoredDevCnt + " selected devices do not offer " + userSettings.range + " capability and were ignored.");
		}

		/* Calculate Y axis data */
		var success = false;
		if (userSettings.plottype == "abs") {
			success = calculateDataAbsolute();
		} else if (userSettings.plottype == "rel") {
			success = calculateDataRelative();
		} else if (userSettings.plottype == "cmp") {
			success = calculateDataComparison();
		}

		/* Consolidate Y axis data into a format the jqplot can process */
		if (success) {
			plotArray = rebuildPlotArray();
		} else {
			plotArray = null;
		}

		return true;
	}

	this.getRawDataX = function() {
		return datarangex;
	}
	
	this.getRawDataY = function() {
		return datarangey;
	}

	var that = this;
	var userSettings = null;
	var targetPointCount = 350;
	var activeDevices = null;
	var errorMessages = [ ];
	var datarangex = [ ];
	var datarangey = { };
	var referenceDeviceIndex = null;
	var plotArray = null;
}
