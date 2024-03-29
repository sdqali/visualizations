var w = 1000;
var h = 600;
var padding = 30;
var colorMap = {
    "Cristiano Ronaldo": "#9E5167",
    "Lionel Messi": "#98DBED"
};

var Timeseries = function(jsonFile) {
    this.jsonFile = jsonFile;
};

var scoreFunction;

Timeseries.prototype.draw = function(className, labels, scoreF, filterF) {
    scoreFunction = scoreF;
    var vis = createSkelton(className);
    d3.json(this.jsonFile, function(players) {
		players = sanitize(players, filterF);
		var maxGames = maxGamesAmong(players);
		var maxGoals = maxGoalsAmong(players);

		var yAxisScale = d3.scale.linear()
		    .domain([0, maxGoals])
		    .range([h - 2 * padding, 2 * padding]);

		var xAxisScale = d3.scale.linear()
		    .domain([0, maxGames])
		    .range([2 * padding, w - padding]);

		var radiusScale = d3.scale.linear()
		    .domain([0, maxGoals])
		    .range([1, maxGoals]);

		players.forEach(function(player) {
				    var performances = player.performances;
				    var circles = vis.append("g")
					.selectAll("circle")
					.data(performances)
					.enter()
					.append("circle")
					.attr("cx", function(d, i) {
						  return xAxisScale(i);
					      })
					.attr("cy", function(d, i) {
							  var ps = performances.slice(0, i + 1);
							  var score = d3.sum(ps, function(d){
									       return scoreFunction(d);
									   });
							  return yAxisScale(score);
					      })
					.attr("r", 2)
					.attr("stroke",  colorMap[player.name])
					.attr("fill", colorMap[player.name]);

				    circles.append("title").text(function(d) {
								     return prettyText(d);
								 });

				    var axes = new Axis(vis)
					.withPadding(padding)
					.withXScale(xAxisScale)
					.withYScale(yAxisScale)
					.withXLabelText(labels.xlabel)
					.withYLabelText(labels.ylabel);
				    axes.draw();

				    var legend = vis.append("g");
				    legend.append("text")
					.text(player.name)
					.attr("fill", colorMap[player.name]);
				    legend.attr("transform",
						"translate(" + 4 * padding + "," +  (3 + players.indexOf(player)) * padding/2 +")");
				});

	    });
};

function maxGoalsAmong(players) {
    var goals = players.map(function(p) {
				return totalScoreBy(p);
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

function totalScoreBy(player) {
    return d3.sum(player.performances.map(function(a) {
					      return scoreFunction(a);
					  }));
}

function createSkelton(className) {
    return d3.select("." + className)
	.append("svg")
	.attr("width", w)
	.attr("height", h);
};

function sanitize(players, filterF) {
    players.forEach(function(player) {
			var ps = player.performances.filter(function(pr) {
								return scoreFunction(pr) != null;
							    });
			if(filterF) {
			    ps = ps.filter(filterF);
			};
			player.performances = ps;
		    });
    return players;
};

function prettyText(p) {
    return [p.date, p.opponent, p.competition].join(", ") + " Goals: " + p.goals + ",Assists: " + p.assists;
};