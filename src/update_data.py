import json
import pandas as pd
import re

pola = r"\d\d\d21\d\d\d"
dict_nim = {}

#IMPORT THE 21 VERSION OF THE NIM DATA
with open('public/json/data_13_21.json') as fp:
    data = json.load(fp)

# IMPORT NEW DATA
df = pd.read_excel("public/NIMangkatan21.xlsx")

# MAKE DICT SO SEARCH IS OPTIMIZED
for i, j in df.iterrows():
    dict_nim[str(j[2])] = str(j[0])

for item in data :
    if re.findall(pola,item[1]):
        if item[0] in dict_nim:
            item.append(dict_nim[item[0]])

# Writing and Serializing json
json_object = json.dumps(data)
 
# Writing to sample.json
with open("public/json/data_13_22.json", "w") as outfile:
    outfile.write(json_object)