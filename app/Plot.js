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
function Plot(tab, deviceCache, dataSource) {
	function showMsg(msg) {
		tab.find("#message").empty().append(msg);
	}
	
	function removePlot() {
		if (plotArea != null) {
			$("#placeholder").empty();
			delete plotArea;
			plotArea = null;
		}
	}

	function drawPlot() {
		removePlot();
		plotArea = $.jqplot("placeholder", data, plotOptions);
	}

	this.updatePlot = function(newUserPlotOptions, dataSourceChanged) {
		if ((newUserPlotOptions == userPlotOptions) && (!dataSourceChanged)) {
			/* Nothing changed, quit */
			return;
		}
		userPlotOptions = newUserPlotOptions;

		/* Retrieve data from data source */
		data = dataSource.getJqPlotData();
		showMsg(dataSource.getErrors());
		if (!data) {
			/* No data source present */
			removePlot();
			return;
		}

		/* Retrieve list of active devices */
		var activeDevices = dataSource.getActiveDataSources();

		plotOptions.axes.xaxis.tickOptions = {
			formatter: Utils.adaptiveUnitFormatter,
			formatString: Utils.getUnitSymbol(userPlotOptions.range),
		};
		if (userPlotOptions.plottype == "abs") {
			plotOptions.title = "Absolute Error";
			plotOptions.axes.yaxis.label = "Absolute Error (" + Utils.getUnitSymbol(userPlotOptions.range) + ")";
			plotOptions.axes.yaxis.tickOptions = {
				formatter: Utils.adaptiveUnitFormatter,
				formatString: Utils.getUnitSymbol(userPlotOptions.range),
			}
		} else if (userPlotOptions.plottype == "rel") {
			plotOptions.title = "Relative Error";
			plotOptions.axes.yaxis.label = "Relative Error (%)";
			plotOptions.axes.yaxis.tickOptions = {
				formatString: "%.2f%%", 
			};
		} else if (userPlotOptions.plottype == "cmp") {
			var refDeviceIndex = dataSource.getReferenceDeviceIndex();
			plotOptions.title = "Comparison to " + deviceCache.getDevice(refDeviceIndex).getFullName();
			plotOptions.axes.yaxis.label = "Relative Error (%)";
			plotOptions.axes.yaxis.tickOptions = {
				formatString: "%.0f%%", 
			};
		}

		plotOptions.series = [ ]
		if ((userPlotOptions.plottype == "abs") || (userPlotOptions.plottype == "rel")) {
			for (var deviceIndex in activeDevices.ranges) {
				plotOptions.series.push({
					label: deviceCache.getDevice(deviceIndex).getFullName(),
				});
			}
		} else {
			/* Comparison mode, omit one series (the reference) */
			for (var deviceIndex in activeDevices.ranges) {
				var refDeviceIndex = userPlotOptions.reference;
				if (deviceIndex == refDeviceIndex) {
					continue;
				}
				plotOptions.series.push({
					label: deviceCache.getDevice(deviceIndex).getFullName(),
				});
			}
		}

		if (userPlotOptions.xscale == "lin") {
			plotOptions.axes.xaxis.renderer = $.jqplot.LinAxisRenderer;
		} else if (userPlotOptions.xscale == "log") {
			plotOptions.axes.xaxis.renderer = $.jqplot.LogAxisRenderer;
		}
		
		if (userPlotOptions.yscale == "lin") {
			plotOptions.axes.yaxis.renderer = $.jqplot.LinAxisRenderer;
		} else if (userPlotOptions.yscale == "log") {
			plotOptions.axes.yaxis.renderer = $.jqplot.LogAxisRenderer;
		}

		drawPlot();
	}
	
	var that = this;
	var tab = tab;
	var deviceCache = deviceCache;
	var dataSource = dataSource;

	var plotArea = null;
	var userPlotOptions = null;
	var data = [ ];
	var plotOptions = {
		seriesDefaults: {
			showMarker: false,
			showLabel: true,
		},
		axesDefaults: {
			labelRenderer: $.jqplot.CanvasAxisLabelRenderer
		},
		axes: {
			xaxis: {
				pad: 0,
			},
			yaxis: {
			},
		},
		cursor: {
			show: true,
			tooltipLocation: "nw",
			zoom: true,
		},
		legend: {
			show: true,
			/*
			location: "ne",
			xoffset: 12,
			yoffset: 12,
			*/
		},
	};
}
