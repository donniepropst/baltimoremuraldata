(function () {
  'use strict';

  angular.module('baltimoreMurals.directives')
    .directive('d3Artists', ['d3', function(d3) {
      return {
        restrict: 'EA',
        scope: {
          data: "=",
          
        },
        link: function(scope, iElement, iAttrs) {

    
          d3.csv("data1987_2016.csv", function(error, data) {
              if (error) throw error;

               var margin = {top: 20, right: 20, bottom: 30, left: 40},
                  width = 960 - margin.left - margin.right,
                  height = 600 - margin.top - margin.bottom;

              var color  = d3.scale.category10(); //color category

              var pack = d3.layout.pack()
                .size([width, height])
                .sort(null)
                .value(function(d){return d.value; })
                .padding(1.5);

              var canvas = d3.select("#frequency-chart")
                .append("svg")
                .attr("width", "100%")
                .attr("height", height)
                .append("g");
                  //.attr("transform", "translate(50,50)");  
               // .attr("class", "bubble");
             
             // Define the div for the tooltip
            var div = d3.select("body").append("div") 
                .attr("class", "tooltip")       
                .style("opacity", 0);

              var newData = processData(data);
              data = null;
              
              var nodes = pack.nodes(newData)
                .filter(function(d){return !d.children;});

              var node = canvas.selectAll(".node")
                .data(nodes)
                .enter()
                .append("g")
                  .attr("class", "node")
                  .attr("transform", function(d){return "translate("+d.x+","+d.y+")";});

              node.append("circle")
                  .attr("r", 0 )
                  .attr("fill", function(d){ return color(d.value);})
                  .attr("opacity", ".8")
                  .on("mouseover",function(d){
                    d3.select(this).style({opacity:'1'});
                    div.transition()    
                      .duration(200)    
                      .style("opacity", .9);   
                    div.html(d.name)  
                      .style("left", (d3.event.pageX) + "px")   
                      .style("top", (d3.event.pageY - 28) + "px");   
                  })
                  .on("mouseout", function(d){
                     d3.select(this).style({opacity:'.8'});
                      div.transition()    
                        .duration(200)    
                        .style("opacity", 0);   
                      div.html(d.name)  
                        .style("left", (d3.event.pageX) + "px")   
                        .style("top", (d3.event.pageY - 28) + "px");   
                  })
                  .transition().duration(200)
                  .delay(function(d, i){return i * 35;})
                  .attr("r", function(d){return d.r;});
              
              node.append("text")
                .attr("dx", 0)
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .attr("opacity", 0)
                .text(function(d) { return d.value; })
                .transition().duration(200)
                .delay(function(d, i){return i * 35;})
                .attr("opacity", 1);

                  function processData(data){
                    var tally = {};
                    data.forEach(function(d){
                      var name = d.artistFirstName + " " + d.artistLastName;
                      tally[name] = (tally[name]||0) + 1;
                    });

                   var dataPairs = [];

                    for (var name in tally) {
                        if (tally.hasOwnProperty(name)) {
                            dataPairs.push({name: name, value: tally[name]});
                        }
                    }
                    //console.log(dataPairs[1]);
                    //return dataPairs;
                    return {children: dataPairs};
                  }
                           
             
            }); //end of data load function

        }
      };
    }]);

}());
