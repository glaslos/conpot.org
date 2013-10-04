from gevent.wsgi import WSGIServer
import bottle
from bottle import Bottle, static_file
from jinja2 import Environment, FileSystemLoader


bottle.debug(True)
app = Bottle()
template_env = Environment(loader=FileSystemLoader("./templates"))


@app.route('/static/<filepath:path>')
def server_static(filepath):
    return static_file(filepath, root='./static')

@app.route('/', method=["GET"])
def memory_page():
    template = template_env.get_template('index.html')
    return template.render()


if __name__ == '__main__':
    http_server = WSGIServer(("127.0.0.1", 8881), app)
    http_server.serve_forever()