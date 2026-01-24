import requests 
from bs4 import BeautifulSoup 
import json, os, re #re is for regular expressions

URL = "https://en.wikipedia.org/wiki/Exoplanet"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/120.0 Safari/537.36"
}
#Headers is used to prevent blocking by some websites.

def scrape():
    print("🚀 Scraping Wikipedia Exoplanet Facts...")

    res = requests.get(URL, headers=HEADERS, timeout=20)
    #The requests.get() method is used to make a GET request to the specified URL and returns a Response object.
    print("Status:", res.status_code)

    soup = BeautifulSoup(res.text, "html.parser") #Parsing the HTML content of the response using BeautifulSoup.

    paragraphs = soup.select("p") #Selecting all paragraph elements from the parsed HTML.
    print("Total paragraphs found:", len(paragraphs))

    facts = []
    fact_id = 1

    for p in paragraphs:
        text = p.get_text(" ", strip=True)

        if len(text) < 120:
            continue

        text = re.sub(r"\[\d+\]", "", text)  # remove [1], [2] refs

        facts.append({
            "id": fact_id,
            "title": f"Exoplanet Fact #{fact_id}",
            "fact": text
        })
        fact_id += 1

        if fact_id > 12:
            break

    os.makedirs("static/data", exist_ok=True)
    with open("static/data/exoplanet_facts.json", "w", encoding="utf-8") as f:
        json.dump(facts, f, indent=4, ensure_ascii=False)

    print(f"✅ Saved {len(facts)} facts")

if __name__ == "__main__":
    scrape()
