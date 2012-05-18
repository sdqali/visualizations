var Axis = function(svg) {
    this.svg = svg;
    this.padding = 30;
    this.height = 500;
    this.width = 1000;
    this.xLabelText = "X Label";
    this.yLabelText = "Y Label";
};

Axis.prototype.withPadding = function(padding) {
    this.pading = padding;
    return this;
};

Axis.prototype.withHeight = function(height) {
    this.height = height;
    return this;
};

Axis.prototype.withWidth = function(width) {
    this.width = width;
    return this;
};

Axis.prototype.withXLabelText = function(xLabelText) {
    this.xLabelText = xLabelText;
    return this;
};

Axis.prototype.withYLabelText = function(yLabelText) {
    this.yLabelText = yLabelText;
    return this;
};

Axis.prototype.withXScale = function(xScale) {
    this.xScale = xScale;
    return this;
};

Axis.prototype.withYScale = function(yScale) {
    this.yScale = yScale;
    return this;
};

Axis.prototype.draw = function() {
    this.height = this.svg.attr("height");
    this.width = this.svg.attr("width");
    var self = this;

    var xAxis = d3.svg.axis()
	.scale(this.xScale)
	.ticks(20)
	.orient("bottom");

    this.svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + (this.height - 2 * this.padding) + ")")
	.call(xAxis);

    this.svg.append("text")
	.text(this.xLabelText)
	.attr("x", (this.width - 2 * this.padding)/2)
	.attr("y", this.height - this.padding);

    var yAxis = d3.svg.axis()
	.scale(this.yScale)
	.ticks(20)
	.orient("left");

    this.svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(" +  2 * this.padding + ", 0)")
	.call(yAxis);

    var yLabel = this.svg.append("g");
    yLabel.append("text")
	.text(this.yLabelText)
	.attr("text-anchor", "middle");
    yLabel.attr("transform", "translate(" + this.padding/2 + "," +  (this.height - this.padding)/2 +") rotate(270)");

    var xRule = this.svg.append("g")
	.selectAll(".rule")
	.data(this.yScale.ticks(20))
	.enter()
	.append("g")
	.attr("class", "rule")
	.attr("transform", function(d) {
		  return "translate(" + 2 * self.padding + ", " + self.yScale(d) + ")";
	      });

    xRule.append("line")
	.attr("x2", this.width - 3 * this.padding);

    var yRule = this.svg.append("g")
	.selectAll(".rule")
	.data(this.xScale.ticks(20))
	.enter()
	.append("g")
	.attr("class", "rule")
	.attr("transform", function(d) {
		  return "translate(" + self.xScale(d) + "," + self.padding + ")";
	      });

    yRule.append("line")
	.attr("y2", h - 3 * this.padding);
};
