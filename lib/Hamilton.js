function Hamilton(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.vertices = {};
  this.edges = [];
  this.name = "";
  this.attributes = {};
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
  var i, j, id;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  for (i = 0; i < this.canvas.width; i+=50) {
    this.context.beginPath();
    this.context.moveTo(i, 0);
    this.context.lineTo(i, this.canvas.height);
    this.context.lineWidth = 0.1;
    this.context.stroke();
    this.context.closePath();
  }
  for (i = 0; i < this.canvas.height; i+=50) {
    this.context.beginPath();
    this.context.moveTo(0, i);
    this.context.lineTo(this.canvas.width, i);
    this.context.lineWidth = 0.1;
    this.context.stroke();
    this.context.closePath();
  }
  for (i = 0; i < this.edges.length; ++i) {
    this.edges[i].__HAM_DRAWN = true;
    this.edges[i].draw(this);
  }
  for (id in this.vertices) {
    if (this.vertices[id] === this._focusVtx) {
      continue;
    }
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

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
}

function attrString(attrs) {
  var returnString = "";
  for (id in attrs) {
      returnString += id + '="' + attrs[id] + '",'
  }
  return returnString.slice(0,-1);
}

Hamilton.prototype.toDot = function() {
  var dotString = this.type + ' ' + this.name + "{\n";
  for (id in this.vertices) {
    var vertexString = " ";
    if(isEmpty(this.vertices[id].attributes)) {
      vertexString += id + ";\n"
    } else {
      vertexString += id + '[' + attrString(this.vertices[id].attributes) + '];\n';
    }
    dotString += vertexString;
  }
  for (var i = 0; i < this.edges.length; i++) {
    var edge = this.edges[i],
        edgeString = " ";
    edgeString += edge.props.u_id + " ";
    if(this.type === 'digraph') {
        edgeString += "->" + " ";
    } else {
        edgeString += '--' + ' ';
    }
    edgeString += edge.props.v_id;
    if(isEmpty(edge.attributes)) {
      edgeString += ";\n"
    } else {
      edgeString += '[' + attrString(edge.attributes) + '];\n';
    }
    dotString += edgeString;
  }

  return dotString + "\n}"


}


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

Hamilton.prototype.snap = function(x) {
  return Math.floor((x+25)/50)*50;
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
    this._focusVtx.props.x = this.snap(x + this._d.offsetX);
    this._focusVtx.props.y = this.snap(y + this._d.offsetY);
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
