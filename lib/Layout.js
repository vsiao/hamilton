function Layout(graph) {
  this.canvas = graph.canvas;
  this.graph = graph;
  this.context = graph.canvas.getContext('2d');
  // numbers taken from http://snipplr.com/view/1950/graph-javascript-framework-version-001/
  this.iterations = 1000;
  this.maxRepulsiveForceDistance = 6;
  this.k = 2;
  this.c = 0.02;
  this.maxVertexMovement = 0.5;
}

Layout.prototype.layout = function () {
  this.prepare();
  for (var i = 0; i < this.iterations; i++) {
    this.iterate();
  }
  this.calcBounds();

};

Layout.prototype.applyLayout = function () {
  this.radius = 20;
  this.factorX = (this.canvas.width/2 - 2 * this.radius) /
        (this.graph.layoutMaxX - this.graph.layoutMinX);
  this.factorY = (this.canvas.height/2 - 2 * this.radius) /
        (this.graph.layoutMaxY - this.graph.layoutMinY);

  for ( id in this.graph.vertices ) {
    var v = this.graph.vertices[id];
    v.props.x += (v.layoutPosX - this.graph.layoutMinX) * this.factorX + this.radius
    v.props.y += (v.layoutPosY- this.graph.layoutMinY) * this.factorY + this.radius

    v.props.x = Math.min(Math.floor((v.props.x+25)/50)*50, this.canvas.width-50);
    v.props.y = Math.min(Math.floor((v.props.y+25)/50)*50, this.canvas.height-50);
  }

};

Layout.prototype.prepare = function () {
  for ( id in this.graph.vertices) {
    var node = this.graph.vertices[id];
    node.layoutPosX = 0;
    node.layoutPosY = 0;
    node.layoutForceX = 0;
    node.layoutForceY = 0;
  }
};

Layout.prototype.calcBounds = function () {
  var minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity;
  for (id in this.graph.vertices) {
    var x = this.graph.vertices[id].layoutPosX;
    var y = this.graph.vertices[id].layoutPosY;

    if(x > maxx) maxx = x;
    if(x < minx) minx = x;
    if(y > maxy) maxy = y;
    if(y < miny) miny = y;
  }
  this.graph.layoutMinX = minx;
  this.graph.layoutMaxX = maxx;
  this.graph.layoutMinY = miny;
  this.graph.layoutMaxY = maxy;
};

Layout.prototype.iterate = function () {
  //Forces on vertices due to vertex-vertex repulsion
  var seen_vertices = []
  for (id1 in this.graph.vertices) {
    var v1 = this.graph.vertices[id1];
    seen_vertices.push(id1);
    for (id2 in this.graph.vertices) {
      var v2 = this.graph.vertices[id2];
      if(seen_vertices.indexOf(id2) === -1) {
        this.forceRepulsive(v1,v2);
      }
    }
  }
  //Forces on edge attraction
  for (var i = 0; i < this.graph.edges.length; i++) {
    this.forceAttractive(this.graph.edges[i]);
  }
  //Move by forces
  for (id in this.graph.vertices) {
    var vertex = this.graph.vertices[id];
    var xmove = this.c * vertex.layoutForceX;
    var ymove = this.c * vertex.layoutForceY;

    var max = this.maxVertexMovement;

    if(xmove > max) xmove = max;
    if(xmove < -max) xmove = -max;
    if(ymove > max) ymove = max;
    if(ymove < -max) ymove = -max;

    vertex.layoutPosX += xmove;
    vertex.layoutPosY += ymove;
    vertex.layoutForceX = 0;
    vertex.layoutForceY = 0;
  }

};

Layout.prototype.forceRepulsive = function (v1, v2) {
  var dx = v2.layoutPosX - v1.layoutPosX;
  var dy = v2.layoutPosY - v1.layoutPosY;
  var d2 = dx * dx + dy * dy;

  if(d2 < 0.01) {
    dx = 0.1 * Math.random() + 0.1;
    dy = 0.1 * Math.random() + 0.1;
    var d2 = dx * dx + dy * dy;
  }

  var d = Math.sqrt(d2);

  if(d < this.maxRepulsiveForceDistance) {
    var repulsiveForce = this.k * this.k / d;
    v2.layoutForceX += repulsiveForce * dx / d;
    v2.layoutForceY += repulsiveForce * dy / d;
    v1.layoutForceX -= repulsiveForce * dx / d;
    v1.layoutForceY -= repulsiveForce * dy / d;
  }

};

Layout.prototype.forceAttractive = function(edge) {
  var u = this.graph.vertices[edge.props.u_id];
  var v = this.graph.vertices[edge.props.v_id];

  var dx = v.layoutPosX - u.layoutPosX;
  var dy = v.layoutPosY - u.layoutPosY;
  var d2 = dx * dx + dy * dy;

  if(d2 < 0.01) {
    dx = 0.1 * Math.random() + 0.1;
    dy = 0.1 * Math.random() + 0.1;
    var d2 = dx * dx + dy * dy;
  }

  var d = Math.sqrt(d2);
  if(d > this.maxRepulsiveForceDistance) {
    d = this.maxRepulsiveForceDistance;
    d2 = d * d;
  }

  var attractiveForce = (d2 - this.k * this.k) / this.k;
  if(edge.weight == undefined || edge.weight < 1) edge.weight = 1;
  attractiveForce *= Math.log(edge.weight) * 0.5 + 1;

  v.layoutForceX -= attractiveForce * dx / d;
  v.layoutForceY -= attractiveForce * dy / d;
  u.layoutForceX += attractiveForce * dx / d;
  u.layoutForceY += attractiveForce * dy / d;

};
