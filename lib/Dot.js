jQuery(function ($) {
  $("#hamilton-dot").on('submit', function (e) {
    $.ajax('/parse', {
      type: "POST",
      dataType: "json",
      data: {
        dotfile: $("#dot-code").val()
      },
      success: function (response, status) {
				var renderer;
        if (response.status != "success") {
          console.log("not success");
          // parse error or something
        } else {
          var x = 150, y = 150;
          // we good
          hamilton.clear();

          $.each(response.nodes, function (idx) {
            var node = response.nodes[idx];
            console.log("node: " + node.name);
            hamilton.addVertex(node.name, x, y);
            x += 25;
            y -= 25;
          });

          $.each(response.edges, function (idx) {
            var edge = response.edges[idx]
            console.log("edge: " + edge.source + " " + edge.destination);
            hamilton.addEdge(edge.source, edge.destination);
          });
					renderer = new Layout(hamilton);
					renderer.layout();
					renderer.applyLayout();
          hamilton.draw();
        }
      }});
    return false;
  });


});
