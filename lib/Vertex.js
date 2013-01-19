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

  copyProperties(this.props, props);
}

HamiltonVertex.prototype.draw = function(ham) {
  var context = ham.context;
  context.save();
  if (this._hover) {
    context.strokeStyle = '#218484';
  }
  context.beginPath();
  context.font = '12px Helvetica,Arial,sans-serif';
  context.lineWidth = this.props.stroke.width;
  context.arc(this.props.x, this.props.y, this.props.r, 0, 2*Math.PI);
  context.closePath();
  context.fillStyle = 'white';
  context.fill();
  context.stroke();
  context.fillStyle = 'black';
  var metrics = context.measureText(this.id);
  context.fillText(this.id, this.props.x-metrics.width/2, this.props.y+4);
  context.restore();
};

HamiltonVertex.prototype._onMouseEnter = function(ham) {
  this._hover = true;
  this._updateEdges(ham);
  this.draw(ham);
};

HamiltonVertex.prototype._onMouseLeave = function(ham) {
  this._hover = false;
  this._updateEdges(ham);
  this.draw(ham);
};

HamiltonVertex.prototype._updateEdges = function(ham) {
  var i;
  for (i = 0; i < this.edges.length; ++i) {
    this.edges[i].draw(ham);
    if (this.edges[i].props.u_id === this.id) {
      ham.vertices[this.edges[i].props.v_id].draw(ham);
    } else {
      ham.vertices[this.edges[i].props.u_id].draw(ham);
    }
  }
};

Hamilton.Vertex = HamiltonVertex;
