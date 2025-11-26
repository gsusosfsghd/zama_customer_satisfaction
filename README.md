# CipherSatisfaction

A fully homomorphic encryption (FHE) based customer satisfaction rating system built on FHEVM. This dApp enables truly anonymous customer feedback submission with encrypted computation, allowing companies to gain insights while protecting customer privacy.

## 🌟 Features

- **Anonymous Rating Submission**: Customers can submit ratings without revealing their identity
- **Multi-dimensional Scoring**: Rate service quality across three dimensions:
  - Attitude (30% weight)
  - Speed (30% weight)
  - Professionalism (40% weight)
- **Encrypted Computation**: All calculations performed on encrypted data using FHEVM
- **Threshold Checking**: Encrypted threshold judgment to determine if service meets standards
- **Selective Decryption**: Companies can decrypt aggregated statistics while individual ratings remain private
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- **Wallet Integration**: Seamless MetaMask connection with EIP-6963 support

## 🛠️ Tech Stack

### Smart Contracts
- **Solidity** ^0.8.24
- **FHEVM** ^0.9.1
- **Hardhat** for development and testing
- **Ethers.js** v6 for contract interaction

### Frontend
- **Next.js** 15.4.2 (Static Export)
- **React** 19.1.0
- **TypeScript** 5
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **@zama-fhe/relayer-sdk** 0.3.0-5 for production
- **@fhevm/mock-utils** 0.3.0-1 for local development

## 📁 Project Structure

```
zama_customer_satisfaction/
├── fhevm-hardhat-template/          # Smart contracts
│   ├── contracts/
│   │   ├── CipherSatisfaction.sol   # Main contract
│   │   └── FHECounter.sol           # Example contract
│   ├── deploy/
│   │   └── deployCipherSatisfaction.ts
│   ├── test/
│   │   └── CipherSatisfaction.ts
│   └── hardhat.config.ts
│
└── cipher-satisfaction-frontend/    # Frontend application
    ├── app/                         # Next.js app directory
    │   ├── page.tsx                 # Welcome page
    │   ├── submit/                  # Rating submission
    │   ├── dashboard/               # Statistics dashboard
    │   └── about/                   # About page
    ├── components/                  # React components
    ├── fhevm/                       # FHEVM integration
    ├── hooks/                       # Custom React hooks
    ├── lib/                         # Utilities
    ├── scripts/                     # Build scripts
    └── abi/                         # Generated contract ABIs
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 20
- **npm** >= 7.0.0
- **MetaMask** or compatible Web3 wallet
- For local development: **Hardhat** local node

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gsusosfsghd/zama_customer_satisfaction.git
   cd zama_customer_satisfaction
   ```

2. **Install contract dependencies**
   ```bash
   cd fhevm-hardhat-template
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../cipher-satisfaction-frontend
   npm install
   ```

## 🏗️ Development

### Smart Contract Development

1. **Start local Hardhat node**
   ```bash
   cd fhevm-hardhat-template
   npx hardhat node
   ```

2. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

3. **Run tests**
   ```bash
   npx hardhat test
   ```

4. **Deploy to localhost**
   ```bash
   npx hardhat deploy --network localhost
   ```

5. **Deploy to Sepolia testnet**
   ```bash
   # Set your private key and RPC URL
   npx hardhat vars set PRIVATE_KEY
   npx hardhat vars set SEPOLIA_RPC_URL
   
   # Deploy
   npx hardhat deploy --network sepolia
   ```

### Frontend Development

#### Local Development with Mock (Recommended for testing)

1. **Ensure Hardhat node is running** (see above)

2. **Start frontend in mock mode**
   ```bash
   cd cipher-satisfaction-frontend
   npm run dev:mock
   ```

   This will:
   - Check if Hardhat node is running
   - Generate ABI files from deployed contracts
   - Start Next.js dev server with mock FHEVM utils

3. **Open browser**
   ```
   http://localhost:3000
   ```

#### Production Mode (with Real Relayer)

