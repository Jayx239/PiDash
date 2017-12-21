import json
configPath = './config/'

class Server:
    def __init__(self):
        self.ip = ""
        self.port = ""
    def generate(self):
        print("Server configurator")
        self.ip = raw_input("Enter server ip: ")
        self.port = raw_input("Enter server port: ")
    def export(self):
            f = open(configPath + 'server.config','w')
            f.write(json.dumps(self.__dict__))
class Sql:
    def __init__(self):
        self.host = ""
        self.user = ""
        self.password = ""
        self.database = ""
    def generate(self):
        print("Sql configurator")
        self.host = raw_input("Enter host: ")
        self.user = raw_input("Enter database user: ")
        self.password = raw_input("Enter database password: ")
        self.database = raw_input("Enter database name: ")
    def export(self):
        f = open(configPath + 'sql.config','w')
        f.write(json.dumps(self.__dict__))


configTypes = ["Server","Sql"]
def printConfigTypes():
    index = 1
    for configType in configTypes:
        print('[' + str(index) + ']: ' + configType )
        index+=1

def getConfigObject(configType):
    if configType == '1':
        return Server()
    if configType == '2':
        return Sql()
    return None

print("Welcome to PiDash configurator")


keepRunning = True
while keepRunning:
    print("Select config file to create (q to quit)")
    printConfigTypes()
    userConfigType = raw_input('Config Type: ')
    if userConfigType == 'q':
        break
    config = getConfigObject(userConfigType)
    if config:
        config.generate()
        print(json.dumps(config.__dict__))
        export = raw_input("Export (y/n): ")
        if export == 'y':
            config.export()