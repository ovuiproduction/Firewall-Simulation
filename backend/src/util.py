# formating the IP address
def getIpAddress(array):
    s = ''
    for i in array:
        s = s + str(int(i, 16)) + '.'
    return s[:len(s)-1]

# formating the port conveting to string 
def getPort(s):
    i = s[0] + s[1]
    return str(int(i, 16))

# comparing two IP addresses (match or not match)
def isSrc(myaddress, address):
    for i in range(len(myaddress)):
        if(myaddress[i] != address[i]):
            return False
    return True
