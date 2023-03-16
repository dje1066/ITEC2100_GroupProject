function tornadoChart() {
    var margin = {top: 20, right: 30, bottom: 40, left: 100},
      width = 800 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  
    var x = d3.scale.linear()
        .range([0, width]);
  
    var y = d3.scale.ordinal()
        .rangeRoundBands([0, height], 0.1);
  
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(10)
  
  
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(0)
  
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var maxvalue;
  
  
    function chart(selection) {
      selection.each(function(data) {
  
  maxvalue = (Math.abs(d3.extent(data, function(d) { return d.interactions; })[0]) > Math.abs(d3.extent(data, function(d) { return d.interactions; })[1])) ? Math.abs(d3.extent(data, function(d) { return d.interactions; })[0]) : Math.abs(d3.extent(data, function(d) { return d.interactions; })[1]);
  
        x.domain([maxvalue*-1, maxvalue]);
        y.domain(data.map(function(d) { return d.age; }));
  
        var minInteractions = Math.max.apply(Math, data.map(function(o){return o.interactions;}))*-1;
        yAxis.tickPadding(Math.abs(x(minInteractions) - x(0)) + 10);
  
        var bar = svg.selectAll(".bar")
            .data(data)
  
        bar.enter().append("rect")
            .attr("class", function(d) { return "bar bar--" + (d.interactions < 0 ? "negative" : "positive"); })
            .attr("x", function(d) { return x(Math.min(0, d.interactions)); })
            .attr("y", function(d) { return y(d.age); })
            .attr("width", function(d) { return Math.abs(x(d.interactions) - x(0)); })
            .attr("id", function(d){ return d.age})
            .attr("style", function(d){ return d.colour == null ? "" : "fill:" + d.colour;})
            .attr("height", y.rangeBand())
  
        bar.enter().append('text')
            .attr("text-anchor", "end")
            .attr("x", function(d,i) {
  
                var titlePlacement = Math.abs(x(d.interactions) - x(0)) + x(Math.min(0, d.interactions))-5;
                if( Math.abs(x(d.interactions) - x(0)) < 30 && d.interactions > 0)
                 titlePlacement += 30;
                else if(d.interactions < 0) //Negative placement
                {
                  titlePlacement = x(Math.min(0, d.interactions))-5;
  
                }
  
  
                return titlePlacement;
            })
            .attr("y", function(d,i) {
                return y(d.age) + (y.rangeBand() / 2);
            })
            .attr("dy", ".35em")
            .text(function (d) { return d.interactions; })
  
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + x(0) + ",0)")
            .call(yAxis);
  
      });
  
    }
  
    return chart;
  }
  