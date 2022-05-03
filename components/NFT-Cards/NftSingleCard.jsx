import { useEffect, useState } from "react";
import { Card, Col, Row, Button, Text, Modal, Link, Image, textWeights } from "@nextui-org/react";
import { CONTRACT } from "../../secret.json";
import NFTMarket from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import { ethers } from 'ethers'


export default function NftSingleCard({ id }) {

    const [itemId, setItemId] = useState()
    const [itemName, setItemName] = useState()
    const [itemDescription, setItemDescription] = useState()
    const [itemOwner, setItemOwner] = useState()
    const [itemPrice, setItemPrice] = useState()
    const [itemUrl, setItemUrl] = useState()

    const [walletAddress, setWalletAddress] = useState()

    const [visible, setVisible] = useState(false);
    const handler = () => setVisible(true);
    const closeHandler = () => {
        setVisible(false);
        console.log("closed");
    };

    useEffect(() => {
        async function getSingleItem() {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const accountAddress = await signer.getAddress()
            setWalletAddress(accountAddress)
            let contract = new ethers.Contract(CONTRACT, NFTMarket.abi, signer)
            let item = await contract.getSingleItem(id)
            setItemId(item[id].itemId)
            setItemDescription(item[id].description)
            setItemName(item[id].name)
            setItemOwner(item[id].owner)
            setItemPrice(ethers.utils.formatEther(item[id].price))
            setItemUrl(item[id].tokenURI)
        }
        getSingleItem()
    }, [])

    async function buyNft() {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        let contract = new ethers.Contract(CONTRACT, NFTMarket.abi, signer)
        let balance = await provider.getBalance(await signer.getAddress());
        const value = ethers.utils.parseEther(itemPrice)
        if(ethers.utils.formatEther(balance) < value){
            alert("not enough funds")
            return
        }
        let tx = await contract.buyItem(itemId, { value: value })
        await tx.wait()
    }

    return (
        <>
            <Card cover css={{ w: "100%", p: 0 }}>
                <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
                    <Col>
                        <Text size={12} weight="bold" transform="uppercase" color="#9E9E9E">
                            {itemName}
                        </Text>
                        <Text size={12} p color="white">
                            {itemDescription}
                        </Text>
                        <Text size={10} color="white">
                            Owner : {itemOwner}
                        </Text>
                    </Col>
                </Card.Header>
                <Card.Body>
                    <Card.Image
                        src={itemUrl}
                        height={400}
                        width="100%"
                        alt="Relaxing app background"
                    />
                </Card.Body>
                <Card.Footer
                    blur
                    css={{
                        position: "absolute",
                        bgBlur: "#0f1114",
                        borderTop: "$borderWeights$light solid $gray700",
                        bottom: 0,
                        zIndex: 1,
                    }}
                >
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <Text color="#d1d1d1" size={12}>
                                        Price :
                                    </Text>
                                    <Text color="#d1d1d1" size={12}>
                                        {Number(itemPrice)} ETH
                                    </Text>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row justify="flex-end">
                                <Button.Group color="gradient" ghost>
                                    <Button
                                        flat
                                        auto
                                        rounded
                                        onClick={handler}
                                    >
                                        <Text
                                            css={{ color: "inherit" }}
                                            size={12}
                                            weight="bold"
                                            transform="uppercase"
                                        >
                                            View NFT
                                        </Text>
                                    </Button>
                                    {walletAddress == itemOwner ?
                                        <Button
                                            flat
                                            auto
                                            rounded
                                            disabled
                                            color="error"
                                        >
                                            <Text
                                                css={{ color: "inherit" }}
                                                size={12}
                                                weight="bold"
                                                transform="uppercase"
                                            >
                                                Already Owned
                                            </Text>
                                        </Button>
                                        : <Button
                                            flat
                                            auto
                                            rounded
                                            onClick={buyNft}
                                        >
                                            <Text
                                                css={{ color: "inherit" }}
                                                size={12}
                                                weight="bold"
                                                transform="uppercase"
                                            >
                                                Buy NFT
                                            </Text>
                                        </Button>}
                                </Button.Group>
                            </Row>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>

            <Modal noPadding open={visible} onClose={closeHandler}>
                <Modal.Header>
                    <Text id="modal-title" size={18}>
                        <Text b size={18}>
                            {itemName}
                        </Text>
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text size={10} id="modal-description">
                        {itemDescription}
                    </Text>
                    <Image
                        showSkeleton
                        src={itemUrl}
                        width={400}
                        height={490}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Row gap={1}>
                        <Col>
                            <Text justify="center" size={12}>
                                Price : {itemPrice} ETH
                            </Text>
                        </Col>
                        <Col >
                            <Row justify="flex-end">
                                <Button onClick={buyNft} auto>
                                    Buy NFT
                                </Button>
                            </Row>
                        </Col>
                    </Row>
                </Modal.Footer>
            </Modal>
        </>
    )
}
