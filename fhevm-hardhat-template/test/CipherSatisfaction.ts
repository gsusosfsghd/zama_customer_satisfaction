import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { CipherSatisfaction, CipherSatisfaction__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("CipherSatisfaction")) as CipherSatisfaction__factory;
  const contract = (await factory.deploy()) as CipherSatisfaction;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

describe("CipherSatisfaction", function () {
  let signers: Signers;
  let contract: CipherSatisfaction;
  let contractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ contract, contractAddress } = await deployFixture());
  });

  it("should initialize with deployer as admin", async function () {
    const isAdmin = await contract.admins(signers.deployer.address);
    expect(isAdmin).to.be.true;
  });

  it("should have zero ratings after deployment", async function () {
    const totalRatings = await contract.getTotalRatings();
    expect(totalRatings).to.eq(0);
  });

  it("should submit a rating and calculate weighted score", async function () {
    const serviceAgentId = ethers.id("agent-001");
    const attitude = 5;
    const speed = 4;
    const professionalism = 5;

    // Encrypt the three scores
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(attitude)
      .add32(speed)
      .add32(professionalism)
      .encrypt();

    const tx = await contract
      .connect(signers.alice)
      .submitRating(
        serviceAgentId,
        encryptedInput.handles[0],
        encryptedInput.inputProof,
        encryptedInput.handles[1],
        encryptedInput.inputProof,
        encryptedInput.handles[2],
        encryptedInput.inputProof
      );
    await tx.wait();

    // Check total ratings increased
    const totalRatings = await contract.getTotalRatings();
    expect(totalRatings).to.eq(1);

    // Get the rating
    const rating = await contract.getRating(0);
    expect(rating.serviceAgentId).to.eq(serviceAgentId);
    expect(rating.timestamp).to.be.gt(0);

    // Decrypt weighted score: (5*30 + 4*30 + 5*40) / 100 = (150 + 120 + 200) / 100 = 470 / 100 = 4.7
    // But since we multiply by 100, the result is 470
    const decryptedWeightedScore = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      rating.encryptedWeightedScore,
      contractAddress,
      signers.alice
    );
    
    // Expected: (5*30 + 4*30 + 5*40) = 150 + 120 + 200 = 470
    expect(Number(decryptedWeightedScore)).to.eq(470);

    // Decrypt threshold check (470 >= 400, so should be 1)
    const decryptedThreshold = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      rating.meetsThreshold,
      contractAddress,
      signers.alice
    );
    expect(Number(decryptedThreshold)).to.eq(1);
  });

  it("should calculate statistics correctly", async function () {
    const serviceAgentId = ethers.id("agent-001");
    
    // Submit first rating: 5, 4, 5
    const encryptedInput1 = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(5)
      .add32(4)
      .add32(5)
      .encrypt();

    await contract
      .connect(signers.alice)
      .submitRating(
        serviceAgentId,
        encryptedInput1.handles[0],
        encryptedInput1.inputProof,
        encryptedInput1.handles[1],
        encryptedInput1.inputProof,
        encryptedInput1.handles[2],
        encryptedInput1.inputProof
      )
      .then((tx) => tx.wait());

    // Submit second rating: 3, 3, 3
    const encryptedInput2 = await fhevm
      .createEncryptedInput(contractAddress, signers.bob.address)
      .add32(3)
      .add32(3)
      .add32(3)
      .encrypt();

    await contract
      .connect(signers.bob)
      .submitRating(
        serviceAgentId,
        encryptedInput2.handles[0],
        encryptedInput2.inputProof,
        encryptedInput2.handles[1],
        encryptedInput2.inputProof,
        encryptedInput2.handles[2],
        encryptedInput2.inputProof
      )
      .then((tx) => tx.wait());

    // Get statistics
    const stats = await contract.getStatistics();
    expect(stats.totalRatings).to.eq(2);

    // Authorize deployer (admin) to decrypt statistics
    await contract.connect(signers.deployer).authorizeStatisticsDecryption();

    // Decrypt sums using deployer (admin) who has access to all statistics
    const sumAttitude = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      stats.sumAttitude,
      contractAddress,
      signers.deployer
    );
    expect(Number(sumAttitude)).to.eq(5 + 3); // 8

    const sumSpeed = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      stats.sumSpeed,
      contractAddress,
      signers.deployer
    );
    expect(Number(sumSpeed)).to.eq(4 + 3); // 7

    const sumProfessionalism = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      stats.sumProfessionalism,
      contractAddress,
      signers.deployer
    );
    expect(Number(sumProfessionalism)).to.eq(5 + 3); // 8

    // Decrypt weighted sum
    // Rating 1: (5*30 + 4*30 + 5*40) = 470
    // Rating 2: (3*30 + 3*30 + 3*40) = 300
    // Total: 770
    const sumWeighted = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      stats.sumWeightedScore,
      contractAddress,
      signers.deployer
    );
    expect(Number(sumWeighted)).to.eq(770);

    // Decrypt threshold count (both meet threshold: 470 >= 400, 300 < 400, so only 1)
    // Actually, 300 < 400, so only rating 1 meets threshold
    const thresholdCount = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      stats.countMeetsThreshold,
      contractAddress,
      signers.deployer
    );
    expect(Number(thresholdCount)).to.eq(1); // Only first rating meets threshold
  });

  it("should correctly identify ratings below threshold", async function () {
    const serviceAgentId = ethers.id("agent-002");
    
    // Submit rating below threshold: 3, 3, 3
    // Weighted: (3*30 + 3*30 + 3*40) = 300 < 400
    const encryptedInput = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(3)
      .add32(3)
      .add32(3)
      .encrypt();

    await contract
      .connect(signers.alice)
      .submitRating(
        serviceAgentId,
        encryptedInput.handles[0],
        encryptedInput.inputProof,
        encryptedInput.handles[1],
        encryptedInput.inputProof,
        encryptedInput.handles[2],
        encryptedInput.inputProof
      )
      .then((tx) => tx.wait());

    const rating = await contract.getRating(await contract.getTotalRatings() - 1n);
    
    // Decrypt threshold check (300 < 400, so should be 0)
    const decryptedThreshold = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      rating.meetsThreshold,
      contractAddress,
      signers.alice
    );
    expect(Number(decryptedThreshold)).to.eq(0);
  });

  it("should allow admin to set other admins", async function () {
    await contract.connect(signers.deployer).setAdmin(signers.alice.address, true);
    const isAdmin = await contract.admins(signers.alice.address);
    expect(isAdmin).to.be.true;

    await contract.connect(signers.deployer).setAdmin(signers.alice.address, false);
    const isAdminAfter = await contract.admins(signers.alice.address);
    expect(isAdminAfter).to.be.false;
  });

  it("should prevent non-admin from setting admins", async function () {
    await expect(
      contract.connect(signers.alice).setAdmin(signers.bob.address, true)
    ).to.be.revertedWith("Only admin can set admin");
  });

  it("should count ratings for specific agent", async function () {
    const serviceAgentId1 = ethers.id("agent-001");
    const serviceAgentId2 = ethers.id("agent-002");

    // Submit 2 ratings for agent-001
    const encryptedInput1 = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(5)
      .add32(4)
      .add32(5)
      .encrypt();

    await contract
      .connect(signers.alice)
      .submitRating(
        serviceAgentId1,
        encryptedInput1.handles[0],
        encryptedInput1.inputProof,
        encryptedInput1.handles[1],
        encryptedInput1.inputProof,
        encryptedInput1.handles[2],
        encryptedInput1.inputProof
      )
      .then((tx) => tx.wait());

    const encryptedInput2 = await fhevm
      .createEncryptedInput(contractAddress, signers.bob.address)
      .add32(4)
      .add32(4)
      .add32(4)
      .encrypt();

    await contract
      .connect(signers.bob)
      .submitRating(
        serviceAgentId1,
        encryptedInput2.handles[0],
        encryptedInput2.inputProof,
        encryptedInput2.handles[1],
        encryptedInput2.inputProof,
        encryptedInput2.handles[2],
        encryptedInput2.inputProof
      )
      .then((tx) => tx.wait());

    // Submit 1 rating for agent-002
    const encryptedInput3 = await fhevm
      .createEncryptedInput(contractAddress, signers.alice.address)
      .add32(3)
      .add32(3)
      .add32(3)
      .encrypt();

    await contract
      .connect(signers.alice)
      .submitRating(
        serviceAgentId2,
        encryptedInput3.handles[0],
        encryptedInput3.inputProof,
        encryptedInput3.handles[1],
        encryptedInput3.inputProof,
        encryptedInput3.handles[2],
        encryptedInput3.inputProof
      )
      .then((tx) => tx.wait());

    const count1 = await contract.getRatingCountForAgent(serviceAgentId1);
    expect(count1).to.eq(2);

    const count2 = await contract.getRatingCountForAgent(serviceAgentId2);
    expect(count2).to.eq(1);
  });
});

