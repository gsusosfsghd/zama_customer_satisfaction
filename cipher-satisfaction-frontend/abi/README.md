# ABI Files

**⚠️ 重要提示：这些文件是占位符，需要运行生成脚本才能得到真实数据**

## 生成真实 ABI 文件

1. 首先部署合约到 localhost 或 sepolia：
   ```bash
   cd ../fhevm-hardhat-template
   npx hardhat deploy --network localhost
   # 或
   npx hardhat deploy --network sepolia
   ```

2. 然后运行生成脚本：
   ```bash
   npm run genabi
   ```

3. 脚本会自动从 `fhevm-hardhat-template/deployments/` 读取部署信息并生成：
   - `CipherSatisfactionABI.ts` - 合约 ABI
   - `CipherSatisfactionAddresses.ts` - 合约地址映射

## 当前状态

- `CipherSatisfactionABI.ts` - 空占位符（`abi: []`）
- `CipherSatisfactionAddresses.ts` - 零地址占位符

**这些文件会在运行 `npm run genabi` 后被真实数据替换。**

