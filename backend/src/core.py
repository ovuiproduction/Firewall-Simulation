from util import getIpAddress,getPort, isSrc
from tcp_packet import tcp_packet
from udp_packet import udp_packet
from rule_engine import rule_engine

def main(f):
    # packet loading 
    s = f 
    
    # Removing the offset present in the packet
    s = s.split("|")
    
    # Destination MAC Address
    SrcMacaddress = s[0]+":"+s[1]+":"+s[2]+":"+s[3]+":"+s[4]+":"+s[5]
   
    # Source MAC Address
    DesMacaddress =s[6]+":"+s[7]+":"+s[8]+":"+s[9]+":"+s[10]+":"+s[11] 
   
    #### IP HEADER
    # checking for Protocol used 
    # in the packet hex sequence 
    # 23 => indicate the protocol
    # if 06 => TCP and if 11 => UDP

    # getIpAddress() 
    # in the packet sequence 
    # 26-27-28-29 => Source IP
    # 30-31-32-33 => Destination IP
    
    #### TCP HEADER 
    # getPort()
    # 34-35 => Source Port
    # 36-37 => Destination Port
    
    if(s[23]== "06"):
        packet = tcp_packet(
                        getIpAddress(s[26:30]), \
                        getIpAddress(s[30:34]),\
                        getPort(s[34:36]), \
                        getPort(s[36:38]) )
    elif(s[23]== "11"):
        packet = udp_packet(
                        getIpAddress(s[26:30]), \
                        getIpAddress(s[30:34]),\
                        getPort(s[34:36]), \
                        getPort(s[36:38]) )
        
    # r is the rule engine variable
    r = rule_engine()
    
    # variable for acknowledgement of successfully transmisson / receiving of packets
    result = ""
    # Checking if Source MAC Address is of my Device then Packet is transporting
    if(isSrc(['F0','77','C3','F0','D9','17'],s[0:6])):
        print("packet going out of our server..")
        # As packet is tranporting from my device we check the outbound rules
        result = r.checkOutboundRules(packet.getDstIP(), packet.getDstPort())

    # if the Source MAC is notmatched with my device MAC that means receiving the packet
    else:
        print("packet comes to our server..")
        # As packet is receiving by our device we check for inbound rules
        result = r.checkInboundRules(packet.getSrcIP(), packet.getSrcPort())

    return result