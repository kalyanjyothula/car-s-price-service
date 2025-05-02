from typing import List
from setuptools import setup, find_packages

HYPEN_E_DOT='-e .'
def get_requirements(file_path: str):

    requirements=[]
    with open(file_path, encoding="utf-8") as file_obj:
        requirements=file_obj.readlines()
        requirements=[req.replace("\n","") for req in requirements]

        if HYPEN_E_DOT in requirements:
            requirements.remove(HYPEN_E_DOT)
    return requirements


setup(
    name="cars-data",
    version='0.0.1',
    author='KalyanJyothula',
    author_email='kalyanjyothula@gmail.com',
    packages=find_packages(),
    install_requires=get_requirements('requirements.txt')
)