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
function Controller() {
	this.getDeviceCache = function() {
		return deviceCache;
	}

	this.getPlot = function() {
		return plot;
	}

	function plotInputsChanged() {
		var plotOptions = that.getControls().get();

		if (plotOptions.plottype == "cmp") {
			/* Linear scale only for compare mode */
			plotOptions.yscale = "lin";

			var referenceValid = false;
			for (var i = 0; i < plotOptions.showdevices.length; i++) {
				if (plotOptions.reference == plotOptions.showdevices[i]) {
					referenceValid = true;
					break;
				}
			}	
			if ((plotOptions.reference == null) || (!referenceValid)) {
				/* If no reference was selected, select the first one */
				plotOptions.reference = plotOptions.showdevices[0];
			}
		} else {
			/* No reference for non-compare mode */
			plotOptions.reference = null;
		}

		/* Calculate data source to update reference index (maybe the selected
		 * reference does not support capability) */
		var dataSourceChanged = dataSource.updateData(plotOptions);
		if (plotOptions.plottype == "cmp") {
			plotOptions.reference = dataSource.getReferenceDeviceIndex();
		}
		that.getControls().set(plotOptions);
			
		/* Disable all "reference" radioboxes first */
		$("#ioptions").contents().find("input[name='reference']").attr("disabled", true);

		if (plotOptions.plottype == "cmp") {
			/* For compare mode only, enable those "reference" radioboxes that
			 * correspond to the "devicelist" checkboxes only */
			$("#ioptions").contents().find("input[name='reference']").each(function(index, object) {
				object.disabled = !$("#ioptions").contents().find("input[type='checkbox'][value='" + object.value + "']")[0].checked;
			});

		}
		
		/* Enable Y scale logarithmic capability only on non-compare mode */
		$("#ioptions").contents().find("input[type='radio'][name='yscale'][value='log']").attr("disabled", plotOptions.plottype == "cmp");
	
		plot.updatePlot(plotOptions, dataSourceChanged);
	}

	this.updateDeviceList = function() {
		var deviceNode = $("#ioptions").contents().find("#devicelist");
		deviceNode.empty();
		for (var i = 0; i < deviceCache.getDeviceCount(); i++) {
			deviceNode.append("<li><input type=\"radio\" name=\"reference\" value=\"" + i + "\"><input type=\"checkbox\" name=\"showdevices\" value=\"" + i + "\"><a href=\"javascript:parent.controller.eventEditDevice(" + i + ");\">" + deviceCache.getDeviceFullName(i) + "</a></li>");
		}

		$("#ioptions").contents().find("input[type=\"checkbox\"]").change(function() {
			plotInputsChanged();
		});
	}

	function registerEvents() {
		$("#ioptions").contents().find("input[type=\"radio\"]").change(function() {
			plotInputsChanged();
		});
	}

	/* Click on a tab */
	this.eventTabClick = function(source) {
		/* Mark all tabs not selected */
		$("#tabs").contents().find("a").removeClass("selected");

		/* Only the selected one has the "selected" class */
		$("#" + source.id).addClass("selected");

		/* Hide all iframes */
		$("iframe").addClass("hidden");

		/* Show only the selected iframe */
		$("#i" + source.id).removeClass("hidden");

		if (source.id == "compare") {
			/* Click on "compare" tab */
			deviceComparator.updateData(controlAccess.get());
		} else if (source.id == "csv") {
			/* Click on "csv" tab */
			csvExport.updateData(controlAccess.get());
		}
	}

	/* Click on device name in "options" tab */
	this.eventEditDevice = function(index) {
		this.eventTabClick($("#edit")[0]);
		deviceEditor.edit(index);
	}

	/* Click on "export" button in "edit" tab */
	this.eventExportXML = function() {
		deviceEditor.exportXML();
	}
	
	/* Click on "import" button in "edit" tab */
	this.eventImportXML = function() {
		var importedIndex = deviceEditor.importXML();
		this.updateDeviceList();
		this.eventEditDevice(importedIndex);
	}

	/* Click on "newdevice" button in "edit" tab */
	this.eventNewDevice = function() {
		var newDev = new Device("NewVendor", "NewDev", 4000, "My Source", "http://foo.bar", "John Doe", "KpioEpfAjowbmje/ofu");
		var newIndex = deviceCache.addDevice(newDev);
		this.updateDeviceList();
		this.eventEditDevice(newIndex);
	}

	function initControlAccess() {
		var iframe = $("#ioptions").contents();
		controlAccess.addRadioGroup(iframe, "plottype");
		controlAccess.addRadioGroup(iframe, "xscale");
		controlAccess.addRadioGroup(iframe, "yscale");
		controlAccess.addRadioGroup(iframe, "range");
		controlAccess.addRadioGroup(iframe, "reference");
		controlAccess.addCheckboxGroup(iframe, "showdevices");
	}

	this.getControls = function() {
		return controlAccess;
	}

	function init() {
		initControlAccess();
		that.updateDeviceList();
		registerEvents();
		plotInputsChanged();
	}
	
	var that = this;
	var deviceCache = new DeviceCache();
	var deviceEditor = new DeviceEditor($("#iedit").contents(), deviceCache);
	var dataSource = new DataSource(deviceCache);
	var plot = new Plot($("#ioptions").contents(), deviceCache, dataSource);
	var deviceComparator = new DeviceComparator($("#icompare").contents(), deviceCache, dataSource);
	var csvExport = new CSVExport($("#icsv").contents(), deviceCache, dataSource);
	var controlAccess = new ControlAccess();
	init();
}

