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
Utils = {
	adaptiveUnitFormatter: function(fmtstring, value) {
		if (Math.abs(value) < 1e-12) {
			/* Zero */
			return $.jqplot.sprintf("0%s", fmtstring);
		} else {
			/* Non-zero */
			var absPwr = Math.floor(Math.log(Math.abs(value)) / Math.log(10));
		}

		switch (absPwr) {
			case -12:	return $.jqplot.sprintf("%.2fp%s", value * 1e12, fmtstring);
			case -11:	return $.jqplot.sprintf("%.1fp%s", value * 1e12, fmtstring);
			case -10:	return $.jqplot.sprintf("%.0fp%s", value * 1e12, fmtstring);
			case -9:	return $.jqplot.sprintf("%.2fn%s", value * 1e9, fmtstring);
			case -8:	return $.jqplot.sprintf("%.1fn%s", value * 1e9, fmtstring);
			case -7:	return $.jqplot.sprintf("%.0fn%s", value * 1e9, fmtstring);
			case -6:	return $.jqplot.sprintf("%.2fµ%s", value * 1e6, fmtstring);
			case -5:	return $.jqplot.sprintf("%.1fµ%s", value * 1e6, fmtstring);
			case -4:	return $.jqplot.sprintf("%.0fµ%s", value * 1e6, fmtstring);
			case -3:	return $.jqplot.sprintf("%.2fm%s", value * 1e3, fmtstring);
			case -2:	return $.jqplot.sprintf("%.1fm%s", value * 1e3, fmtstring);
			case -1:	return $.jqplot.sprintf("%.0fm%s", value * 1e3, fmtstring);
			case 0:		return $.jqplot.sprintf("%.2f%s", value, fmtstring);
			case 1:		return $.jqplot.sprintf("%.1f%s", value, fmtstring);
			case 2:		return $.jqplot.sprintf("%.0f%s", value, fmtstring);
			case 3:		return $.jqplot.sprintf("%.2fk%s", value * 1e-3, fmtstring);
			case 4:		return $.jqplot.sprintf("%.1fk%s", value * 1e-3, fmtstring);
			case 5:		return $.jqplot.sprintf("%.0fk%s", value * 1e-3, fmtstring);
			case 6:		return $.jqplot.sprintf("%.2fM%s", value * 1e-6, fmtstring);
			case 7:		return $.jqplot.sprintf("%.1fM%s", value * 1e-6, fmtstring);
			case 8:		return $.jqplot.sprintf("%.0fM%s", value * 1e-6, fmtstring);
		}
		if (absPwr < -4) {
			return $.jqplot.sprintf("<%.0fu%s", value * 1e6, fmtstring);
		} else {
			return $.jqplot.sprintf(">%.0f%s", value, fmtstring);

		}
	},
	getUnitSymbol: function(unit) {
		if ((unit == "DCV") || (unit == "ACV")) {
			return "V";
		} else if ((unit == "DCA") || (unit == "ACA")) {
			return "A";
		} else if (unit == "Ohm") {
			//return "&Omega;";
			return "Ω";
		} else if (unit == "F") {
			return "F";
		} else if (unit == "Hz") {
			return "Hz";
		} else if (unit == "H") {
			return "H";
		}
		return "?";
	},
};
