import json
import os
from dotenv import load_dotenv
from algoliasearch.search.client import SearchClientSync

load_dotenv()

INDEX_NAME = os.environ.get("ALGOLIA_INDEX", "shiny-prototype-dev")

# %% load search.json ----
print("Loading ./search_crumbs.json...")
objects = json.load(open("./search_crumbs.json"))
batch_ops = [{"action": "addObject", "body": obj} for obj in objects]
print(f"Loaded {len(objects)} objects")


# %% replace index ----
client = SearchClientSync(
    os.environ["ALGOLIA_APP_ID"],
    os.environ["ALGOLIA_API_KEY_WRITE"],
)

print(f"Clearing index '{INDEX_NAME}'...")
response = client.clear_objects(
    index_name=INDEX_NAME,
)

print(f"Uploading {len(batch_ops)} objects to '{INDEX_NAME}'...")
client.batch(index_name=INDEX_NAME, batch_write_params={"requests": batch_ops})
print("Done.")

# %%
