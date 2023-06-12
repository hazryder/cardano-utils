# cardano-utils
Utility scripts for interacting with the Cardano blockchain. Requires a mainnet [Blockfrost](https://blockfrost.io) API key to utilise.

## airdrop
Dispense native assets to a list of recipient addresses and/or ADA handles.
Add objects to the `tokens` array to send additional tokens per drop.

Rename config_example.json to config.json and populate each field:

```
blockfrostApiKey: Mainnet Blockfrost API key,
walletSeed: 24-word mnemonic for source wallet,
tokens: [
  {
    unit: Policy ID + Asset ID hex,
    quantity: Amount to send
  },
  ...
]
recipients: Array of addresses and/or ADA handles
```
