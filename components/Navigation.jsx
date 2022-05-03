import { ethers } from "ethers"
import { useState } from "react";
import { Container, Button, Row, Text, Col, Grid } from "@nextui-org/react";
import Link from 'next/link'
import { useEffect } from "react";



const Navigation = () => {

    const [address, setAddress] = useState('');

    async function askToChangeNetwork() {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x4' }],
                });
            } catch (error) {
                if (error.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: '0x4',
                                    rpcUrl: 'https://rinkeby.infura.io/v3/',
                                },
                            ],
                        });
                    } catch (addError) {
                        console.error(addError);
                    }
                }
                console.error(error);
            }
        } else {
            alert('MetaMask is not installed');
        }
    }

    useEffect(() => {
        askToChangeNetwork()
    }, [])

    const connectWallet = async () => {
        if (typeof window !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            await provider.send("eth_requestAccounts", [])
            const signer = provider.getSigner()
            const accountAddress = await signer.getAddress()
            setAddress(accountAddress)
        } else {
            alert("please Install metamask")
        }
    }


    return (
        <>
            <Row css={{ backgroundColor: "#220760", padding: "10px 0", marginBottom: "30px" }} justify="center" align="center">
                <Col span={1}>
                </Col>
                <Col span={3}>
                    <Text color="white" h2 size={15} css={{ m: 0 }}>
                        <Link color="white" href="/">NFTs</Link>
                    </Text>
                </Col>
                <Col span={8}>
                    <Grid.Container css={{ display: "flex", alignItems: "center" }} justify="center" alignContent="center">
                        <Grid xs={2}>
                            <Text color="white" h6 size={15} css={{ m: 0 }}>
                                <Link color="white" href="/">All NFT Items</Link>
                            </Text>
                        </Grid>
                        <Grid xs={2}>
                            <Text color="white" h6 size={15} css={{ m: 0 }}>
                                <Link color="white" href="/mynfts">Owned NFT's</Link>
                            </Text>
                        </Grid>
                        <Grid xs={2}>
                            <Text color="white" h6 size={15} css={{ m: 0 }}>
                                <Link color="white" href="/createitem">Create Item</Link>
                            </Text>
                        </Grid>
                        <Grid xs={2}>
                            {address ?
                                <Button disabled>Connected</Button>
                                :
                                <Button size={"sm"} color={"success"} onClick={connectWallet}>Connect</Button>
                            }
                        </Grid>
                    </Grid.Container>
                </Col>
            </Row>
        </>
    )
}

export default Navigation;
