import configparser

class rule_engine():
    # loading the data from .ini file
    def __init__(self):
        self.in_config = configparser.ConfigParser()
        self.out_config = configparser.ConfigParser()
        self.in_config.read('src/inbound rules.ini')
        self.out_config.read('src/outbound rules.ini')

    # function for checking inbound rules
    def checkInboundRules(self, ip_address, port):

        for i in self.in_config['Accepting ip']:
            if(i == ip_address and port in self.in_config['Accepting ip'][i].split(",")):
                return "Accept"

        for i in self.in_config['Declining ip']:
            if(i == ip_address and port in self.in_config['Declining ip'][i].split(",")):
                return "Decline"


        for i in self.in_config['Rejecting ip']:
            if(i == ip_address and port in self.in_config['Rejecting ip'][i].split(",")):
                return "Reject"

        return "No rule associated!!!! Please assign a rule"


    # function for checking outbounds rules
    def checkOutboundRules(self, ip_address, port):
        for i in self.out_config['Accepting ip']:
            if(i == ip_address and (port in self.out_config['Accepting ip'][i].split(","))):
                return "Accept"

        for i in self.out_config['Declining ip']:
            if(i == ip_address and (port in self.out_config['Declining ip'][i].split(","))):
                return "Decline"


        for i in self.out_config['Rejecting ip']:
            if(i == ip_address and (port in self.out_config['Rejecting ip'][i].split(","))):
                return "Reject"

        return "No rule associated!!!! Please assign a rule"