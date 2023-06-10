import { AppWallet, BlockfrostProvider, Transaction } from "@meshsdk/core"
import { BLOCKFROST_API_KEY, WALLET_SEED, TOKEN_ID, AMOUNT, RECIPIENTS } from "./config.json"

const provider = new BlockfrostProvider(BLOCKFROST_API_KEY)

const wallet = new AppWallet({
    networkId: 1,
    fetcher: provider,
    submitter: provider,
    key: {
        type: "mnemonic",
        words: WALLET_SEED
    }
})

var tx = new Transaction({initiator: wallet})

for(const recipient of RECIPIENTS) {
    // Resolve ADA handles to addresses
    const addr = recipient.substring(0,4).includes("addr1") ? recipient : await provider.fetchHandleAddress(recipient.replace("$",""))

    tx = tx.sendAssets(addr, [
        {
            unit: TOKEN_ID,
            quantity: AMOUNT
        }
    ])
}

const unsignedTx = await tx.build()

const signedTx = await wallet.signTx(unsignedTx)

console.log(await wallet.submitTx(signedTx))