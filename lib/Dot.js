function currymeister(layout) {
  return function(e) {
    $.ajax('/parse', {
      type: "POST",
      dataType: "json",
      data: {
        dotfile: $("#dot-code").val()
      },
      success: function (response, status) {
        var renderer;
        if (response.status != "success") {
          // parse error or something
        } else {
          var x = 50, y = 50;
          var vertices = hamilton.vertices;
          // we good
          hamilton.clear();
          hamilton.name = response.name;
          hamilton.type = "graph";
          hamilton.attributes = response.attributes;
          $.each(response.nodes, function (idx) {
            var node = response.nodes[idx];
            var newVertex;
            if(layout === false) {
              if(node.name in vertices) {
                newVertex = vertices[node.name];
              } else {
                newVertex = new Hamilton.Vertex({id:node.name, x:x, y:y});
                x += 50;
                y += 50;
              }
            } else {
              newVertex = new Hamilton.Vertex({id:node.name, x:x, y:y});
              x += 50;
              y += 50;
            }
            newVertex.attributes = node.attributes;
            hamilton.addVertex(newVertex);

          });

          $.each(response.edges, function (idx) {
            var edge = response.edges[idx]
            var newEdge = new Hamilton.Edge({u_id: edge.source, v_id: edge.destination});
            newEdge.attributes = edge.attributes;
            hamilton.addEdge(newEdge);
          });

          if(layout === true) {
            renderer = new Layout(hamilton);
            renderer.layout();
            renderer.applyLayout();
          }
          hamilton.draw();
          $('#spotlight').fadeOut(200);
        }
      }
    });
    return false;
  };
}

$('#dot-go').click(currymeister(false));
$('#reset-layout').click(currymeister(true));

$('#share-link').click(function (e) {
  $.ajax('/create', {
    type: 'POST',
    dataType: 'JSON',
    data: JSON.stringify({
      graph: hamilton.getGraph()
    }),
    contentType: 'application/json;charset=UTF-8',
    success: function (response, status) {
      var url;
      if (response.status != 'success') {
        // handle error or something
        console.log(response.message);
      } else {
        url = document.location.origin + "/" + response.uid;
        $('#permalink > a').attr("href", "/" + response.uid);
        clip.setText(url);
        $('#permalink > a').html(url);
      }
    }
  })
})
