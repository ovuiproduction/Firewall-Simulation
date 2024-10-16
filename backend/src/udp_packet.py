class udp_packet():

    def __init__(self, srcIP, dstIP, srcPort, dstPort):
        self.srcIP = srcIP
        self.dstIP= dstIP
        self.srcPort = srcPort
        self.dstPort = dstPort

    def getSrcIP(self):
        return self.srcIP

    def getMACaddress(self):
        return self.MACaddress
    
    def getDstIP(self):
        return self.dstIP

    def getSrcPort(self):
        return self.srcPort

    def getDstPort(self):
        return self.dstPort
