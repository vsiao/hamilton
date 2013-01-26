// u = source v = destination
function HamiltonEdge(props) {
  this.props = {
    u_id: null,
    v_id: null,
    width: 3
  };
  copyProperties(this.props, props);
}

HamiltonEdge.prototype.drawArrow = function(ham, u, v) {
  var context = ham.context;
  var headlen = 10;   // length of head in pixels
  var angle = Math.atan2(v.props.y-u.props.y,v.props.x-u.props.x);
  var endx = v.props.x - (Math.cos(angle) * (v.props.r + v.props.stroke.width));
  var endy = v.props.y - (Math.sin(angle) * (v.props.r + v.props.stroke.width));
  context.moveTo(endx, endy);
  context.lineTo(endx-headlen*Math.cos(angle-Math.PI/6),endy-headlen*Math.sin(angle-Math.PI/6));
  context.moveTo(endx, endy);
  context.lineTo(endx-headlen*Math.cos(angle+Math.PI/6),endy-headlen*Math.sin(angle+Math.PI/6));
}

HamiltonEdge.prototype.draw = function(ham) {
  var context = ham.context;
  var u = ham.vertices[this.props.u_id];
  var v = ham.vertices[this.props.v_id];
  context.save();
  if (u._hover || v._hover) {
    context.strokeStyle = '#dd3636';
  }
  context.beginPath();
  context.moveTo(u.props.x, u.props.y);
  context.lineTo(v.props.x, v.props.y);
  context.lineWidth = this.props.width;
  if (ham._directed) {
    this.drawArrow(ham, u, v);
  }
  context.stroke();
  context.restore();
};

Hamilton.Edge = HamiltonEdge;
