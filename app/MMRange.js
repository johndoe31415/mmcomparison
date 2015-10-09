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
function MMRange(rangename, comment) {
	/* +- (errorpercent % + errorcounts counts) */
	this.addInterval = function(maxvalue, resolution, errorpercent, errorcounts) {
		intervals.push([ maxvalue, resolution, errorpercent, errorcounts ]);
	}

	/* +- (errorpercent % + errorfullscapepercent %) */
	this.addIntervalFullScale = function(maxvalue, resolution, errorpercent, errorfullscalepercent) {
		this.addInterval(maxvalue, resolution, errorpercent, errorfullscalepercent / 100 * maxvalue / resolution);
	}

	function getRangeIndex(value) {
		for (var i = 0; i < intervals.length; i++) {
			if (value < intervals[i][0]) {
				return i;
			}
		}
		return null;
	}

	this.getError = function(value) {		
		var rangeIndex = getRangeIndex(value);
		if (rangeIndex == null) {
			/* This error is undefined for this instrument */
			return null;
		}
		var range = intervals[rangeIndex];					
		var linearError = (range[2] / 100) * value;
		var rangeError = range[1] * range[3];
		return linearError + rangeError;
	}

	this.getName = function() {
		return rangename;
	}

	this.getComment = function() {
		return comment;
	}

	this.toXML = function() {
		var xml = "";
		if (this.getComment()) {
			xml += "\t<range name=\"" + this.getName() + "\" comment=\"" + this.getComment() + "\">\n";
		} else {
			xml += "\t<range name=\"" + this.getName() + "\">\n";
		}
		for (var i = 0; i < intervals.length; i++) {
			var interval = intervals[i];
			xml += $.jqplot.sprintf("\t\t<interval maxvalue=\"%e\" resolution=\"%e\" errorpercent=\"%e\" errorcounts=\"%e\" />\n", interval[0], interval[1], interval[2], interval[3]);
		}
		xml += "\t</range>\n";
		return xml;
	}

	var that = this;
	var rangename = rangename;
	var intervals = [ ];
	var comment = comment;
}