1. **Generate ABI files**
   ```bash
   cd cipher-satisfaction-frontend
   npm run genabi
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Connect to Sepolia testnet** in MetaMask

### Build for Production

1. **Check static export compatibility**
   ```bash
   cd cipher-satisfaction-frontend
   npm run check:static
   ```

2. **Build static site**
   ```bash
   npm run build
   ```

3. **Output directory**: `cipher-satisfaction-frontend/out/`

## 📝 Usage

### Submitting a Rating

1. **Connect your wallet** (MetaMask recommended)
2. **Navigate to Submit page**
3. **Enter Service Agent ID** (e.g., agent-001, support-123)
4. **Rate three dimensions** using sliders (1-5 scale):
   - Attitude
   - Speed
   - Professionalism
5. **Click "Submit Rating"**
6. **Confirm transaction** in MetaMask
7. Wait for transaction confirmation

### Viewing Statistics (Admin Only)

1. **Connect admin wallet**
2. **Navigate to Dashboard**
3. **Click "Decrypt Statistics"**
4. **View aggregated data**:
   - Total ratings count
   - Average scores per dimension
   - Weighted composite score
   - Threshold pass rate

## 🔐 FHE Application Points

### Encrypted Weighted Composite Scoring

The system calculates a weighted composite score using encrypted arithmetic:

```solidity
weightedScore = (attitude × 30% + speed × 30% + professionalism × 40%)
```

All calculations are performed on encrypted data (`euint32`) using FHEVM operations.

### Encrypted Threshold Judgment

The contract checks if each rating meets the service standard threshold (4.0/5.0) using encrypted comparison:

```solidity
meetsThreshold = weightedScore > 400 ? 1 : 0  // 400 = 4.0 × 100
```

## 🌐 Deployment

### Contract Deployment

#### Sepolia Testnet

1. **Configure environment**
   ```bash
   cd fhevm-hardhat-template
   npx hardhat vars set PRIVATE_KEY
   npx hardhat vars set SEPOLIA_RPC_URL
   npx hardhat vars set ETHERSCAN_API_KEY  # Optional, for verification
   ```

2. **Deploy**
   ```bash
   npx hardhat deploy --network sepolia
   ```

3. **Verify contract** (optional)
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

### Frontend Deployment

#### Vercel (Recommended)

The project includes `vercel.json` configuration for easy deployment:

1. **Build the project**
   ```bash
   cd cipher-satisfaction-frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

   Or connect your GitHub repository to Vercel for automatic deployments.

#### Other Static Hosting

The `out/` directory contains a fully static site that can be deployed to:
- GitHub Pages
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

**Important**: Ensure your hosting provider supports:
- COOP/COEP headers (required for FHEVM)
- WASM file serving with correct MIME types

## 🔧 Configuration

### Contract Addresses

After deployment, contract addresses are automatically generated in:
- `cipher-satisfaction-frontend/abi/CipherSatisfactionAddresses.ts`

### Network Configuration

The frontend automatically detects the network:
- **Chain ID 31337**: Local Hardhat (uses mock-utils)
- **Other networks**: Uses real Relayer SDK

### Service Agent ID

The Service Agent ID is a plaintext identifier used to group ratings. Examples:
- `agent-001`
- `support-team-a`
- `cs-department-2024`

This ID is stored on-chain but does not compromise anonymity.

## 🧪 Testing

### Contract Tests

```bash
cd fhevm-hardhat-template
npx hardhat test
```

Tests cover:
- Contract deployment
- Rating submission
- Encrypted score calculation
- Threshold checking
- Statistics aggregation
- Admin functions

### Frontend Static Export Check

```bash
cd cipher-satisfaction-frontend
npm run check:static
```

This verifies:
- No SSR/ISR/Edge functions
- No API routes
- All pages are statically exportable
- Dynamic routes have `generateStaticParams`

## 📚 Key Concepts

### FHEVM (Fully Homomorphic Encryption Virtual Machine)

FHEVM enables computation on encrypted data without decryption. This project uses:
- `euint32`: Encrypted 32-bit unsigned integers
- `FHE.add`, `FHE.mul`: Encrypted arithmetic
- `FHE.gt`: Encrypted comparison
- `FHE.select`: Encrypted conditional selection

### Relayer vs Mock

- **Relayer** (`@zama-fhe/relayer-sdk`): Production mode, requires network connection
- **Mock** (`@fhevm/mock-utils`): Local development, works with Hardhat node

The frontend automatically switches based on `chainId`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Links

- **GitHub Repository**: https://github.com/gsusosfsghd/zama_customer_satisfaction
- **FHEVM Documentation**: https://docs.zama.ai/fhevm
- **Zama**: https://www.zama.ai/

## 🙏 Acknowledgments

- [Zama](https://www.zama.ai/) for FHEVM technology
- [FHEVM Hardhat Template](https://github.com/zama-ai/fhevm-hardhat-template) for the base structure

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [FHEVM documentation](https://docs.zama.ai/fhevm)

---

Built with ❤️ using FHEVM

