$(document).ready(function () {
    var height = 500;
    var width = $("#example").width();


    var svg = d3.select("#example").append("svg")
            .attr("width", width)
            .attr("height", height);

    var color = d3.scaleOrdinal(d3.schemeCategory20);

    var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(width / 2, height / 2));

    d3.json("data/ForceCollapse.json", function (error, graph) {
        if (error)
            throw error;


        var link = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("stroke-width", function (d) {
                    return Math.sqrt(d.value);
                });

        svg.append("svg:defs").selectAll("marker")
                .data(["end"])      // Different link/path types can be defined here
                .enter().append("svg:marker")    // This section adds in the arrows
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 12)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");
        
        var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("r", 5)
                .attr("fill", function (d) {
                    return color(d.group);
                })
                .call(d3.drag()
                        .on("start", dragstarted)
                        .on("drag", dragged)
                        .on("end", dragended));

        node.append("title")
                .text(function (d) {
                    return d.id;
                });

        simulation
                .nodes(graph.nodes)
                .on("tick", ticked);

        simulation.force("link")
                .links(graph.links);

        function ticked() {
            link
                    .attr("x1", function (d) {
                        return d.source.x;
                    })
                    .attr("y1", function (d) {
                        return d.source.y;
                    })
                    .attr("x2", function (d) {
                        return d.target.x;
                    })
                    .attr("y2", function (d) {
                        return d.target.y;
                    });

            node
                    .attr("cx", function (d) {
                        return d.x;
                    })
                    .attr("cy", function (d) {
                        return d.y;
                    });
        }
    });

    function dragstarted(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active)
            simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    var zoomer = d3.zoom()
            .scaleExtent([1, 10])
            .on("zoom", zoomFn);
    function zoomFn() {

        svg.attr("transform", d3.event.transform);
    }
});
