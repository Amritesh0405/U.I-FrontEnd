$(document).ready(function () {
    var data = [//get the data
        {
            "State": "CA",
            "Under 5 Years": 2704659,
            "5 to 13 Years": 4499890,
            "14 to 17 Years": 2159981,
            "18 to 24 Years": 3853788,
            "25 to 44 Years": 10604510,
            "45 to 64 Years": 8819342,
            "65 Years and Over": 4114496
        },
        {
            "State": "TX",
            "Under 5 Years": 2027307,
            "5 to 13 Years": 3277946,
            "14 to 17 Years": 1420518,
            "18 to 24 Years": 2454721,
            "25 to 44 Years": 7017731,
            "45 to 64 Years": 5656528,
            "65 Years and Over": 2472223
        },
        {
            "State": "NY",
            "Under 5 Years": 1208495,
            "5 to 13 Years": 2141490,
            "14 to 17 Years": 1058031,
            "18 to 24 Years": 1999120,
            "25 to 44 Years": 5355235,
            "45 to 64 Years": 5120254,
            "65 Years and Over": 2607672
        },
        {
            "State": "FL",
            "Under 5 Years": 1140516,
            "5 to 13 Years": 1938695,
            "14 to 17 Years": 925060,
            "18 to 24 Years": 1607297,
            "25 to 44 Years": 4782119,
            "45 to 64 Years": 4746856,
            "65 Years and Over": 3187797
        },
        {
            "State": "IL",
            "Under 5 Years": 894368,
            "5 to 13 Years": 1558919,
            "14 to 17 Years": 725973,
            "18 to 24 Years": 1311479,
            "25 to 44 Years": 3596343,
            "45 to 64 Years": 3239173,
            "65 Years and Over": 1575308
        },
        {
            "State": "PA",
            "Under 5 Years": 737462,
            "5 to 13 Years": 1345341,
            "14 to 17 Years": 679201,
            "18 to 24 Years": 1203944,
            "25 to 44 Years": 3157759,
            "45 to 64 Years": 3414001,
            "65 Years and Over": 1910571
        }
    ]

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);//.1 is innerpadding ( the point 1 is the the padding added to offset the bands from the edge of the interval.)

    var x1 = d3.scale.ordinal();

    var y = d3.scale.linear()
            .range([height, 0]);

    var color = d3.scale.ordinal()
            .range(["blue", "red", "green", "black", "pink", "orange", "brown"]);

    var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

    var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));// d3.format(".2s") : 1.5k   d3.format(".1s") : 2k   
    var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var ageNames = d3.keys(data[0]).filter(function (key) { // first goes to data[0] returns the first JavaScript object.Then the d3.keys() functionality looks at each key,value pair in the object and returns only the keys.
        return key !== "State";
    });
console.log(ageNames)
    data.forEach(function (d) {
//        console.log(d)
console.log("ages",d.ages)
        d.ages = ageNames.map(function (name) {
            console.log("ages",name)
            return {name: name, value: +d[name]};
            
        });
    });

    x0.domain(data.map(function (d) {
        return d.State;
    }));
    x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
    y.domain([0, d3.max(data, function (d) {
            return d3.max(d.ages, function (d) {
                return d.value;
            });
        })]);

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Population");

    var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "state")
            .attr("transform", function (d) {
                return "translate(" + x0(d.State) + ",0)";
            });

    state.selectAll("rect")
            .data(function (d) {
                return d.ages;
            })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function (d) {
                return x1(d.name);
            })
            .attr("y", function (d) {
                return y(d.value);
            })
            .attr("height", function (d) {
                return height - y(d.value);
            })
            .style("fill", function (d) {
                return color(d.name);
            });

    var legend = svg.selectAll(".legend")
            .data(ageNames.slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

    legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

    legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });
});

//var data = [//get the data
//        {
//            "State": "SVGA",
//            "AdPlays": 25,
//            "VideoPlays": 35,
//        },
//        {
//            "State": "XGA",
//            "AdPlays":100,
//            "VideoPlays": 75,
//        },
//        {
//            "State": "VGA",
//            "AdPlays": 135,
//            "VideoPlays": 150,
//        },
//            ]