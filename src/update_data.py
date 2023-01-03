import json
import pandas as pd
import re

pola = r"\d\d\d21\d\d\d"
pola2 = r"\d\d\d22\d\d\d"
dict_nim = {}

def update21():
    #IMPORT THE 21 VERSION OF THE NIM DATA
    with open('public/json/data_13_21.json') as fp:
        data = json.load(fp)

    # IMPORT NEW DATA
    df = pd.read_excel("public/NIMangkatan21.xlsx")

    # MAKE DICT SO SEARCH IS OPTIMIZED
    for i, j in df.iterrows():
        dict_nim[str(j[2])] = str(j[0])

    # UPDATE NIM 21
    for item in data :
        if re.findall(pola,item[1]):
            if item[0] in dict_nim:
                item.append(dict_nim[item[0]])

    # Writing and Serializing json
    json_object = json.dumps(data)
    
    # Writing to sample.json
    with open("public/json/data_13_22.json", "w") as outfile:
        outfile.write(json_object)

def update22():
    #IMPORT THE 22 VERSION OF THE NIM DATA
    with open('public/json/data_13_22.json') as fp:
        data = json.load(fp)

    new_data = []
    for sheet_num in range (1,27):
        sheet_name = "Table " + str(sheet_num)
        df2 = pd.read_excel("public/Nilai_22.xlsx", sheet_name=sheet_name)

        for i, j in df2.iterrows():
            if not pd.isna(j["NAMA"]) :
                if (isinstance(j["NIM"], float) or isinstance(j["NIM"], int)) and re.findall(pola2,str(j["NIM"])):
                    new_data.append([j["NAMA"], str(int(j["NIM"]))])

    data = data + new_data

    # Writing and Serializing json
    json_object = json.dumps(data)
    
    # Writing to sample.json
    with open("public/json/data_13_22.json", "w") as outfile:
        outfile.write(json_object)

def sortData():
    #IMPORT THE 22 VERSION OF THE NIM DATA
    with open('public/json/data_13_22.json') as fp:
        data = json.load(fp)

    Res = sorted(data, key=lambda x: x[0] )

        # Writing and Serializing json
    json_object = json.dumps(Res)
    
    # Writing to sample.json
    with open("public/json/data_13_22.json", "w") as outfile:
        outfile.write(json_object)

update21()
update22()
sortData()
