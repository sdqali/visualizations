var w = 1000;
var h = 600;
var padding = 30;
var colorMap = {
    "Cristiano Ronaldo": "#1f77b4",
    "Lionel Messi": "#637939"
};

var Timeseries = function() {};


Timeseries.prototype.draw = function(className) {
    var vis = createSkelton(className);
    d3.json("data/processed_data.json", function(players) {
		var maxGames = maxGamesAmong(players);
		var maxGoals = maxGoalsAmong(players);

		var yAxisScale = d3.scale.linear().domain([0, maxGoals]).range([h - 2 * padding, 2 * padding]);

		var xAxisScale = d3.scale.linear().domain([0, maxGames]).range([2 * padding, w - padding]);

		var radiusScale = d3.scale.linear().domain([0, maxGoals]).range([1, maxGoals]);

		players.forEach(function(player) {
				    var performances = sanitize(player.performances);
				    var circles = vis.append("g")
					.selectAll("circle")
					.data(performances)
					.enter()
					.append("circle")
					.attr("cx", function(d, i) {
						  return xAxisScale(i);
					      }).attr("cy", function(d, i) {
							  var ps = performances.slice(0, i + 1);
							  var val = ps.reduce(function(a, b) {
										  return {
										      goals: a.goals + b.goals
										  };
									      }).goals;
							  return yAxisScale(val);
						      }).attr("r", 2).attr("fill", colorMap[player.name]);

				    circles.append("title").text(function(d) {
								     return prettyText(d);
								 });

				    var axes = new Axis(vis)
					.withPadding(padding)
					.withXScale(xAxisScale)
					.withYScale(yAxisScale)
					.withXLabelText("Games")
					.withYLabelText("Cumulative Goals");
				    axes.draw();
				});

	    });
};

function maxGoalsAmong(players) {
    var goals = players.map(function(p) {
				return totalGoalsBy(p);
			    });
    return d3.max(goals, function(d) {
		      return d;
		  });
};

function maxGamesAmong(players) {
    var games = players.map(function(p) {
				return p.performances.length;
			    });
    return d3.max(games, function(d) {
		      return d;
		  });
};

function totalGoalsBy(player) {
    return d3.sum(player.performances.map(function(a) {
					      return a.goals;
					  }));
}

function createSkelton(className) {
    return d3.select("." + className).append("svg").attr("width", w).attr("height", h);
};

function sanitize(performances) {
    return performances.filter(function(d) {
				   return d.goals != null;
			       });
};

function prettyText(p) {
    return [p.date, p.opponent, p.competition].join(", ") + " Goals: " + p.goals + ",Assists: " + p.assists;
};