(function () {
  'use strict';

  angular.module('baltimoreMurals.directives')
    .directive('d3Map', ['d3', function(d3) {
      return {
        restrict: 'EA',
        scope: {
          data: "=",
        },
        link: function(scope, iElement, iAttrs) {

          // Setup map
          var map = new google.maps.Map(d3.select("#map").node(), {
            zoom: 13,
            center: new google.maps.LatLng( 39.299236,  -76.609383),
            mapTypeId: google.maps.MapTypeId.ROADMAP
          });

          var svg = d3.select("#map")
              .append("svg")
              .attr("width", "100%")
              .attr("height", 500);

          //setup scales
          var sizeScale =  d3.scale.linear()
            .domain([0,10])
            .range([5,9]);

          //load data
          d3.csv("data1987_2016.csv", function(error, data) {
              if (error) throw error;

              data = processData(data); //process data(count duplicates and remove addresses)

               var overlay = new google.maps.OverlayView();


               overlay.onAdd = function() {
                var layer = d3.select(this.getPanes().overlayMouseTarget)
                    .append("div")
                    .attr("class", "stations");

                overlay.draw = function() {
                var projection = this.getProjection(),
                      padding = 19;

                //create a marker for each location
               var marker = layer.selectAll("svg")
                .data(data)
                .each(transform) 
                  .enter().append("svg")
                    .each(transform)
                    .attr("class", "marker");

              //draw circle on marker
              marker.append("circle")
                  .attr("r", function(d){
                      if(sizeScale(d.count) < 5)return sizeScale(count) + 1; return sizeScale(d.count);})
                  .attr("cx", padding)
                  .attr("cy", padding)
                  .style("fill", "blue");
                
            
              //Adding the count label to each circle
              marker.append("text")
                  .attr("x", padding)
                  .attr("y", padding + 3)
                  .attr("text-anchor", "middle")
                  .text(function(d) { return d.count; })
                  .style("fill", "white");


                function transform(d) {
                  d = new google.maps.LatLng(d.latitude, d.longitude);
                  d = projection.fromLatLngToDivPixel(d);
                  return d3.select(this)
                      .style("left", (d.x - padding) + "px")
                      .style("top", (d.y - padding) + "px");
                }


               };

              };

              overlay.setMap(map);
            }); //end of data load function
        }
      };
    }]);
  function processData(data){
    var coordinatePairs = [];
      var tally = {};
      data.forEach(function (d){

        var temp = String(d.Coordinates);

        var points = temp.split("\n");
        points.splice(0,2);
        points = points[0].split(",");
        points[0] = points[0].substring(1, points[0].length);
        points[1] = points[1].substring(0, points[1].length-1);

          var key = points[0] + " " + points[1];
          tally[key] = (tally[key] || 0) + 1;
          if(tally[key] == 1){
            coordinatePairs.push({ latitude: points[0], longitude: points[1], count: 0});
          }
      });
     
      coordinatePairs.forEach(function (point){
          var key = point.latitude + " " + point.longitude;
          point.count = tally[key];
      });
      return coordinatePairs;
  }
}());
