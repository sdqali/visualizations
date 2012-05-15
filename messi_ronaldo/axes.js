var Axis = function(svg) {
	this.svg = svg;
};

Axis.prototype.draw = function(padding, xLabelText, yLabelText, xScale, yScale) {
	h = this.svg.attr("height");
	w = this.svg.attr("width");


	var xAxis = d3.svg.axis()
	.scale(xScale)
	.ticks(20)
	.orient("bottom");

	this.svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + (h - 2 * padding) + ")")
	.call(xAxis);

	this.svg.append("text")
	.text(xLabelText)
	.attr("x", (w - 2 * padding)/2)
	.attr("y", h - padding);

	var yAxis = d3.svg.axis()
	.scale(yScale)
	.ticks(20)
	.orient("left");

	this.svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" +  2 * padding + ", 0)")
	.call(yAxis);

	var yLabel = this.svg.append("g");
	yLabel.append("text")
	.text(yLabelText)
	.attr("text-anchor", "middle");
	yLabel.attr("transform", "translate(" + padding/2 + "," +  (h - padding)/2 +") rotate(270)");

	var xRule = this.svg.append("g")
	.selectAll(".rule")
	.data(yScale.ticks(20))
	.enter()
	.append("g")
	.attr("class", "rule")
	.attr("transform", function(d) {
		return "translate(" + 2 * padding + ", " + yScale(d) + ")";
	});

	xRule.append("line")
	.attr("x2", w - 3 * padding);

	var yRule = this.svg.append("g")
	.selectAll(".rule")
	.data(xScale.ticks(20))
	.enter()
	.append("g")
	.attr("class", "rule")
	.attr("transform", function(d) {
		return "translate(" + xScale(d) + "," + padding + ")";
	});

	yRule.append("line")
	.attr("y2", h - 3 * padding);
};
