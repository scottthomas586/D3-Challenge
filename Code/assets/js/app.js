// width
var width = parseInt(d3.select("#scatter").style("width"));

// height
var height = width - width / 4;

// Margin spacing 
var margin = 10;

// placing words
var placingWords = 110;

// padding for the text
var paddingBot = 30;
var paddingLeft = 30;

// Create the canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// radius for each dot
var radius;
function crGet() {
  if (width <= 530) {
    radius = 5;
  }
  else {
    radius = 10;
  }
}
crGet();


svg.append("g").attr("class", "xText");

var x_Text = d3.select(".xText");

function xTextRefresh() {
  x_Text.attr(
    "transform",
    "translate(" +
      ((width - placingWords) / 2 + placingWords) +
      ", " +
      (height - margin - paddingBot) +
      ")"
  );
}
xTextRefresh();

// poverty
x_Text
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// age
x_Text
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
// income
x_Text
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");


var left_Text_X = margin + paddingLeft;
var left_Text_Y = (height + placingWords) / 2 - placingWords;

svg.append("g").attr("class", "yText");

var y_Text = d3.select(".yText");

function yTextRefresh() {
  y_Text.attr(
    "transform",
    "translate(" + left_Text_X + ", " + left_Text_Y + ")rotate(-90)"
  );
}
yTextRefresh();

// obesity
y_Text
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// smokes
y_Text
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// lacks healthcare
y_Text
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");


// import CSV data 
d3.csv("assets/data/data.csv").then(function(data) {
  visualize(data);
});

// create a visualization function
function visualize(theData) {
  var cur_X = "poverty";
  var cur_Y = "obesity";

  var x_Min;
  var x_Max;
  var y_Min;
  var y_Max;

  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {
      
      var the_X;
      
      var the_State = "<div>" + d.state + "</div>";
      
      var the_Y = "<div>" + cur_Y + ": " + d[cur_Y] + "%</div>";
      
      if (cur_X === "poverty") {
        
        the_X = "<div>" + cur_X + ": " + d[cur_X] + "%</div>";
      }
      else {
        
        the_X = "<div>" +
          cur_X +
          ": " +
          parseFloat(d[cur_X]).toLocaleString("en") +
          "</div>";
      }
      
      return the_State + the_X + the_Y;
    });
  
  svg.call(toolTip);

  // change the min and max for x
  function xMinMax() {
    
    x_Min = d3.min(theData, function(d) {
      return parseFloat(d[cur_X]) * 0.90;
    });

    x_Max = d3.max(theData, function(d) {
      return parseFloat(d[cur_X]) * 1.10;
    });
  }

  // change the min and max for y
  function yMinMax() {
    // min will grab the smallest datum from the selected column.
    y_Min = d3.min(theData, function(d) {
      return parseFloat(d[cur_Y]) * 0.90;
    });

    // max will grab the largest datum from the selected column.
    y_Max = d3.max(theData, function(d) {
      return parseFloat(d[cur_Y]) * 1.10;
    });
  }

  // change the classes 
  function labelChange(axis, clickedText) {
    
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch the text just clicked to active.
    clickedText.classed("inactive", false).classed("active", true);
  }

  // Instantiate the Scatter Plot
  
  // grab the min and max values of x and y.
  xMinMax();
  yMinMax();

  var x_Scale = d3
    .scaleLinear()
    .domain([x_Min, x_Max])
    .range([margin + placingWords, width - margin]);
  var y_Scale = d3
    .scaleLinear()
    .domain([y_Min, y_Max])
    .range([height - margin - placingWords, margin]);

  var x_Axis = d3.axisBottom(x_Scale);
  var y_Axis = d3.axisLeft(y_Scale);

  // x and y tick counts.
    function tickCount() {
    if (width <= 500) {
      x_Axis.ticks(5);
      y_Axis.ticks(5);
    }
    else {
      x_Axis.ticks(10);
      y_Axis.ticks(10);
    }
  }
  tickCount();

  // append the axes in group elements
  svg
    .append("g")
    .call(x_Axis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - placingWords) + ")");
  svg
    .append("g")
    .call(y_Axis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + placingWords) + ", 0)");

  // make a grouping for dots and labels.
  var the_Circles = svg.selectAll("g theCircles").data(theData).enter();

    the_Circles
    .append("circle")
    .attr("cx", function(d) {
      return x_Scale(d[cur_X]);
    })
    .attr("cy", function(d) {
      return y_Scale(d[cur_Y]);
    })
    .attr("r", radius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })
    // hover rules
    .on("mouseover", function(d) {
      toolTip.show(d, this);
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select(this).style("stroke", "#e3e3e3");
    });

  
  the_Circles
    .append("text")
    .text(function(d) {
      return d.abbr;
    })
    .attr("dx", function(d) {
      return x_Scale(d[cur_X]);
    })
    .attr("dy", function(d) {
      return y_Scale(d[cur_Y]) + radius / 2.5;
    })
    .attr("font-size", radius)
    .attr("class", "stateText")
    // hover Rules
    .on("mouseover", function(d) {
      toolTip.show(d);
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {
      toolTip.hide(d);
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  // make the graph

  d3.selectAll(".aText").on("click", function() {

    var self = d3.select(this);

        if (self.classed("inactive")) {
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      if (axis === "x") {
        cur_X = name;

        xMinMax();

        x_Scale.domain([x_Min, x_Max]);

        svg.select(".xAxis").transition().duration(300).call(x_Axis);

        d3.selectAll("circle").each(function() {
          
          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return x_Scale(d[cur_X]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return x_Scale(d[cur_X]);
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
      else {

        cur_Y = name;

        yMinMax();

        y_Scale.domain([y_Min, y_Max]);

        svg.select(".yAxis").transition().duration(300).call(y_Axis);

        d3.selectAll("circle").each(function() {

          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return y_Scale(d[cur_Y]);
            })
            .duration(300);
        });

        d3.selectAll(".stateText").each(function() {

          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return y_Scale(d[cur_Y]) + radius / 3;
            })
            .duration(300);
        });

        labelChange(axis, self);
      }
    }
  });

  d3.select(window).on("resize", resize);

  function resize() {

    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    left_Text_Y = (height + placingWords) / 2 - placingWords;

    svg.attr("width", width).attr("height", height);

    x_Scale.range([margin + placingWords, width - margin]);
    y_Scale.range([height - margin - placingWords, margin]);

    svg
      .select(".xAxis")
      .call(x_Axis)
      .attr("transform", "translate(0," + (height - margin - placingWords) + ")");

    svg.select(".yAxis").call(y_Axis);

    tickCount();

    xTextRefresh();
    yTextRefresh();

    crGet();

    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return y_Scale(d[cur_Y]);
      })
      .attr("cx", function(d) {
        return x_Scale(d[cur_X]);
      })
      .attr("r", function() {
        return radius;
      });

    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return y_Scale(d[cur_Y]) + radius / 3;
      })
      .attr("dx", function(d) {
        return x_Scale(d[cur_X]);
      })
      .attr("r", radius / 3);
  }
}

