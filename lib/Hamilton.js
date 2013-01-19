function Hamilton(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.vertices = [];
  var self = this;
  function onMouseMove() {
    self._onMouseMove.apply(self, arguments);
  }
  this.canvas.addEventListener('mousemove', onMouseMove);
  this._listener = onMouseMove;
}

Hamilton.prototype.draw = function() {
  var i;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  for (i = 0; i < this.vertices.length; ++i) {
    this.context.save();
    this.vertices[i].__HAM__drawn = true;
    this.vertices[i].draw(this.context);
    this.context.restore();
  }
};

Hamilton.prototype.addVertex = function(vertex) {
  if (!vertex instanceof Hamilton.Vertex) {
    return;
  }
  this.vertices.push(vertex);
};

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
}
function hoverVtx(v, x, y) {
  return dist(v.props.x, v.props.y, x, y) <= v.props.r;
}

Hamilton.prototype._onMouseMove = function(event) {
  var i, x = event.layerX, y = event.layerY;
  if (this._focusVtx) {
    if (hoverVtx(this._focusVtx, x, y)) {
      return;
    }
    // TODO(vsiao) overlapping vtx should override focused elem
    this._focusVtx._hover = false;
    this._focusVtx.draw(event.target.getContext('2d'));
    document.body.style.cursor = 'default';
    this._focusVtx = null;
  }
  // Iterate from back to front ~ top to bottom stack rendering order
  for (i = this.vertices.length - 1; i >= 0; --i) {
    var v = this.vertices[i];
    if (hoverVtx(v, x, y)) {
      v._hover = true;
      v.draw(event.target.getContext('2d'));
      document.body.style.cursor = 'pointer';
      this._focusVtx = v;
      break;
    }
  }
};
