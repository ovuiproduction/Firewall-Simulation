import os
import configparser

def fetchRules(direction):
    # File path for the .ini file
    config_file_path = ""
    if direction == "inbound" :  config_file_path = os.path.join('src', 'inbound_rules.ini')
    elif direction == "outbound" :  config_file_path = os.path.join('src', 'outbound_rules.ini')
    
    # Create ConfigParser instance
    config = configparser.ConfigParser()
    config.read(config_file_path)
    
    # Extract Accepting and Rejecting IPs
    accepting_rules = []
    rejecting_rules = []
    
    if 'Accepting ip' in config.sections():
        for ip, ports in config['Accepting ip'].items():
            accepting_rules.append({'ip': ip, 'ports': ports})
    
    if 'Rejecting ip' in config.sections():
        for ip, ports in config['Rejecting ip'].items():
            rejecting_rules.append({'ip': ip, 'ports': ports})
    
    # Return the rules
    return {'accepting': accepting_rules, 'rejecting': rejecting_rules}


def addRule(ip,port,direction,action):
    try:
        # File path for the .ini file
        config_file_path = ""
        if direction == "inbound" :  config_file_path = os.path.join('src', 'inbound_rules.ini')
        elif direction == "outbound" :  config_file_path = os.path.join('src', 'outbound_rules.ini')
        
        
        # Create ConfigParser instance
        config = configparser.ConfigParser()
        config.read(config_file_path)

        if action == "accept" :
            print("Accepted .....")
            # Ensure the [Accepting ip] section exists
            if 'Accepting ip' not in config.sections():
                config.add_section('Accepting ip')
            
            # Add the IP and PORT to the section
            if ip in config['Accepting ip']:
                # If the IP exists, append the port to existing ports
                existing_ports = config['Accepting ip'][ip]
                ports = set(existing_ports.split(','))  # Handle duplicates
                ports.add(str(port))
                config['Accepting ip'][ip] = ','.join(sorted(ports))
            else:
                # If the IP doesn't exist, add it with the port
                config['Accepting ip'][ip] = str(port)
        
        elif action == "reject" :
            # Ensure the [Accepting ip] section exists
            if 'Rejecting ip' not in config.sections():
                config.add_section('Rejecting ip')
            
            # Add the IP and PORT to the section
            if ip in config['Rejecting ip']:
                # If the IP exists, append the port to existing ports
                existing_ports = config['Rejecting ip'][ip]
                ports = set(existing_ports.split(','))  # Handle duplicates
                ports.add(str(port))
                config['Rejecting ip'][ip] = ','.join(sorted(ports))
            else:
                # If the IP doesn't exist, add it with the port
                config['Rejecting ip'][ip] = str(port)
        
        # Save changes back to the file
        with open(config_file_path, 'w') as configfile:
            config.write(configfile)
        
        return True
    
    except Exception as e:
        print(f"Error occurred: {e}")
        return False
        