from setuptools import find_packages,setup

from typing import List

def get_requirements()->list[str]:
  """
  This function will return list of requirements
  """
  requirements_list:list[str]=[]
  try:
    with open('requirements.txt','r') as file:
      lines=file.readlines()
      for line in lines:
        requirements=line.strip()
        #ignore empty linesand -e.
        if requirements and requirements != '-e .':
          requirements_list.append(requirements)
  except FileNotFoundError:
    print("requirements.txt file not found !")        
  return requirements_list
setup(
  name="NetworkSecurity",
  version='0.0.1',
  auther="kalakanhu swain",
  author_email="kalakanhuswain18@gmail.com",
  packages=find_packages(),
  install_requires=get_requirements()
)
