// u = source v = destination
function HamiltonEdge(props) {
  this.props = {
    u_id: null,
    v_id: null,
    width: 3
  };
  copyProperties(this.props, props);
}

HamiltonEdge.prototype.draw = function(ham) {
  var context = ham.context;
  var u = ham.vertices[this.props.u_id];
  var v = ham.vertices[this.props.v_id];
  context.save();
  if (u._hover || v._hover) {
    context.strokeStyle = '#218484';
  }
  context.beginPath();
  context.moveTo(u.props.x, u.props.y);
  context.lineTo(v.props.x, v.props.y);
  context.lineWidth = this.props.width;
  context.stroke();
  context.restore();
};

Hamilton.Edge = HamiltonEdge;
