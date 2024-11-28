from flask import Flask ,request,render_template,jsonify
from flask_pymongo import PyMongo 
import os
import sys
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__,template_folder="templates")
CORS(app)

MONGO_URL = os.getenv("MONGO_URL")

# this is for path setting as we use the import 
# we import from another file directly so below line set the path for all src folder files.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__) + '/src' )))
# importing main function from core.py file
from core import main # type: ignore

app.config["MONGO_URI"] = MONGO_URL
mongo = PyMongo(app)
collection = mongo.db.machineInfo


from config import addRule
from config import fetchRules

# functions
def fetchMachineData(machineId):
    data = collection.find_one({'MachineId': machineId}, {'_id': 0})
    return data

def fetchAllData():
    data = collection.find({})
    data = list(data)
    return data

def addEtherHeader(srcMAC,desMAC):
    result = ""
    src_mac_address = srcMAC
    des_mac_address = desMAC
    ether_type = "08|00"
    result = src_mac_address + "|" + des_mac_address + "|" + ether_type + "|"
    return result
    
def addIPHeader(srcIP,desIP,protocol):
    result = ""
    version_header_length = "45"
    TOS = "00"
    total_length = "00|29"
    Indentification = "e3|f2"
    flags_fragment_offset = "40|00"
    time_to_live = "80"
    protocol_hex = ""
    if(protocol == "TCP"):
        protocol_hex = "06"
    else:
        protocol_hex = "11"
    header_checksum = "01|11"
    src_ip = srcIP
    des_ip = desIP
    result = version_header_length +"|"+TOS +"|"+total_length+"|"+Indentification+"|"+flags_fragment_offset+"|"+time_to_live+"|"+protocol_hex+"|"+header_checksum+"|"+src_ip+"|"+des_ip+"|"
    return result

def addTCPHeader(srcPort,desport):
    result = ""
    src_port = srcPort
    des_port = desport
    sequence_no = "b4|44|b1|c8"
    ack_no = "90|da|a5|44"
    data_offset_flags = "50|10"
    Windows_size = "01|00"
    cheacksum_error = "89|75"
    urgent_pointer = "00|00"
    result = src_port+"|"+des_port+"|"+sequence_no+"|"+ack_no+"|"+data_offset_flags+"|"+Windows_size+"|"+cheacksum_error+"|"+urgent_pointer
    return result


@app.route('/')
def index():
    return render_template('index.html',data = "Server running")

# Add machines
@app.route('/add-machine',methods=['POST'])
def addMachine():
    data = request.json
    machine_data = fetchAllData()
    length = len(machine_data)
    machine_id = "machine-"+str(length)
    mac = data.get('MAC')
    ip = data.get('IP')
    port = data.get('PORT')
    machineData = {
        "MachineId":machine_id,
        "MAC":mac,
        "IP":ip,
        "PORT":port
    }
    collection.insert_one(machineData)
    return jsonify("Inserted...")


@app.route('/fetch-machine-data',methods=['POST'])
def fetchOne():
    data = request.json
    machineId = data.get('machineId')
    data = fetchMachineData(machineId)
    return jsonify(data)


@app.route('/fetch-machines-data')
def fetchAll():
    data = fetchAllData()
    # Remove the _id field from each document
    for item in data:
        if '_id' in item:
            del item['_id']
    return jsonify(data)


@app.route('/<string:direction>-rules',methods=['POST'])
def get_rules(direction):
    if direction not in ['inbound', 'outbound']:
        return jsonify({"error": "Invalid direction or action"}), 400
    rules = fetchRules(direction)
    return jsonify(rules)

# configure firewall
@app.route('/config-firewall/<string:direction>-<string:action>', methods=['POST'])
def handleFirewallRule(direction, action):
    data = request.json
    ip = data.get('IP')
    port = data.get('PORT')

    # Validate IP and PORT
    if not ip or not port:
        return jsonify({"error": "IP and PORT are required"}), 400

    # Validate direction and action
    if direction not in ['inbound', 'outbound'] or action not in ['accept', 'reject']:
        return jsonify({"error": "Invalid direction or action"}), 400
    
    try:
        ip_segments = ip.split('|')
        decimal_ip = '.'.join(str(int(segment, 16)) for segment in ip_segments)
    except ValueError:
        return jsonify({"error": "Invalid hex format for IP or PORT"}), 400

    result = addRule(decimal_ip,port,direction,action)
    return jsonify(result)

    
# apply firewall
@app.route('/apply',methods=['POST'])
def applyFirewall():
    data = request.json
    srcMachineId = data.get('srcId')
    desMachineId = data.get('desId')
    protocol = data.get('protocol')
    
    srcMachineData = fetchMachineData(srcMachineId)
    desMachineData = fetchMachineData(desMachineId)
    packet = ""
    ether_header = addEtherHeader(srcMachineData["MAC"],desMachineData["MAC"])
    ip_header = addIPHeader(srcMachineData["IP"],desMachineData["IP"],protocol)
    tcp_header = addTCPHeader(srcMachineData["PORT"],desMachineData["PORT"])
    packet = ether_header + ip_header + tcp_header
   
    firewall_check_result = main(packet)  # could return "accepted" or "rejected"

    print(firewall_check_result)
    
    # Prepare the response object with checkpoint details
    response = {
        "srcMac": srcMachineData["MAC"],
        "destMac": desMachineData["MAC"],
        "srcIP": srcMachineData["IP"],
        "destIP": desMachineData["IP"],
        "srcPort": srcMachineData["PORT"],
        "destPort": desMachineData["PORT"],
        "status": firewall_check_result
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True,port = 5000)