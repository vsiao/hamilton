function HamiltonVtxDel(vtx) {
  this.vtx = vtx;
  this.props = { r: 8 };
}

HamiltonVtxDel.prototype.draw = function(ham) {
  var context = ham.context;
  context.save();
  context.beginPath();
  context.arc(
    this.vtx.props.x+this.vtx.props.r+13,
    this.vtx.props.y,
    this.props.r, 0, 2*Math.PI
  );
  context.closePath();
  if (this._hover) {
    context.fillStyle = '#dd3636';
  }
  context.fill();
  context.font = '12px Helvetica,Arial,sans-serif';
  context.fillStyle = 'white';
  context.fillText('x', this.x-3, this.y+4);
  context.restore();
};

HamiltonVtxDel.prototype.__defineGetter__('x', function() {
  return this.vtx.props.x+this.vtx.props.r+13;
});
HamiltonVtxDel.prototype.__defineGetter__('y', function() {
  return this.vtx.props.y;
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
    this.vtx.props.x+this.vtx.props.r+4,
    this.vtx.props.y+this.vtx.props.r+4,
    this.props.r, 0, 2*Math.PI
  );
  context.closePath();
  if (this._hover) {
    context.fillStyle = '#218484';
  }
  context.fill();
  context.font = '12px Helvetica,Arial,sans-serif';
  context.fillStyle = 'white';
  context.fillText('+', this.x-3, this.y+4);
  context.restore();
};

HamiltonVtxEAdd.prototype.__defineGetter__('x', function() {
  return this.vtx.props.x+this.vtx.props.r+4;
});
HamiltonVtxEAdd.prototype.__defineGetter__('y', function() {
  return this.vtx.props.y+this.vtx.props.r+4;
});

function HamiltonVtxEdit(vtx) {
  this.vtx = vtx;
  this.props = { r: 8 };
}

HamiltonVtxEdit.prototype.draw = function(ham) {
  var context = ham.context;
  context.save();
  context.beginPath();
  context.arc(
    this.vtx.props.x+this.vtx.props.r+4,
    this.vtx.props.y-this.vtx.props.r-4,
    this.props.r, 0, 2*Math.PI
  );
  context.closePath();
  if (this._hover) {
    context.fillStyle = '#218484';
  }
  context.fill();
  context.font = '12px Helvetica,Arial,sans-serif';
  context.fillStyle = 'white';
  context.fillText('/', this.x-2, this.y+5);
  context.restore();
};

HamiltonVtxEdit.prototype.__defineGetter__('x', function() {
  return this.vtx.props.x+this.vtx.props.r+4;
});
HamiltonVtxEdit.prototype.__defineGetter__('y', function() {
  return this.vtx.props.y-this.vtx.props.r-4;
});

Hamilton.Vertex.Del = HamiltonVtxDel;
Hamilton.Vertex.EAdd = HamiltonVtxEAdd;
Hamilton.Vertex.Edit = HamiltonVtxEdit;
