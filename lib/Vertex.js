function HamiltonVtxDel(vtx) {
  this.vtx = vtx;
  this.props = { r: 8 };
}

HamiltonVtxDel.prototype.draw = function(ham) {
  var context = ham.context;
  context.save();
  context.beginPath();
  context.arc(
    this.vtx.props.x+this.vtx.props.r+4,
    this.vtx.props.y-this.vtx.props.r-4,
    this.props.r, 0, 2*Math.PI
  );
  context.closePath();
  context.fill();
  context.font = '12px Helvetica,Arial,sans-serif';
  context.fillStyle = 'white';
  context.fillText('x', this.x-3, this.y+4);
  context.restore();
};

HamiltonVtxDel.prototype.__defineGetter__('x', function() {
  return this.vtx.props.x+this.vtx.props.r+4;
});
HamiltonVtxDel.prototype.__defineGetter__('y', function() {
  return this.vtx.props.y-this.vtx.props.r-4;
});

function HamiltonVtxEAdd(vtx) {
  this.vtx = vtx;
  this.props = { r: 8 };
}

HamiltonVtxEAdd.prototype.draw = function(ham) {
  var context = ham.context;
  context.save();
  context.beginPath();
  context.arc(
    this.vtx.props.x-this.vtx.props.r-4,
    this.vtx.props.y+this.vtx.props.r+4,
    this.props.r, 0, 2*Math.PI
  );
  context.closePath();
  context.fill();
  context.font = '12px Helvetica,Arial,sans-serif';
  context.fillStyle = 'white';
  context.fillText('+', this.x-3, this.y+4);
  context.restore();
};

HamiltonVtxEAdd.prototype.__defineGetter__('x', function() {
  return this.vtx.props.x-this.vtx.props.r-4;
});
HamiltonVtxEAdd.prototype.__defineGetter__('y', function() {
  return this.vtx.props.y+this.vtx.props.r+4;
});

var __HAM_VTX_ID = 0;

function HamiltonVertex(props) {
  props = props || {};
  if (typeof props.id === 'undefined') {
    props.id = '_h' + (__HAM_VTX_ID++);
  }
  this.id = props.id;
  this.edges = [];
  this.props = {
    x: 50,
    y: 50,
    r: 20,
    stroke: {
      width: 3
    }
  };
  this._delBtn = new HamiltonVtxDel(this);
  this._eAddBtn = new HamiltonVtxEAdd(this);

  copyProperties(this.props, props);
}

HamiltonVertex.prototype.draw = function(ham) {
  var context = ham.context;
  context.save();
  if (this._hover) {
    context.strokeStyle = '#dd3636';
    context.fillStyle = '#dd3636';
  }
  if (this._selected) {
    context.beginPath();
    context.arc(this.props.x, this.props.y, this.props.r+12, 0, 2*Math.PI);
    context.closePath();
    context.lineWidth = 5;
    context.stroke();
    this._delBtn.draw(ham);
    this._eAddBtn.draw(ham);
    ham.menu.push(this._delBtn, this._eAddBtn);
  }
  context.beginPath();
  context.font = '14px Helvetica,Arial,sans-serif';
  context.lineWidth = this.props.stroke.width;
  context.arc(this.props.x, this.props.y, this.props.r, 0, 2*Math.PI);
  context.closePath();
  context.fillStyle = 'white';
  context.fill();
  context.stroke();
  context.fillStyle = 'black';
  var metrics = context.measureText(this.id);
  context.fillText(this.id, this.props.x-metrics.width/2, this.props.y+5);
  context.restore();
};

HamiltonVertex.prototype.bling = function(ham) {
  var context = ham.context;
  context.beginPath();
  context.arc(this.props.x, this.props.y, this.props.r+12, 0, 2*Math.PI);
  context.closePath();
  context.lineWidth = 5;
  context.stroke();
};

Hamilton.Vertex = HamiltonVertex;
Hamilton.Vertex.Del = HamiltonVtxDel;
Hamilton.Vertex.EAdd = HamiltonVtxEAdd;
