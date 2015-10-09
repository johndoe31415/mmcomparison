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
Logging = {
	error: function(cause, msg) {
		var err = new Error();
		err.name = cause;
		err.message = msg;
		return err;
	}
};
