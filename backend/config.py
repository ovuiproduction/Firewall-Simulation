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


def deleteRule(ip, port, direction, action):
    try:
        # File path for the .ini file
        config_file_path = ""
        if direction == "inbound":
            config_file_path = os.path.join('src', 'inbound_rules.ini')
        elif direction == "outbound":
            config_file_path = os.path.join('src', 'outbound_rules.ini')
        
        # Create ConfigParser instance
        config = configparser.ConfigParser()
        config.read(config_file_path)

        section = None
        if action == "accept":
            section = "Accepting ip"
        elif action == "reject":
            section = "Rejecting ip"
        
        if not section or section not in config.sections():
            print(f"Section '{section}' not found in the configuration file.")
            return False
        
        # Check if the IP exists in the section
        if ip in config[section]:
            # Get the existing ports for the IP
            existing_ports = config[section][ip].split(',')
            existing_ports = [p.strip() for p in existing_ports if p.strip()]
            
            port_list = port.split(',')
            
            # Remove the specified port
            for port in port_list:
                if str(port) in existing_ports:
                    existing_ports.remove(str(port))
                    if existing_ports:
                        # Update the IP entry with the remaining ports
                        config[section][ip] = ','.join(sorted(existing_ports))
                    else:
                        # If no ports are left, remove the IP entry entirely
                        config.remove_option(section, ip)
                    
                # Save changes back to the file
                with open(config_file_path, 'w') as configfile:
                    config.write(configfile)
                
                return True
            else:
                return False
            
        else:
            return False

    except Exception as e:
        print(f"Error occurred: {e}")
        return False