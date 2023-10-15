import { AppWallet, BlockfrostProvider, Transaction } from "@meshsdk/core"
import { BlockFrostAPI } from "@blockfrost/blockfrost-js"
import fs from "fs"

const { BLOCKFROST_API_KEY, WALLET_SEED, TOKENS, RECIPIENTS } = JSON.parse(fs.readFileSync("./config.json"))

const CIP_68_PREFIX = "000de140"
const HANDLE_POLICY_ID = "f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a"

const blockfrost = new BlockFrostAPI({
    projectId: BLOCKFROST_API_KEY,
    network: "mainnet"
})

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

console.log(`Loaded wallet with payment addr: ${wallet.getPaymentAddress()}`)

async function main() {
    var tx = new Transaction({ initiator: wallet })

    let filteredRecipients = removeDuplicates(RECIPIENTS)

    console.log(`Filtered ${RECIPIENTS.length - filteredRecipients.length} duplicate address(es).`)

    for (const recipient of filteredRecipients) {
        // Resolve ADA handles to addresses
        const addr = recipient.substring(0, 5).includes("addr1") ? recipient :
            await resolveHandleAddress(recipient.replace("$", ""))
                .catch((e) => { console.log(`Addr not found for handle ${recipient}`, e) })
                .finally(async (e) => { await sleep(50) })

        if (addr) {
            tx = tx.sendAssets(addr, TOKENS)

            console.log("Added output to tx:", addr, TOKENS)
        }
    }

    const unsignedTx = await tx.build()

    const signedTx = await wallet.signTx(unsignedTx)

    console.log(await wallet.submitTx(signedTx))
}

async function resolveHandleAddress(handleString) {
    let handles = [
        strToHex(handleString),
        `${CIP_68_PREFIX}${strToHex(handleString)}`
    ]

    for (let handle of handles) {
        let addresses = await blockfrost.assetsAddresses(`${HANDLE_POLICY_ID}${handle}`)
            .catch((e) => { if(e.status_code !== 404) console.log(e) })

        if (addresses?.length > 0) {
            let filteredAddresses = addresses.filter(e => e.quantity === "1")

            if (filteredAddresses?.length > 0) {
                console.log("Resolved address for handle:", handleString)

                return filteredAddresses[0].address
            }
        }
    }

    return null
}

function removeDuplicates(array) {
    return [...new Set(array)]
}

function strToHex(str) {
    return Buffer.from(str, "utf-8").toString("hex")
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

main()