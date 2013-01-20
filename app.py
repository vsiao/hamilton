#!/usr/bin/python
from flask import Flask, render_template, request, g
import json
import os
import pydot
import shortuuid
from dot_parser import ParseException
from pymongo import MongoClient

MONGO_URI = "mongodb://localhost"
DEBUG = True

app = Flask(__name__, static_folder=".", template_folder=".", static_url_path="/static")
app.config.from_object(__name__)
app.config.from_envvar('HAMILTON_SETTINGS', silent=True)

@app.before_request
def connect_to_db():
  g.db = MongoClient(app.config["MONGO_URI"]).hamilton

@app.teardown_request
def disconnect_from_db(exception):
  if hasattr(g, 'db'):
    g.db.connection.disconnect()

@app.route('/')
def index():
  return render_template('index.html', graph="{}")

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

@app.route('/create', methods=['GET', 'POST'])
def create_fiddle():
  try:
    graphobj = json.loads(request.data)['graph']
    uid = shortuuid.uuid()[:8]
    g.db.graphs.insert({'uid': uid, 'graph': graphobj})
    return json.dumps({'status': 'success', 'uid': unicode(uid)})
  except KeyError, err:
    message = err.line + ": sent bad graph data: %s" % str(err)
    return json.dumps({'status': 'error', 'message': unicode(message)})

@app.route('/<fiddle_id>')
def get_fiddle(fiddle_id):
  graph = g.db.graphs.find_one({"uid": fiddle_id })
  if graph:
    del graph['_id']
    return render_template('index.html', graph=json.dumps(graph))
  else:
    # raise 404
    return "you suck"

if __name__ == '__main__':
  port = int(os.environ.get('PORT', 5000))
  app.run(host='0.0.0.0', port=port)
