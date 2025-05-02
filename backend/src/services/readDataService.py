import os
import time
import re
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager


class ReadDataFromSite():

    def __init__(self):
        self.read = False
        self.url = ''

        self.options = Options()
        self.options.add_argument("--headless")  # Run in headless mode (no browser UI)
        self.options.add_argument("--disable-gpu")
        self.options.add_argument("--window-size=1920x1080")
        self.options.add_argument("--no-sandbox")
        self.options.add_argument("--disable-dev-shm-usage")

        self.service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=self.service, options=self.options)

    def readData(self, URL):
            self.url = URL
            # URL = "https://www.cardekho.com"
            self.driver.get(URL)
            time.sleep(5)  # Wait for JavaScript to load content
            asideTags = self.driver.find_elements(By.TAG_NAME, "aside")
            car_list = []
            for aside in asideTags:
                try:
                    scripts = aside.find_elements(By.TAG_NAME, 'script')  # Extract JSON
                    if scripts: 
                        for script in scripts:
                            try:
                                script_content = script.get_attribute("innerHTML") 
                                match = re.search(r'window\.__CD_DATA__\s*=\s*({.*?});', script_content, re.DOTALL)
                                if match:
                                    json_text = match.group(1)  # Extract the JSON-like part
                                    try:
                                        json_data = json.loads(json_text)  # Convert to Python dictionary
                                        car_list.append(json_data)
                                    except json.JSONDecodeError:
                                        print("Skipping: Invalid JSON in window.__CD_DATA__")   
                            except Exception as e:
                                print("script tag: InnerHtml failed", e)
                                continue
                    else:
                        print("Invalid JSON found in script tag")
                except Exception as e:
                    print("Error: At ReadDataFromSite line 55", e)
                    continue 
            self.driver.quit()
            if(len(car_list)): return car_list
            return []
    
    def saveToFile(self, car_list):
        try:
            filename = os.path.join(f'src\\data\\data_cars.json')
            os.makedirs(os.path.dirname(filename), exist_ok=True)
            if os.path.exists(filename):
                with open(filename, "r") as src, open(f"{filename}_bkp", "w") as dest:
                    dest.write(src.read())

            with open(filename, "w", encoding="utf-8") as file:
                json.dump(car_list, file, indent=4)
        except Exception as e:
            print("Error : saveToFile ", e)

    def readSpecData(self, path):
        try:
            specUrl = path + "/specs"
            self.driver.get(specUrl)
            time.sleep(5)
            asideTags = self.driver.find_elements(By.TAG_NAME, "aside")
        except Exception as e:
            print("Error : readSpecData ", e)