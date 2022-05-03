import { useState } from 'react';
import { Container, Input, Textarea, Row, Button } from "@nextui-org/react";
import Navigation from "../components/Navigation"
import { create } from 'ipfs-http-client'
import { ethers } from 'ethers'
import {CONTRACT} from "../secret.json";

import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

const ipfsClient = create('https://ipfs.infura.io:5001/api/v0')

export default function MyNfts() {

    const [fileUrl, setFileUrl] = useState("")
    const [inputValues, updateInputValues] = useState({ name: '', desc: '', price: '' })

    async function fileUploaded(e) {
        const file = e.target.files[0]
        try {
            const addedFile = await ipfsClient.add(
                file,
                {
                    progress: (prog) => console.log(`received: ${prog}`)
                }
            )
            const fileUrl = `https://ipfs.infura.io/ipfs/${addedFile.path}`
            setFileUrl(fileUrl)
        } catch (error) {
            console.log('Error uploading file: ', error)
        }
    }

    const listItem = async () => {

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()

        if (!inputValues.price || !inputValues.name || !inputValues.desc || !fileUrl) {
            alert("Please fill al the input values")
            return;
        }

        const name = inputValues.name
        const desc = inputValues.desc
        const price = ethers.utils.parseUnits(inputValues.price, 'ether')
        let contract = new ethers.Contract(CONTRACT, NFTMarket.abi, signer)
        let tx = await contract.listItem(name, desc, price, fileUrl)
        await tx.wait()
    }

    return (
        <>
            <div>
                <Navigation />
            </div>
            <Container>
                <Row css={{ padding: "30px 0" }} justify="center" align="center">
                    <Input
                        size="lg"
                        bordered
                        label="Name"
                        color="primary"
                        helperText="Please enter NFT name"
                        onChange={e => updateInputValues({ ...inputValues, name: e.target.value })} />

                </Row>
                <Row css={{ padding: "30px 0" }} justify="center">
                    <Textarea
                        size="lg"
                        bordered
                        color="primary"
                        label="Item description"
                        helperText="Please enter your description"
                        onChange={e => updateInputValues({ ...inputValues, desc: e.target.value })}
                    />

                </Row>
                <Row css={{ padding: "30px 0" }} justify="center">
                    <Input
                        size="lg"
                        bordered
                        label="Price (ETH)"
                        color="primary"
                        type="number"
                        min="0.1"
                        helperText="Please enter NFT price"
                        onChange={e => updateInputValues({ ...inputValues, price: e.target.value })} />

                </Row>
                <Row css={{ padding: "30px 0" }} justify="center">
                    <Input
                        underlined
                        size="lg"
                        label="NFT Image"
                        color="primary"
                        type="file"
                        helperText="Please enter file"
                        onChange={fileUploaded} />
                </Row>
                <Row css={{ padding: "30px 0" }} justify="center">
                    <Button onClick={listItem}>Create Item</Button>
                </Row>
            </Container>
        </>
    )
}