function Hamilton(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.vertices = {};
  this.edges = [];
  this.name = "example";
  this.type = "graph";
  this.attributes = {};
  this.menu = [];
  this.input =
    $('<input type="text" id="vtx-name-change" />').insertAfter(this.canvas);
  var self = this;
  this._listeners = {
    mousemove: function() { self._onMouseMove.apply(self, arguments); },
    mousedown: function() { self._onMouseDown.apply(self, arguments); },
    mouseup: function() { self._onMouseUp.apply(self, arguments); },
    click: function() { self._onClick.apply(self, arguments); }
  };
  var type;
  for (type in this._listeners) {
    this.canvas.addEventListener(type, this._listeners[type]);
  }
}

Hamilton.prototype._maybeDrawGrid = function() {
  if (this._capture) {
    return;
  }
  for (i = 0.5; i < this.canvas.width; i+=50) {
    this.context.beginPath();
    this.context.moveTo(i, 0);
    this.context.lineTo(i, this.canvas.height);
    this.context.lineWidth = 0.1;
    this.context.stroke();
    this.context.closePath();
  }
  for (i = 0.5; i < this.canvas.height; i+=50) {
    this.context.beginPath();
    this.context.moveTo(0, i);
    this.context.lineTo(this.canvas.width, i);
    this.context.lineWidth = 0.1;
    this.context.stroke();
    this.context.closePath();
  }
};

Hamilton.prototype.draw = function() {
  var i, j, id;
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.menu = [];
  this._maybeDrawGrid();
  for (i = 0; i < this.edges.length; ++i) {
    this.edges[i].draw(this);
  }
  for (id in this.vertices) {
    if (this.vertices[id] === this._focus ||
        this.vertices[id] === this._selected) {
      continue;
    }
    this.vertices[id].draw(this);
  }
  // always draw focus last
  this._focus && this._focus.draw(this);
  this._selected && this._selected.draw(this);
};

Hamilton.prototype.clear = function() {
  this.vertices = {};
  this.edges = [];
  this.draw();
};

Hamilton.prototype.getGraph = function() {
  var verts = {}, eds = [];

  for (v in this.vertices) {
    data = this.vertices[v];
    verts[data.id] = {
      x: data.props.x,
      y: data.props.y
    };
  }

  for (i in this.edges) {
    var e = this.edges[i];
    eds.push({
      u: e.props.u_id,
      v: e.props.v_id
    });
  }

  return {
    name: this.name,
    type: this.type,
    vertices: verts,
    edges: eds
  };
}

Hamilton.prototype.setGraph = function (graph) {
  for (v in graph.vertices) {
    var vert = graph.vertices[v];
    this.addVertex(v, vert.x, vert.y);
  }

  for (i in graph.edges) {
    var edge = graph.edges[i];
    this.addEdge(edge.u, edge.v);
  }

  this.name = graph.name || "example";
  this.type = graph.type || "graph";
}

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

  return dotString + "}"
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
    throw ("Hamilton graph does not contain edge endpoints:" + edge.props.u_id +
           "," + edge.props.v_id);
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
  var i, id, snap, x = event.offsetX, y = event.offsetY;
  if (this._dummy) {
    this._dummy.props.x = this.snap(x);
    this._dummy.props.y = this.snap(y);
    this.draw();
    return;
  }
  if (this._d) {
    // dragging an element;
    this._focus._DRAGMASTER5000 = true;
    this._focus.props.x = this.snap(x + this._d.offsetX);
    this._focus.props.y = this.snap(y + this._d.offsetY);
    this.draw();
    return;
  }
  if (this._EDGEADDER9000) {
    this._focus = null;
    if (hoverVtx({
      props:{x:this.menu[1].x,y:this.menu[1].y,r:this.menu[1].props.r}
    }, x, y)) {
      this._focus = this.menu[1];
    }
    for (id in this.vertices) {
      var v = this.vertices[id];
      // TODO(vsiao) skip existing edges
      if (hoverVtx(v, x, y)) {
        x = v.props.x;
        y = v.props.y;
        this._focus = v;
        break;
      }
    }
    this.draw();
    this.context.save();
    this.context.beginPath();
    this.context.moveTo(this._selected.props.x, this._selected.props.y);
    this.context.lineTo(x, y);
    this.context.closePath();
    this.context.lineWidth = 2;
    this.context.strokeStyle = '#218484';
    this.context.stroke();
    this._selected.draw(this);
    if (this._focus instanceof Hamilton.Vertex) {
      this._focus.draw(this);
      this._focus.bling(this);
    }
    this.context.restore();
    return;
  }

  if (this._focus) {
    if (hoverVtx(this._focus, x, y)) {
      return;
    }
    this._focus._hover = false;
    this._focus = null;
  }
  document.body.style.cursor = 'default';
  for (i = 0; i < this.menu.length; ++i) {
    if (hoverVtx({props:
      {x:this.menu[i].x,y:this.menu[i].y,r:this.menu[i].props.r}
    }, x, y)) {
      this.menu[i]._hover = true;
      document.body.style.cursor = 'pointer';
      this._focus = this.menu[i];
      break;
    }
  }
  for (id in this.vertices) {
    if (this._focus) {
      break;
    }
    var v = this.vertices[id];
    if (hoverVtx(v, x, y)) {
      v._hover = true;
      document.body.style.cursor = 'pointer';
      this._focus = v;
    }
  }
  this.draw();
};

