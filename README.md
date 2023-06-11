# cardano-utils
Utility scripts for interacting with the Cardano blockchain. Requires a mainnet [Blockfrost](https://blockfrost.io) API key to utilise.

## airdrop
Dispense native assets to a list of recipient addresses and/or ADA handles.

Rename config_example.json to config.json and populate each field:

```
BLOCKFROST_API_KEY: Mainnet Blockfrost API key,
WALLET_SEED: 24-word mnemonic for source wallet,
TOKEN_ID: Policy ID + Hex asset name,
AMOUNT: Assets to drop per recipient,
RECIPIENTS: List of addresses and/or ADA handles
```
