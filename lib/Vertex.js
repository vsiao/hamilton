var __HAM_VTX_ID = 0;

function HamiltonVertex(props) {
  props = props || {};
  if (typeof props.id === 'undefined') {
    props.id = 'H' + (__HAM_VTX_ID++);
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
  this._editBtn = new HamiltonVtxEdit(this);

  copyProperties(this.props, props);
}

HamiltonVertex.prototype.draw = function(ham) {
  var context = ham.context;
  context.save();
  if (this._hover) {
    context.strokeStyle = '#dd3636';
    context.fillStyle = '#dd3636';
  }
  if (this._selected && !ham._capture) {
    context.beginPath();
    context.arc(this.props.x, this.props.y, this.props.r+12, 0, 2*Math.PI);
    context.closePath();
    context.lineWidth = 5;
    context.stroke();
    this._delBtn.draw(ham);
    this._eAddBtn.draw(ham);
    this._editBtn.draw(ham);
    ham.menu.push(this._delBtn, this._eAddBtn, this._editBtn);
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
