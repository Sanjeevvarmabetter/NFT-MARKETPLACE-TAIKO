const { ethers } = require("hardhat");

async function main() {
    // Set a delay function for cleaner code
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Deploy contract
    const StorageContract = await ethers.getContractFactory("MNFT");
    const storageContract = await StorageContract.deploy();

    // Wait until deployment is confirmed

    
    // Add a delay to ensure state consistency on the network
    await delay(5000); // 5 seconds delay, adjust if needed

    // Attempt to log the deployment details
    console.log("Contract deployed successfully.");
    console.log(`Deployer: ${storageContract.runner.address}`);
    console.log(`Deployed to: ${storageContract.target}`);
    console.log(`Transaction hash: ${storageContract.deploymentTransaction().hash}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });



//➜  taiko npx hardhat run --network taiko scripts/deploy.js

/*
Contract deployed successfully.
Deployer: 0xEA29129049A8B3fB0b2318b4aF2c2B45f459Eea7
Deployed to: 0x1f76ba87fa309A14027e5c9136d35EEB8414001E
Transaction hash: 0xe5fcdd657e7b0aadf0e63111e0238c3c27e1797400138fbd1b9c0c9a69750af0

*/