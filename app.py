#!/usr/bin/python
from flask import Flask, render_template, request
import json
import os
import pydot
from dot_parser import ParseException
app = Flask(__name__, static_folder=".", template_folder=".", static_url_path="")

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/parse', methods=['GET', 'POST'])
def parse():
  dotfile = request.form['dotfile']
  try:
    print dotfile
    data = dotfile.encode('ascii','ignore') # because unicode strings lose edges
    graph = pydot.graph_from_dot_data(data)
    gattr = graph.get_attributes()
    for (k,v) in gattr.iteritems(): gattr[k] = v[1:-1]
    return_json = {'nodes': [], 'edges': [], 'name' : graph.get_name(),
                   'type': graph.get_type(),
                   'attributes': gattr }
    for x in graph.get_node_list():
      attr = x.get_attributes()
      for (k,v) in attr.iteritems(): attr[k] = v[1:-1]
      return_json['nodes'].append({'attributes' : attr,
                                   'name' : x.get_name()})
    for y in graph.get_edge_list():
      attr = y.get_attributes()
      for (k,v) in attr.iteritems(): attr[k] = v[1:-1]
      return_json['edges'].append({'attributes' : attr,
                                   'source' : y.get_source(),
                                   'destination' : y.get_destination()})
    return_json['status'] = 'success'
    return json.dumps(return_json)
  except ParseException, err:
    message = err.line + "\n" + " "*(err.column-1) + "^" + "\n\n" + str(err)
    return json.dumps({'status' : 'error', 'message': unicode(message)})

if __name__ == '__main__':
  debug = bool(os.environ.get('DEBUG', False))
  print "debug: ", debug
  app.debug = debug
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)
