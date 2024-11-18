from flask import Flask, render_template, request, jsonify
from pymodbus.client import ModbusTcpClient
app = Flask(__name__)

# Server's IP port is default 502
local = '127.0.0.1'
PLC = '192.168.0.1'

client = ModbusTcpClient(host=local)
client.connect()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/input', methods=["POST"])
def change_input():
    if not request.method == "POST":
        return
    data = request.get_json()
    """ {
    address: 0,
    value: 0
    } """
    client.write_coil(address=data["address"], value=data["value"])
    return jsonify("OK")


@app.route('/outputs', methods=["GET"])
def read_outputs():
    if not request.method == "GET":
        return
    outputs = client.read_discrete_inputs(address=0, count=8)
    sent_data = jsonify(outputs.bits)
    return sent_data


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
