import json
import os


class PathsGenerator():

    def __init__(self):
        self.companyDetails = []
    def get_company_details(self):
        try:
            filename = os.path.join(f'src\\data\\data_cars.json')
            print("FileName:", filename)
            with open(filename, "r") as file:
                data = json.load(file)
            if(data and data[0].get('mmv')):
                self.companyDetails = data[0].get('mmv')

            return self.companyDetails
        except Exception as e:
            print("Error reading", e)
            
    def get_company_paths(self, company = None):
        try:
            if(company is None):  return []
            cars_list = company.get('CM', '')
            cars_main = company.get('oem', '').lower().replace(' ','-')
            path_list = []
            for car in cars_list:
                current =car.get('SLG')
                if current:
                    url =  cars_main +'/'+ current
                    path_list.append(url)
            return path_list
        except Exception as e:
            print("Error reading", e)