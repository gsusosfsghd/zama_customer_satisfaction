import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedCipherSatisfaction = await deploy("CipherSatisfaction", {
    from: deployer,
    log: true,
  });

  console.log(`CipherSatisfaction contract: `, deployedCipherSatisfaction.address);
};
export default func;
func.id = "deploy_cipherSatisfaction"; // id required to prevent reexecution
func.tags = ["CipherSatisfaction"];

