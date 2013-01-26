function copyProperties(defaults, props) {
  var key;
  for (key in props) {
    defaults[key] = props[key];
  }
}
