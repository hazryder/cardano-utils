# cardano-utils
Utility scripts for interacting with the Cardano blockchain. Requires a mainnet [Blockfrost](https://blockfrost.io) API key to utilise.

## airdrop
Dispense native assets to a list of recipient addresses and/or ADA handles.
Add objects to the `tokens` array to send additional tokens per drop.

Rename config_example.json to config.json and populate each field:

```
{
    BLOCKFROST_API_KEY: string (Mainnet Blockfrost API key),
    WALLET_SEED: string[] (24-word mnemonic for source wallet),
    TOKENS: [
        {
            UNIT: string (Policy ID + Hex encoded asset name),
            QUANTITY: string (amount to send per recipient)
        },
        ...
    ],
    RECIPIENTS: string[] (List of addresses and/or ADA handles)
}
```
