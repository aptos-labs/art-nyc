import argparse
import logging
import json
from urllib.request import urlopen


logging.basicConfig(level="INFO", format="%(asctime)s - %(levelname)s - %(message)s")


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--debug", action="store_true")
    args = parser.parse_args()
    return args


def main():
    args = parse_args()

    if args.debug:
        logging.setLevel("DEBUG")

    # Open this URL
    url = "https://api.mainnet.aptoslabs.com/v1/accounts/0x9d672ee84bd09ce5eba14755ae3a1bb8b2a5e971bd1ea2922e8df5f61e33440e/resource/0x4c8732fad66998c2389abd3cb5ec9dc5b56245276477023a9fb43170969c7be6::nyc_collection::ArtData"
    logging.info(f"Opening URL: {url}")
    response = urlopen(url)
    data = json.loads(response.read().decode("utf-8"))
    art_data = data["data"]["data"]["data"]
    logging.info(f"Art data: {art_data}")
    keys = []
    for data in art_data:
        keys.append(data["key"])
    for key in keys:
        url = f"https://art-nyc.aptoslabs.com/mint/{key}"
        print(url)
        print(f"{url}?network=mainnet")


if __name__ == "__main__":
    main()
