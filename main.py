import requests
from bs4 import BeautifulSoup
import fake_useragent
import time

import pymongo

# Подключиться к MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")

# Создать базу данных
mydb = client["mydatabase"]

# Создать коллекцию (эквивалент таблице в реляционной базе данных)
mycollection = mydb["vacancy"]

def get_links():
    ua = fake_useragent.UserAgent()
    data = requests.get(
        url=f"https://hh.ru/search/vacancy?area=113&excluded_text=интерьер&ored_clusters=true&schedule=remote&search_field=name&text=Дизайнер&search_period=1",
        headers={"user-agent":ua.random}
    )
    if data.status_code != 200:
        return

    soup = BeautifulSoup(data.content, "lxml")
    try:
        page_count=int(soup.find("div",attrs={"class":"pager"}).find_all("span",recursive=False)[-1].find("a").find("span").text)
    except:
        return
    for page in range(page_count):
        try: # https://hh.ru/search/vacancy?area=113&ored_clusters=true&schedule=remote&search_period=1&search_field=name&enable_snippets=false&excluded_text=интерьер&text=дизайнер&page={page}
            data = requests.get( #https://hh.ru/search/vacancy?area=113&excluded_text=интерьер&ored_clusters=true&schedule=remote&search_field=name&text=Дизайнер&search_period=1
                url=f"https://hh.ru/search/vacancy?area=113&ored_clusters=true&schedule=remote&search_period=1&search_field=name&enable_snippets=false&excluded_text=интерьер&text=дизайнер&page={page}",
                headers={"user-agent":ua.random}
            )
            if data.status_code != 200:
                continue
            soup = BeautifulSoup(data.content, "lxml")
            for a in soup.find_all("a", attrs={"class":"bloko-link", "target":"_blank"}):
                url = a.attrs['href']
                if url != "https://feedback.hh.ru/article/details/id/5951":
                    yield url
        except Exception as e:
            print(f"{e}")
        time.sleep(1)

def get_vacancy(link):
    ua = fake_useragent.UserAgent()
    data = requests.get(
        url=link,
        headers={"user-agent":ua.random}
    )
    if data.status_code != 200:
        return
    soup = BeautifulSoup(data.content, "lxml")
    try:
        name = soup.find(attrs={"data-qa":"vacancy-title","class":"bloko-header-section-1"}).text
    except:
        name = ""
    try:
        salary = soup.find("div", attrs={"data-qa":"vacancy-salary"}).find("span", attrs={"class":"bloko-header-section-2_lite"}).text.replace("\xa0", "")
    except:
        salary = ""
    try:
        tags = [tag.text.replace("\xa0", " ") for tag in soup.find(attrs={"class":"bloko-tag-list"}).find_all(attrs={"class":"bloko-tag__section_text", "data-qa":"bloko-tag__text"})]
    except:
        tags = []
    date = soup.find("p", attrs={"class":"vacancy-creation-time-redesigned"}).find("span").text.replace("\xa0", " ")
    try:
        city = soup.find(attrs={"data-qa":("vacancy-view-location", "vacancy-view-raw-address")}).text.split(",")[0]
    except:
        city = ""
    
    vacancy = {
        "link":link,
        "name":name,
        "salary":salary,
        "date":date,
        "city":city,
        "tags":tags
        
    }
    return vacancy

def insert_vacancy(vacancy):
    # Подключаемся к локальной базе данных MongoDB

    # Проверяем, существует ли вакансия в базе данных
    existing_vacancy = mycollection.find_one({"link": vacancy["link"]})

    if existing_vacancy is None:
        # Вставляем новую вакансию в базу данных
        mycollection.insert_one({
            "date": vacancy["date"],
            "link": vacancy["link"],
            "name": vacancy["name"],
            "salary": vacancy["salary"],
            "city": vacancy["city"]
        })


if __name__ == "__main__":
    data = []
    for a in get_links():
        vacancy = get_vacancy(a)
        data.append(vacancy)
        time.sleep(2)

        # Insert the new vacancy into the database
        insert_vacancy(vacancy)