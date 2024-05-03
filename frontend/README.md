# Aptos NYC Art Frontend

## Development
Run the development server:
```bash
pnpm start
```

## Surf
We use [Surf](https://github.com/ThalaLabs/surf). Surf requires the ABI of the Move module in the JSON format that comes from the node API. First, spin up the localnet environment (run this from the root of the repo):
```
python scripts/start_local_env.py -f
```

Run this to get the ABIs as JSON:
```
curl -s http://127.0.0.1:8080/v1/accounts/0x296102a3893d43e11de2aa142fbb126377120d7d71c246a2f95d5b4f3ba16b30/modules | jq .[].abi | pbcopy
```

Paste those into this file:
```
src/types/abis.ts
```

## Notes
Be careful about updating the GraphQL codegen deps because of this issue: https://github.com/dotansimha/graphql-code-generator/issues/9046.

TODO: postcss might not be working properly. I see in IC it has postcss and postcss-import as explicit dev deps. postcss-import is used in the postcss config file.

TODO: The storybook for Input and TextArea shows examples for FormField.
