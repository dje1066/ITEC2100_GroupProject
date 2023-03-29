$(document).ready(function () {
  
    // Get the data in JSON format.
    var user_id = $("#tabContainer").data("user")
    d3.csv("/users/" + user_id + "/workouts/analyze.json", function(error, json) {
        data = json;
  
        // Define graph area and margin areas.
        var margin = {top: 20, right: 10, bottom: 20, left: 10},
                graphHeight = 250 - margin.top - margin.bottom,
                barWidth = 80,
                graphWidth = ((barWidth + 10) * data.length);
  
        // Create the SVG graph.
        var svg = d3.select("#graphContainer").insert("svg", "#training_stats")
                .attr("class", "chart")
                .attr("width", graphWidth + margin.left + margin.right)
                .attr("height", graphHeight + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
        // Set the Y scale.
        var y = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d.load_volume; })])
                .range([0, graphHeight]);
  
        // Set the X scale.
        var x = d3.scale.linear().domain([0, data.length]).range([0, graphWidth]);
  
        // Draw the bars.
        svg.selectAll("rect")
                .data(data).enter().append("rect").sort(function(d) { return d3.ascending(d.date); })
                .attr("x", function(d, i) { return x(i); })
                .attr("y", function(d) { return graphHeight - y(d.load_volume); })
                .attr("height", function(d) { return y(d.load_volume); })
                .attr("width", barWidth)
                .attr("fill", "#2d578b");
  
        // Draw the text.
        svg.selectAll("text").data(data)
                .enter().append("text")
                .attr("x", function(d, i) { return x(i) + barWidth/2; })
                .attr("y", graphHeight)
                .attr("dy", function(d) { return -y(d.load_volume) + 20; })
                .attr("text-anchor", "middle")
                .attr("class", "bar")
                .text(function(d) { return d.load_volume; });
  
      // Place Y axis labels in g element for easy maneuvering 
        var label_group = svg.append("g").attr("class", "labelContainer").attr("transform", "translate(0,15)");
  
        // Draw the labels.
        label_group.selectAll("text").data(data).enter().append("text")
                .attr("x", function(d, i) { return x(i) + (barWidth / 2) - 15; })
                .attr("y", graphHeight)
                .attr("class", "label")
                .text(function(d) { return d.date; });
  
                  // Request new data asynchronously for chosen Metric and Category options on select dropdown menu
                  $("#metric_select, #category_select").on('change', function () {
                      var metric = $("#metric_select option:selected").attr("value");
                      var category = $("#category_select option:selected").attr("value");
                      var user_id = $("#tabContainer").data("user");
                          $.ajax({
                              url: "/users/" + user_id +"/workouts/analyze.json",
                              data: { metric: metric, category: category },
                              success: function(data) {
  
                                   // Set the new Y scale.
                                    var y = d3.scale.linear()
                                        .domain([0, d3.max(data, function(d) { return d.load_volume; })])
                                        .range([0, graphHeight]);
                                  
                                  // Re-select chart elements and bind them to new data
                                  var rect = svg.selectAll("rect").data(data, function(d) { return d.date; });
                                  var text = svg.selectAll("text").data(data, function(d) { return d.date; });
                                  var label = svg.selectAll(".labelContainer text").data(data, function(d) { return d.date; });
                                  var delay = function(d, i) { return i * 50; };
                                  
                                  // Update the rects.
                                  rect.transition().duration(750)
                                      .delay(delay)
                                      .attr("x", function(d, i) { return x(i); })
                                      .attr("y", function(d) { return graphHeight - y(d.load_volume); })
                                      .attr("height", function(d) { return y(d.load_volume); });
                                      
                                  // Update the text.
                                  text.transition().duration(750)
                                      .delay(delay)
                                      .attr("x", function(d, i) { return x(i) + barWidth/2; })
                                      .attr("y", graphHeight)
                                      .attr("dy", function(d) { return -y(d.load_volume) + 20; })
                                      .attr("text-anchor", "middle")
                                      .text(function(d) { return d.load_volume; });
                                  
                                    // Update the Y axis labels.
                                    label.transition().duration(750)
                                        .delay(delay)
                                        .attr("x", function(d, i) { return x(i) + (barWidth / 2) - 15; })
                                        .attr("y", graphHeight)
                                      .text(function(d) { return d.date; });
                                  
                                  // Draw new rects
                                  rect.enter().append("rect")
                                            .attr("x", function(d, i) { return x(i); })
                                            .attr("y", function(d) { return graphHeight - y(d.load_volume); })
                                            .attr("height", function(d) { return y(d.load_volume); })
                                            .attr("width", barWidth)
                                            .attr("fill", "#2d578b");
      
                                  // Draw new texts
                                  text.enter().append("text")
                                      .attr("x", function(d, i) { return x(i) + barWidth/2; })
                                      .attr("y", graphHeight)
                                      .attr("dy", function(d) { return -y(d.load_volume) + 20; })
                                      .attr("text-anchor", "middle")
                                      .attr("class", "bar")
                                        .style("fill", "white")
                                      .text(function(d) { return d.load_volume; });
                      
                                  // Draw new labels.
                                  label.enter().append("text")
                                       .attr("x", function(d, i) { return x(i) + (barWidth / 2) - 15; })
                                        .attr("y", graphHeight)
                                        .attr("transform", "translate(0,15)")
                                        .attr("class", "label")
                                      .text(function(d) { return d.date; });
                                  
                                      rect.exit().remove();
                                      text.exit().remove();
                                      label.exit().remove();
  
                                      // end success callback
                                      },
                                      error: function (xhr, textStatus) {
                                          if (xhr.status == 500) {
                                              alert('Server error: ' + textStatus)
                                          }
                                      // end error handling
                                      }
                          // end ajax
                          });
                  // end on select change event listener
                  });	
      // end original data request			
      });
  // end document ready	
  });