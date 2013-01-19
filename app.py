#!/usr/bin/python
from flask import Flask, render_template, request
import json
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
    return_json = {'nodes': [], 'edges': [], 'name' : graph.get_name(),
                   'type': graph.get_type(),
                   'attributes': graph.get_attributes() }
    for x in graph.get_node_list():
      return_json['nodes'].append({'attributes' : x.get_attributes(),
                                   'name' : x.get_name()})
    for y in graph.get_edge_list():
      return_json['edges'].append({'attributes' : y.get_attributes(),
                                   'source' : y.get_source(),
                                   'destination' : y.get_destination()})
    return_json['status'] = 'success'
    return json.dumps(return_json)
  except ParseException, err:
    message = err.line + "\n" + " "*(err.column-1) + "^" + "\n\n" + str(err)
    return json.dumps({'status' : 'error', 'message': unicode(message)})

if __name__ == '__main__':
  app.debug = True
  app.run()
