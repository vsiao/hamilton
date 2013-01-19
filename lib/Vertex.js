var __HAM_VTX_ID = 1256;

function HamiltonVertex(props) {
  props = props || {};
  if (typeof props.id === 'undefined') {
    props.id = '__HAM_VTX_ID_' + (__HAM_VTX_ID++);
  }
  this.id = props.id;
  this.edges = [];
  this.props = {
    x: 50,
    y: 50,
    r: 10,
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
    context.strokeStyle = 'blue';
  }
  context.beginPath();
  context.lineWidth = this.props.stroke.width;
  context.arc(this.props.x, this.props.y, this.props.r, 0, 2*Math.PI);
  context.closePath();
  context.fillStyle = 'white';
  context.fill();
  context.stroke();
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