Hamilton.prototype._onMouseDown = function(event) {
  var x = event.offsetX, y = event.offsetY;
  if (this._focus instanceof Hamilton.Vertex) {
    this._d = {
      offsetX: this._focus.props.x - x,
      offsetY: this._focus.props.y - y
    }
  }
};

Hamilton.prototype._onMouseUp = function(event) {
  this._d = null;
};

Hamilton.prototype.confirmName = function() {
  if (this._NAMECHANGER10K) {
    this._NAMECHANGER10K = false;
    delete this.vertices[this._oldID];
    // TODO(vsiao) check for no duplicates
    this._selected.id = this.input.val();
    this.vertices[this._selected.id] = this._selected;
    this.input.hide();
    var i;
    for (i = 0; i < this.edges.length; ++i) {
      if (this.edges[i].props.u_id === this._oldID) {
        this.edges[i].props.u_id = this._selected.id;
      }
      if (this.edges[i].props.v_id === this._oldID) {
        this.edges[i].props.v_id = this._selected.id;
      }
    }
    this.draw();
  }
};

Hamilton.prototype._onClick = function(event) {
  if (this._dummy) {
    this.ENTERVERTEXADDMODE();
  }
  if (this._NAMECHANGER10K) {
    this.confirmName();
    return;
  }
  if (this._focus instanceof Hamilton.Vertex.EAdd) {
    if (this._EDGEADDER9000) {
      this._EDGEADDER9000 = false;
      this.draw();
    } else {
      this._EDGEADDER9000 = true;
      this.draw();
    }
  }
  if (!this._focus) {
    this._EDGEADDER9000 = false;
    this.menu.length && (this.menu[1]._hover = false);
    this._selected && (this._selected._selected = false, this.draw());
    this._selected = null;
  }
  if (this._focus instanceof Hamilton.Vertex.Edit) {
    this._NAMECHANGER10K = true;
    this._oldID = this._selected.id;
    this.input.val(this._oldID);
    this._selected.id = '';
    this.input.css({
      left: (this._selected.props.x-this._selected.props.r/2-6) + 'px',
      top: (this._selected.props.y+67) + 'px'}).show().focus();
  }
  if (this._focus instanceof Hamilton.Vertex) {
    if (this._EDGEADDER9000) {
      this._EDGEADDER9000 = false;
      this.menu[1]._hover = false;
      this.addEdge(this._selected.id, this._focus.id);
      this._selected._selected = false;
      this._selected = null;
      this.draw();
      return;
    }
    if (this._focus._DRAGMASTER5000) {
      this._focus._DRAGMASTER5000 = false;
      return;
    }
    this._selected && (this._selected._selected = false);
    if (this._focus === this._selected) {
      this._selected = null;
      this.menu = [];
    } else {
      this._selected = this._focus;
      this._selected._selected = true;
    }
    this.draw();
  }
  if (this._focus instanceof Hamilton.Vertex.Del) {
    var i, vtx = this._focus.vtx, new_edges = [];
    delete this.vertices[vtx.id];
    for (i = 0; i < this.edges.length; ++i) {
      if (this.edges[i].props.u_id !== vtx.id &&
          this.edges[i].props.v_id !== vtx.id) {
        new_edges.push(this.edges[i]);
      }
    }
    this.edges = new_edges;
    this._focus = this._selected = null;
    this.menu = [];
    this.draw();
  }
};

Hamilton.prototype.ENTERVERTEXADDMODE = function() {
  this._dummy = new Hamilton.Vertex();
  this.vertices[this._dummy.id] = this._dummy;
}
;
