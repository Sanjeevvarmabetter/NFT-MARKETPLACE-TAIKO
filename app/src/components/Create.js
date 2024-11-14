import { useState } from 'react';
import { ethers } from "ethers";
import { Row, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Create = ({ mergedContract }) => {
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);  // Added loading state

  const pinataApiKey = "20a1ac93e10b67f081c5";
  const pinataSecretApiKey = "2b3680b650e07a507c4df5a9649b9b6438d7f8e4c3cc0cfab22a73bb968d02d7";

  const uploadToPinata = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
          maxBodyLength: 'Infinity',
          headers: {
            'Content-Type': 'multipart/form-data',
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          }
        });
        const imageUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        setImage(imageUrl);
        console.log(imageUrl);
      } catch (error) {
        console.log("Pinata image upload error: ", error);
      }
    }
  };

  const createNFT = async () => {
    if (!image || !price || !name || !description) return;

    setLoading(true);  // Set loading to true when transaction begins
    try {
      const metadata = { image, name, description };

      const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
        headers: {
          'Content-Type': 'application/json',
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        }
      });

      const metadataUri = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      await mintThenList(metadataUri);
    } catch (error) {
      console.log("Pinata metadata upload error: ", error);
    } finally {
      setLoading(false);  // Reset loading state after transaction
    }
  };

  const mintThenList = async (metadataUri) => {
    try {
      const tx = await mergedContract.mint(metadataUri, ethers.utils.parseEther(price.toString()));
      await tx.wait();
      console.log("NFT Minted and Listed");
    } catch (error) {
      console.error("Error in minting or listing NFT: ", error);
      alert("An error occurred. Please check the console for details.");
    }
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control type="file" required name="file" onChange={uploadToPinata} disabled={loading} />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" disabled={loading} />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" disabled={loading} />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" disabled={loading} />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg" disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Create & List NFT!"}
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Create;
