import { AppWallet, BlockfrostProvider, Transaction } from "@meshsdk/core"
import fs from "fs"

async function main() {
    if (!fs.existsSync("./config.json")) {
        console.log("Missing config.json file")

        return
    }

    const { blockfrostApiKey, walletSeed, tokens, recipients } = JSON.parse(fs.readFileSync("./config.json"))

    const provider = new BlockfrostProvider(blockfrostApiKey)

    const wallet = new AppWallet({
        networkId: 1,
        fetcher: provider,
        submitter: provider,
        key: {
            type: "mnemonic",
            words: walletSeed
        }
    })

    var tx = new Transaction({ initiator: wallet })

    for (const recipient of recipients) {
        // Resolve ADA handles to addresses
        const addr = recipient.substring(0, 5).includes("addr1") ? recipient :
            await provider.fetchHandleAddress(recipient.replace("$", ""))
                .catch((e) => { console.log(`Addr not found for handle ${recipient}`, e) })

        if (addr) {
            tx = tx.sendAssets(addr, tokens)
        }
    }

    const unsignedTx = await tx.build()

    const signedTx = await wallet.signTx(unsignedTx)

    console.log(await wallet.submitTx(signedTx))
}

main()