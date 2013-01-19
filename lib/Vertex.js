function HamiltonVertex(props) {
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

HamiltonVertex.prototype.draw = function(context) {
  context.save();
  context.beginPath();
  context.lineWidth = this.props.stroke.width;
  if (this._hover) {
    context.strokeStyle = 'blue';
  }
  context.arc(this.props.x, this.props.y, this.props.r, 0, 2*Math.PI);
  context.stroke();
  context.restore();
};

Hamilton.Vertex = HamiltonVertex;
