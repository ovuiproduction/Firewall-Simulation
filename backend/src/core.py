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
    DesMacaddress = s[0]+":"+s[1]+":"+s[2]+":"+s[3]+":"+s[4]+":"+s[5]
    print("Destination MacAddress : ",DesMacaddress)
    
    # Source MAC Address
    MACaddress =s[6]+":"+s[7]+":"+s[8]+":"+s[9]+":"+s[10]+":"+s[11] 
    print("Source MacAddress : ",MACaddress)
    
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
        packet = tcp_packet(MACaddress,\
                        getIpAddress(s[26:30]), \
                        getIpAddress(s[30:34]),\
                        getPort(s[34:36]), \
                        getPort(s[36:38]) )
    elif(s[23]== "11"):
        packet = udp_packet(MACaddress,\
                        getIpAddress(s[26:30]), \
                        getIpAddress(s[30:34]),\
                        getPort(s[34:36]), \
                        getPort(s[36:38]) )
    print(packet.String())
    # f.readline()

    # r is the rule engine variable
    r = rule_engine()
    
    # variable for acknowledgement of successfully transmisson / receiving of packets
    isSuccess = False
    # Checking if Source MAC Address is of my Device then Packet is transporting
    if(isSrc(['F0','77','C3','F0','D9','17'],s[6:12])):
        print("packet going out of our server..")
        
        # Source Information Printing
        print("source ip:{} and port:{} will {}".
                format(packet.getSrcIP(),\
                packet.getSrcPort(),\
                r.checkOutboundRules(packet.getSrcIP(), packet.getSrcPort())))
        
        # Destination Information Printing
        print("Destination ip:{} and port:{} will {}".
                format(packet.getDstIP(),\
                packet.getDstPort(),\
                r.checkOutboundRules(packet.getDstIP(), packet.getDstPort())))

        # As packet is tranporting from my device we check the outbound rules
        isSuccess = r.checkOutboundRules(packet.getSrcIP(), packet.getSrcPort()) == 'Accept' and \
                    r.checkOutboundRules(packet.getDstIP(), packet.getDstPort()) == 'Accept'

    # if the Source MAC is notmatched with my device MAC that means receiving the packet
    else:
        print("packet comes to our server..")
        # Source info
        print("source ip:{} and port:{} will {}".
                format(packet.getSrcIP(),\
                packet.getSrcPort(),\
                r.checkInboundRules(packet.getSrcIP(), packet.getSrcPort())))
        # Destination info
        print("Destination ip:{} and port:{} will {}".
                format(packet.getDstIP(),\
                packet.getDstPort(),\
                r.checkInboundRules(packet.getDstIP(), packet.getDstPort())))
        
        # As packet is receiving by our device we check for inbound rules
        isSuccess = r.checkInboundRules(packet.getSrcIP(), packet.getSrcPort()) == 'Accept' and \
                    r.checkInboundRules(packet.getDstIP(), packet.getDstPort()) == 'Accept'


    if(isSuccess):
        print("Packet transmission successfull")
        return "accepted"
    else:
        print("Packet transmission unsuccessfull!!! Packet Dropped")
        return "rejected"