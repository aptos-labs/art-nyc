# Art Gallery: Move

## Note
In hindsight we should've written the contract so it could support multiple collections, but that's not really what we did. So we just copy paste the code and deploy the contract twice, one per collection.

## Mainnet
See runbook: https://www.notion.so/aptoslabs/Bay-Area-Office-Art-Experience-10d8b846eb7280669808c06f562ad677?pvs=4#832d24329c704ab3817fcf40205e7d6a.

## Testnet
To publish to testnet at a new address:
```
yes '' | aptos init --profile testnetpublish --assume-yes --network testnet && aptos move publish --profile testnetpublish --assume-yes --named-addresses addr=testnetpublish
```

Create the collection:
```
aptos move run --profile testnetpublish --assume-yes --function-id 0x`yq .profiles.testnetpublish.account < .aptos/config.yaml`::bayarea_collection::create
```
