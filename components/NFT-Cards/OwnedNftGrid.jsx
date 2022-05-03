import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import { Grid } from "@nextui-org/react";
import NftSingleCard from "./NftSingleCard";
import { CONTRACT } from "../../secret.json";
import NFTMarket from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json'


export default function OwnedNftGrid() {

    const [allItems, setAllItems] = useState([])

    useEffect(() => {
        async function fetchNfts() {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const walletAddress = await signer.getAddress()
            let contract = new ethers.Contract(CONTRACT, NFTMarket.abi, signer)
            let items = await contract.getOwnedItems(walletAddress)
            setAllItems(items)
        }
        fetchNfts()
    }, [])


    return (
        <>
            <Grid.Container gap={2} justify="center">
                {allItems.map((items, i) =>
                    items.itemId != 0 ?
                        <Grid key={i} xs={12} sm={4} md={3}>
                            <NftSingleCard id={Number(items.itemId)} />
                        </Grid>
                    : ""
                )}
            </Grid.Container>
        </>
    )
}