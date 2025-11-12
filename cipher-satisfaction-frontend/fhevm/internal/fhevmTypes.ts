import type { FhevmInstance, FhevmInstanceConfig } from "../fhevmTypes";

export type FhevmInitSDKOptions = {
  tfheParams?: any;
  kmsParams?: any;
  thread?: number;
};

export type FhevmCreateInstanceType = () => Promise<FhevmInstance>;
export type FhevmInitSDKType = (
  options?: FhevmInitSDKOptions
) => Promise<boolean>;
export type FhevmLoadSDKType = () => Promise<void>;
export type IsFhevmSupportedType = (chainId: number) => boolean;

export type FhevmRelayerSDKType = {
  initSDK: FhevmInitSDKType;
  createInstance: (config: FhevmInstanceConfig) => Promise<FhevmInstance>;
  SepoliaConfig: FhevmInstanceConfig;
  __initialized__?: boolean;
};

export type FhevmWindowType = {
  relayerSDK: FhevmRelayerSDKType;
};

export type FhevmRelayerStatusType =
  | "idle"
  | "sdk-loading"
  | "sdk-loaded"
  | "sdk-initializing"
  | "sdk-initialized"
  | "creating"
  | "ready"
  | "error";

export type MockResolveResult = {
  isMock: true;
  chainId: number;
  rpcUrl: string;
};

export type GenericResolveResult = {
  isMock: false;
  chainId: number;
  rpcUrl: string | undefined;
};

export type ResolveResult = MockResolveResult | GenericResolveResult;

