var w = 1000;
var h = 500;
var padding = 30;
var colorMap = {
	"Cristiano Ronaldo": "#1f77b4",
	"Lionel Messi": "#637939"
};

var Timeseries = function() {
};


Timeseries.prototype.draw = function(className) {
	var vis = createSkelton(className);
	d3.json("data/processed_data.json", function(players) {
		
		players.forEach(function(player) {
			var performances = sanitize(player.performances);
			var xScale = d3.scale.linear()
			.domain([0, performances.length])
			.range([2 * padding, w - padding]);

			var totalGoals = performances.reduce(function(a, b){
				return {"goals": (a.goals + b.goals)};
			}).goals;
			var yScale = d3.scale.linear()
			.domain([0, totalGoals])
			.range([h - 2 * padding, padding]);

			var maxGoals = d3.max(performances, function(p) {return p.goals;})
			var radiusScale = d3.scale.linear()
			.domain([0, maxGoals])
			.range([1, maxGoals]);

			var circles = vis.append("g")
			.selectAll("circle")
			.data(performances)
			.enter()
			.append("circle")
			.attr("cx", function(d, i) { return xScale(i); })
			.attr("cy", function(d, i) {
				var ps = performances.slice(0, i + 1);
				var val = ps.reduce(function(a, b) {
					return {goals: a.goals + b.goals}
				}).goals;
				return yScale(val);
			})
			.attr("r", function(d) {return radiusScale(d.goals);})
			.attr("fill", colorMap[player.name]);

			circles.append("title").text(function(d) {return prettyText(d)});
		});
});
};

function totalGoals(player) {
	return player.performances.reduce(function(a, b) {
		return {goals: a.goals + b.goals};
	}).goals
}

function createSkelton(className) {
	return d3.select("." + className)
	.append("svg")
	.attr("width", w)
	.attr("height", h);
};

function sanitize(performances) {
	return performances.filter(function(d) {
		return d.goals != null;
	});
};

function prettyText (p) {
	return [p.date, p.opponent, p.competition].join(", ") + 
	" Goals: " + p.goals + ",Assists: " + p.assists;
}