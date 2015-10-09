function StringBuffer() { 
	this.append = function(s) {
		buffer.push(s);
	}

	this.toString = function() {
		return buffer.join("");
	}

	var buffer = [ ];
}
