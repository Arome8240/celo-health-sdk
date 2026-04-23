import {
  createPublicClient,
  http,
  parseUnits,
  formatUnits,
  type Address,
  type Hash,
  type WalletClient,
} from 'viem';
import { celo, celoAlfajores } from 'viem/chains';
import type { ResolvedCeloHealthConfig } from './config';

// HospitalToken ABI
export const HOSPITAL_TOKEN_ABI = [
  // Read functions
  {
    inputs: [],
    name: 'name',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cap',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'role', type: 'bytes32' },
      { name: 'account', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [{ type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PAUSER_ROLE',
    outputs: [{ type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  // Write functions
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'role', type: 'bytes32' },
      { name: 'account', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'role', type: 'bytes32' },
      { name: 'account', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// Role constants
export const ROLES = {
  DEFAULT_ADMIN: '0x0000000000000000000000000000000000000000000000000000000000000000' as const,
  MINTER: '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6' as const,
  PAUSER: '0x65d7a28e3265b37a6474929f336521b332c1681b933f6cb9f3376673440d862a' as const,
};

function getChain(network: ResolvedCeloHealthConfig['network']) {
  return network === 'celo' ? celo : celoAlfajores;
}

function getClient(config: ResolvedCeloHealthConfig) {
  return createPublicClient({
    chain: getChain(config.network),
    transport: http(config.rpcUrl),
  });
}

// ============================================================================
// READ FUNCTIONS
// ============================================================================

/** Get token name */
export async function getTokenName(config: ResolvedCeloHealthConfig): Promise<string> {
  try {
    const client = getClient(config);
    return await client.readContract({
      address: config.contractAddress,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: 'name',
    });
  } catch {
    return '';
  }
}

/** Get token symbol */
export async function getTokenSymbol(config: ResolvedCeloHealthConfig): Promise<string> {
  try {
    const client = getClient(config);
    return await client.readContract({
      address: config.contractAddress,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: 'symbol',
    });
  } catch {
    return '';
  }
}

/** Get token decimals */
export async function getTokenDecimals(config: ResolvedCeloHealthConfig): Promise<number> {
  try {
    const client = getClient(config);
    return await client.readContract({
      address: config.contractAddress,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: 'decimals',
    });
  } catch {
    return 18;
  }
}

/** Get total supply */
export async function getTotalSupply(config: ResolvedCeloHealthConfig): Promise<bigint> {
  try {
    const client = getClient(config);
    return await client.readContract({
      address: config.contractAddress,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: 'totalSupply',
    });
  } catch {
    return 0n;
  }
}

/** Get max supply cap */
export async function getMaxSupply(config: ResolvedCeloHealthConfig): Promise<bigint> {
  try {
    const client = getClient(config);
    return await client.readContract({
      address: config.contractAddress,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: 'cap',
    });
  } catch {
    return 0n;
  }
}

/** Check if contract is paused */
export async function isPaused(config: ResolvedCeloHealthConfig): Promise<boolean> {
  try {
    const client = getClient(config);
    return await client.readContract({
      address: config.contractAddress,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: 'paused',
    });
  } catch {
    return false;
  }
}

/** Get token balance for an address */
export async function getTokenBalance(
  config: ResolvedCeloHealthConfig,
  address: Address,
): Promise<bigint> {
  try {
    const client = getClient(config);
    return await client.readContract({
      address: config.contractAddress,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: 'balanceOf',
      args: [address],
    });
  } catch {
    return 0n;
  }
}

/** Check if address has a specific role */
export async function hasRole(
  config: ResolvedCeloHealthConfig,
  role: string,
  address: Address,
): Promise<boolean> {
  try {
    const client = getClient(config);
    return await client.readContract({
      address: config.contractAddress,
      abi: HOSPITAL_TOKEN_ABI,
      functionName: 'hasRole',
      args: [role as `0x${string}`, address],
    });
  } catch {
    return false;
  }
}

/** Check if address is admin */
export async function isAdmin(
  config: ResolvedCeloHealthConfig,
  address: Address,
): Promise<boolean> {
  return hasRole(config, ROLES.DEFAULT_ADMIN, address);
}

/** Check if address is minter */
export async function isMinter(
  config: ResolvedCeloHealthConfig,
  address: Address,
): Promise<boolean> {
  return hasRole(config, ROLES.MINTER, address);
}

/** Check if address is pauser */
export async function isPauser(
  config: ResolvedCeloHealthConfig,
  address: Address,
): Promise<boolean> {
  return hasRole(config, ROLES.PAUSER, address);
}

/** Get supply metrics */
export async function getSupplyMetrics(config: ResolvedCeloHealthConfig) {
  const [totalSupply, maxSupply] = await Promise.all([
    getTotalSupply(config),
    getMaxSupply(config),
  ]);

  const remaining = maxSupply - totalSupply;
  const percentage = maxSupply > 0n ? Number((totalSupply * 10000n) / maxSupply) / 100 : 0;

  return {
    totalSupply,
    maxSupply,
    remaining,
    percentage,
    totalSupplyFormatted: formatUnits(totalSupply, 18),
    maxSupplyFormatted: formatUnits(maxSupply, 18),
    remainingFormatted: formatUnits(remaining, 18),
  };
}

/** Get user roles */
export async function getUserRoles(config: ResolvedCeloHealthConfig, address: Address) {
  const [isAdminRole, isMinterRole, isPauserRole] = await Promise.all([
    isAdmin(config, address),
    isMinter(config, address),
    isPauser(config, address),
  ]);

  return {
    isAdmin: isAdminRole,
    isMinter: isMinterRole,
    isPauser: isPauserRole,
    hasAnyRole: isAdminRole || isMinterRole || isPauserRole,
  };
}

// ============================================================================
// WRITE FUNCTIONS (require wallet client)
// ============================================================================

/** Mint tokens (requires MINTER_ROLE) */
export async function mintTokens(
  config: ResolvedCeloHealthConfig,
  walletClient: WalletClient,
  to: Address,
  amount: string,
): Promise<Hash> {
  if (!walletClient.account) {
    throw new Error('Wallet client must have an account');
  }

  const amountWei = parseUnits(amount, 18);
  
  const hash = await walletClient.writeContract({
    address: config.contractAddress,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: 'mint',
    args: [to, amountWei],
    chain: getChain(config.network),
    account: walletClient.account,
  });

  return hash;
}

/** Pause contract (requires PAUSER_ROLE) */
export async function pauseContract(
  config: ResolvedCeloHealthConfig,
  walletClient: WalletClient,
): Promise<Hash> {
  if (!walletClient.account) {
    throw new Error('Wallet client must have an account');
  }

  const hash = await walletClient.writeContract({
    address: config.contractAddress,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: 'pause',
    chain: getChain(config.network),
    account: walletClient.account,
  });

  return hash;
}

/** Unpause contract (requires PAUSER_ROLE) */
export async function unpauseContract(
  config: ResolvedCeloHealthConfig,
  walletClient: WalletClient,
): Promise<Hash> {
  if (!walletClient.account) {
    throw new Error('Wallet client must have an account');
  }

  const hash = await walletClient.writeContract({
    address: config.contractAddress,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: 'unpause',
    chain: getChain(config.network),
    account: walletClient.account,
  });

  return hash;
}

/** Grant role (requires DEFAULT_ADMIN_ROLE) */
export async function grantRole(
  config: ResolvedCeloHealthConfig,
  walletClient: WalletClient,
  role: string,
  targetAccount: Address,
): Promise<Hash> {
  if (!walletClient.account) {
    throw new Error('Wallet client must have an account');
  }

  const hash = await walletClient.writeContract({
    address: config.contractAddress,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: 'grantRole',
    args: [role as `0x${string}`, targetAccount],
    chain: getChain(config.network),
    account: walletClient.account,
  });

  return hash;
}

/** Revoke role (requires DEFAULT_ADMIN_ROLE) */
export async function revokeRole(
  config: ResolvedCeloHealthConfig,
  walletClient: WalletClient,
  role: string,
  targetAccount: Address,
): Promise<Hash> {
  if (!walletClient.account) {
    throw new Error('Wallet client must have an account');
  }

  const hash = await walletClient.writeContract({
    address: config.contractAddress,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: 'revokeRole',
    args: [role as `0x${string}`, targetAccount],
    chain: getChain(config.network),
    account: walletClient.account,
  });

  return hash;
}

/** Transfer tokens */
export async function transferTokens(
  config: ResolvedCeloHealthConfig,
  walletClient: WalletClient,
  to: Address,
  amount: string,
): Promise<Hash> {
  if (!walletClient.account) {
    throw new Error('Wallet client must have an account');
  }

  const amountWei = parseUnits(amount, 18);
  
  const hash = await walletClient.writeContract({
    address: config.contractAddress,
    abi: HOSPITAL_TOKEN_ABI,
    functionName: 'transfer',
    args: [to, amountWei],
    chain: getChain(config.network),
    account: walletClient.account,
  });

  return hash;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Format token amount from wei to human-readable */
export function formatTokenAmount(amount: bigint, decimals = 18): string {
  return formatUnits(amount, decimals);
}

/** Parse token amount from human-readable to wei */
export function parseTokenAmount(amount: string, decimals = 18): bigint {
  return parseUnits(amount, decimals);
}
