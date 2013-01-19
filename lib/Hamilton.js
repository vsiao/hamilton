function Hamilton(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.vertices = {};
  this.edges = [];
  var self = this;
  this._listeners = {
    mousemove: function() { self._onMouseMove.apply(self, arguments); },
    mousedown: function() { self._onMouseDown.apply(self, arguments); },
    mouseup: function() { self._onMouseUp.apply(self, arguments); }
  };
  var type;
  for (type in this._listeners) {
    this.canvas.addEventListener(type, this._listeners[type]);
  }
}

Hamilton.prototype.draw = function() {
  var i, id;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  for (i = 0; i < this.edges.length; ++i) {
    this.edges[i].__HAM_DRAWN = true;
    this.edges[i].draw(this);
  }
  for (id in this.vertices) {
    this.vertices[id].__HAM_DRAWN = true;
    this.vertices[id].draw(this);
  }
  this._focusVtx && this._focusVtx.draw(this);
};

Hamilton.prototype.clear = function() {
  this.vertices = {};
  this.edges = [];
  this.draw();
};

Hamilton.prototype.addVertex = function(id, x, y) {
  var vertex = id;
  if (!(vertex instanceof Hamilton.Vertex)) {
    vertex = new Hamilton.Vertex({id:id, x:x, y:y});
  }
  this.vertices[vertex.id] = vertex;
};

Hamilton.prototype.addEdge = function(u, v) {
  var edge = u;
  if (!(edge instanceof Hamilton.Edge)) {
    edge = new Hamilton.Edge({u_id: u, v_id: v});
  }
  if (!this.vertices.hasOwnProperty(edge.props.u_id) ||
      !this.vertices.hasOwnProperty(edge.props.v_id)) {
    throw "Hamilton graph does not contain edge endpoints.";
  }
  this.edges.push(edge);
  this.vertices[edge.props.u_id].edges.push(edge);
  this.vertices[edge.props.v_id].edges.push(edge);
};

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}
function hoverVtx(v, x, y) {
  return dist(v.props.x, v.props.y, x, y) <= v.props.r;
}

Hamilton.prototype._onMouseMove = function(event) {
  var id, x = event.offsetX, y = event.offsetY;
  if (this._d) {
    this._focusVtx.props.x = x + this._d.offsetX;
    this._focusVtx.props.y = y + this._d.offsetY;
    this.draw();
    return;
  }
  if (this._focusVtx) {
    if (hoverVtx(this._focusVtx, x, y)) {
      return;
    }
    this._focusVtx._onMouseLeave(this);
    document.body.style.cursor = 'default';
    this._focusVtx = null;
  }
  for (id in this.vertices) {
    var v = this.vertices[id];
    if (hoverVtx(v, x, y)) {
      v._onMouseEnter(this);
      document.body.style.cursor = 'pointer';
      this._focusVtx = v;
      break;
    }
  }
};

Hamilton.prototype._onMouseDown = function(event) {
  var x = event.offsetX, y = event.offsetY;
  if (this._focusVtx) {
    this._d = {
      offsetX: this._focusVtx.props.x - x,
      offsetY: this._focusVtx.props.y - y
    }
  }
};

Hamilton.prototype._onMouseUp = function(event) {
  this._d = null;
};
