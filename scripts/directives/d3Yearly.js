(function () {
  'use strict';

  angular.module('baltimoreMurals.directives')
    .directive('d3Year', ['d3', function(d3) {
      return {
        restrict: 'EA',
        scope: {
          data: "=",
          
        },
        link: function(scope, iElement, iAttrs) {

          d3.csv("data1987_2016.csv", function(error, data) {
              if (error) throw error;

              //setup scales, and the "pack"
              var margin = {top: 20, right: 20, bottom: 30, left: 40},
                  width = 960 - margin.left - margin.right,
                  height = 500 - margin.top - margin.bottom;

              var xScale = d3.scale.ordinal()
                  .rangeRoundBands([0, width], .1);

              var yScale = d3.scale.linear()
                  .range([height, 0]);

              var colorScale = d3.scale.linear()
                                .domain([0, 19])
                                .range(["gray", "blue"]);

              //setup axis
              var xAxis = d3.svg.axis()
                  .scale(xScale)
                  .orient("bottom");

              var yAxis = d3.svg.axis()
                  .scale(yScale)
                  .ticks(8)
                  .orient("left");

              //setup scales
              var svg = d3.select("#year-chart").append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

              //count murals per year
              var tally = {};
                data.forEach(function(d){
                  d.YEAR = +d.YEAR;
                  var year = d.YEAR;
                  tally[year] = (tally[year]||0) + 1;
                });

               var dataPairs = [];

                for (var yr in tally) {
                    if (tally.hasOwnProperty(yr)) {
                        dataPairs.push({yr: yr, count: tally[yr]});
                    }
                }
                data = dataPairs;

                //mark scale domains based on max
                xScale.domain(data.map(function(d) {return d.yr; }) ); 
                yScale.domain([0, d3.max(data, function(d) {return d.count; })]);
                colorScale.domain([0, d3.max(data, function(d) {return d.count; })]);

                //append a rectangle for each year(between 1987 and 2011)
                svg.selectAll('rect')
                  .data(data)
                  .enter()
                    .append('rect')
                    .attr('height', 0)
                    .attr('y', height)
                    .transition().duration(1500)
                    .delay(function (d, i) {return i * 200;})
                    .attr('x', function (d, i){ return xScale(d.yr)})
                    .attr('y', function (d){ return yScale(d.count); })
                    .attr('width', xScale.rangeBand())
                    .attr('height', function (d) { return height - yScale(d.count); } )
                    .style("fill", function (d){ return colorScale(d.count); });
                
                //add the text counter to the top of the rect
                svg.selectAll('text')
                      .data(data)
                      .enter()
                        .append('text')
                        .attr("opacity", "0")
                        .transition().duration(2300)
                        .delay(function (d, i) {return i * 200;})
                        .text(function (d){ return d.count; })
                        .attr('x', function (d) { return xScale(d.yr) + xScale.rangeBand()/2; })
                        .attr('y', function (d) { return yScale(d.count) + 15; })
                        .style("fill", "white")
                        .attr("opacity", "1")
                        .style("text-anchor", "middle");


                //append x axis
                svg.append('g')
                  .attr('class', 'x axis')
                  .attr('transform', "translate(0,"+ height +")")
                  .attr("fill", "white")
                  .attr("font-size", "12")
                  .call(xAxis);

                //append y axis
                svg.append("g")
                  .attr("class", "y axis")
                  .attr("fill", "white")
                  .call(yAxis);
             
            }); //end of data load function

        }
      };
    }]);

}());
