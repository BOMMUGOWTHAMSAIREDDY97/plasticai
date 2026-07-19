import requests
import json
import time

def fetch_recycling_centers():
    query = """
    [out:json][timeout:60];
    area["ISO3166-1"="IN"][admin_level=2]->.searchArea;
    (
      node["amenity"="recycling"](area.searchArea);
    );
    out center;
    """
    url = 'https://overpass-api.de/api/interpreter'
    headers = {'User-Agent': 'PlasticVisionApp/1.0'}
    
    print("Fetching data from Overpass API (POST)...")
    response = requests.post(url, data={'data': query}, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        elements = data.get('elements', [])
        print(f"Found {len(elements)} recycling centers.")
        return elements
    else:
        print(f"Failed to fetch data: {response.status_code}")
        print(response.text)
        return []

if __name__ == "__main__":
    elements = fetch_recycling_centers()
    with open("overpass_results.json", "w", encoding="utf-8") as f:
        json.dump(elements, f, indent=2)
    print("Saved to overpass_results.json")
