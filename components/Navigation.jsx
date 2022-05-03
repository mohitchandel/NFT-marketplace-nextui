import { ethers } from "ethers"
import { useState } from "react";
import { Container, Button, Row, Text, Col, Link } from "@nextui-org/react";



const Navigation = () => {

    const [address, setAddress] = useState('');

    const connectWallet = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = provider.getSigner()
        const accountAddress = await signer.getAddress()
        setAddress(accountAddress)
    }

    return (
        <>
            <Container css={{ backgroundColor: "#000", padding: "20px" }}>
                <Row justify="center" align="center">
                    <Col>
                        <Text color="white" justify="center" align="end" h6 size={15} css={{ m: 0 }}>
                            <Link color="white" href="/">Home</Link>
                        </Text>
                    </Col>
                    <Col>
                        <Text color="white" justify="center" align="center" h6 size={15} css={{ m: 0 }}>
                            <Link color="white" href="/mynfts">My NFT's</Link>
                        </Text>
                    </Col>
                    <Col>
                        <Text color="white" justify="center" align="start" h6 size={15} css={{ m: 0 }}>
                            <Link color="white" href="/createitem">Create Item</Link>
                        </Text>
                    </Col>
                    <Col>
                        {address ?
                            <Text color={"white"}>
                                Connected: {address}
                            </Text>
                            :
                            <Button color={"gradient"} onClick={connectWallet}>Connect Wallet</Button>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Navigation;
