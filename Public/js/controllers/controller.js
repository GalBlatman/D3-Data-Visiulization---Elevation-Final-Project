app.controller('d3Ctrl', function($scope, $http, d3Service) {

	
	var drawForceChart = function(data) {
		// delete chart
		var svg = d3.select("svg"),
			width = +svg.attr("width"),
			height = +svg.attr("height");

		var width = 960,
    		height = 600,
    		radius = 6;

		var color = d3.scaleOrdinal(d3.schemeCategory10);

		var simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function(d) { return d.id; }))
			.force("charge", d3.forceManyBody())
			.force("center", d3.forceCenter(width / 2, height / 2));
		
		var ready = function(data) {
			// console.log(Object.keys(data));
			// console.log(JSON.stringify(data));
			var link = svg.append("g")
				.selectAll("line")
				.data(data[0].links)
				.enter().append("line")
				.attr("class", "links")
				.attr("stroke-width", function(d) { return Math.sqrt(d.value); });

			var node = svg.append("g")
				.selectAll("circle")
				.data(data[0].nodes)
				.enter().append("circle")
				.attr("class", "nodes")
				.attr("r", 5)
				.attr("fill", function(d) { return color(d.group); })
				.call(d3.drag()
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended))
				.on('dblclick', connectedNodes);

			node.append("title")
				.text(function(d) { return d.id; });

			simulation
				.nodes(data[0].nodes)
				.on("tick", ticked);

			simulation.force("link")
				.links(data[0].links);

			function ticked() {
				link
					.attr("x1", function(d) { return d.source.x; })
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });

				node
					.attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
        			.attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); });
			}

			//Toggle stores whether the highlighting is on
			var toggle = 0;
			//Create an array logging what is connected to what
			var linkedByIndex = {};
			for (i = 0; i < data[0].nodes.length; i++) {
				linkedByIndex[i + "," + i] = 1;
			};
			data[0].links.forEach(function (d) {
				linkedByIndex[d.source.index + "," + d.target.index] = 1;
			});
			//This function looks up whether a pair are neighbours
			function neighboring(a, b) {
				return linkedByIndex[a.index + "," + b.index];
			}
			function connectedNodes() {
				
				if (toggle === 0) {
					//Reduce the opacity of all but the neighbouring nodes
					d = d3.select(this).node().__data__;
					// console.log(d3.select(this)._groups[0][0]);
					node.attr("opacity", function (o) {
						return neighboring(d, o) | neighboring(o, d) ? 1 : 0.1;
					});
					link.attr("opacity", function (o) {
						return d.index==o.source.index | d.index==o.target.index ? 1 : 0.1;
					});
					//Reduce the op
					toggle = 1;
				} else {
					//Put them back to opacity=1
					node.attr("opacity", 1);
					link.attr("opacity", 1);
					toggle = 0;
				}
			}

			function dragstarted(d) {
				if (!d3.event.active) simulation.alphaTarget(0.3).restart();
				d.fx = d.x;
				d.fy = d.y;
			}

			function dragged(d) {
				d.fx = d3.event.x;
				d.fy = d3.event.y;
			}

			function dragended(d) {
				if (!d3.event.active) simulation.alphaTarget(0);
				d.fx = null;
				d.fy = null;
			}

			var optArray = [];
			for (var i = 0; i < data[0].nodes.length; i++) {
				optArray.push(data[0].nodes[i].id);
			}
			optArray = optArray.sort();

			$scope.names=optArray;
			// console.log($scope.names);

			$(function () {
				$("#search").autocomplete({
					source: optArray
				});
				return $scope.nodeName;
			});
			console.log("returned", $scope.nodeName);
			$scope.searchNode = function() {
				var nodes = data[0].nodes;
				var node = svg.selectAll("circle");
				var selectedVal = _.find(nodes, function(node) { return node.id === $scope.nodeName; });
				console.log("clicked", $scope.nodeName);
				if (selectedVal == "none") {
					console.log("no name");
					node.attr("stroke", "white").attr("stroke-width", "1");
				} else {
					var selected = node.filter(function (d, i) {
						return d.id != selectedVal.id;
					});
					console.log(selected);
					selected.attr("opacity", "0");
					var link = svg.selectAll("line")
					link.attr("opacity", "0");
					d3.selectAll("circle, line").transition()
						.duration(10000)
						.attr("opacity", 1);
				}
			}
			var graphRec = JSON.parse(JSON.stringify(data));
			//adjust threshold
			var value = $scope.value;
			$scope.threshold = function(value) {
				data[0].links.splice(0, data[0].links.length);

					for (var i = 0; i < graphRec.links.length; i++) {
						if (graphRec.links[i].value > value) {data[0].links.push(graphRec.links[i]);}
					}
				restart();
			}


			//Restart the visualisation after any node and link changes

			function restart() {
				
				link = link.data(data[0].links);
				link.exit().remove();
				link.enter().insert("line", "g").attr("class", "link");
				node = node.data(data[0].nodes);
				node.enter().insert("circle", "g").attr("class", "node").attr("r", 5).call(force.drag);
				simulation.force.start();
			}

		}
		ready(data);
		// d3.json("miserables.json", ready);
	};
	// drawForceChart(data);
	d3Service.getAll().success(function (data) {
		// console.log('heyfromthe controller', data[0].links)
		// $scope.data = data;
		
		drawForceChart(data);

        //   console.log('yo from the factory', data[0].links)
        //   angular.copy(data, d3Service.data);
        });
})