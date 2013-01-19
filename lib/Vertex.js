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
  var i, context = ham.context;
  context.save();
  if (this._hover) {
    context.strokeStyle = 'blue';
    for (i = 0; i < this.edges.length; ++i) {
      this.edges[i]._hover = true;
      this.edges[i].draw(ham);
    }
  }
  context.beginPath();
  context.lineWidth = this.props.stroke.width;
  context.arc(this.props.x, this.props.y, this.props.r, 0, 2*Math.PI);
  context.stroke();
  context.restore();
};

Hamilton.Vertex = HamiltonVertex;
