$("#hamilton-dot").submit(function(e) {
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
        hamilton.name = response.name;
        hamilton.attributes = response.attributes;
        $.each(response.nodes, function (idx) {
          var node = response.nodes[idx];
          console.log("node: " + node.name);
          var newVertex = new Hamilton.Vertex({id:node.name, x:x, y:y});
          newVertex.attributes = node.attributes;
          hamilton.addVertex(newVertex);

        });

        $.each(response.edges, function (idx) {
          var edge = response.edges[idx]
          console.log("edge: " + edge.source + " " + edge.destination);
          var newEdge = new Hamilton.Edge({u_id: edge.source, v_id: edge.destination});
          newEdge.attributes = edge.attributes;
          hamilton.addEdge(newEdge);
        });

        renderer = new Layout(hamilton);
        renderer.layout();
        renderer.applyLayout();
        hamilton.draw();
        $('#spotlight').fadeOut(200);
      }
    }
  });
  return false;
});
