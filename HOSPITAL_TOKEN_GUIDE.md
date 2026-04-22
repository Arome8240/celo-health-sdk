# Hospital Token SDK Guide

Complete guide for using the celo-health-sdk to interact with the HospitalToken contract.

## Installation

```bash
npm install celo-health-sdk viem
# or
pnpm add celo-health-sdk viem
# or
yarn add celo-health-sdk viem
```

## Configuration

```typescript
import { createCeloHealthConfig } from 'celo-health-sdk';

// For Celo Mainnet
const config = createCeloHealthConfig({
  network: 'celo',
  contractAddress: '0x209c0138c80C60a570333D03b980e1cA22880fE1',
  rpcUrl: 'https://forno.celo.org', // optional
});

// For Celo Alfajores Testnet
const testnetConfig = createCeloHealthConfig({
  network: 'celo-alfajores',
  contractAddress: '0xYourTestnetAddress',
});
```

## Read Functions (No Wallet Required)

### Get Token Information

```typescript
import {
  getTokenName,
  getTokenSymbol,
  getTokenDecimals,
  getTotalSupply,
  getMaxSupply,
  formatTokenAmount,
} from 'celo-health-sdk';

// Get token metadata
const name = await getTokenName(config); // "Hospital Network Token"
const symbol = await getTokenSymbol(config); // "HNT"
const decimals = await getTokenDecimals(config); // 18

// Get supply information
const totalSupply = await getTotalSupply(config); // bigint
const maxSupply = await getMaxSupply(config); // bigint

// Format for display
const totalFormatted = formatTokenAmount(totalSupply); // "1000000.0"
const maxFormatted = formatTokenAmount(maxSupply); // "10000000.0"
```

### Check Contract Status

```typescript
import { isPaused } from 'celo-health-sdk';

const paused = await isPaused(config);
if (paused) {
  console.log('Contract is currently paused');
}
```

### Get Supply Metrics

```typescript
import { getSupplyMetrics } from 'celo-health-sdk';

const metrics = await getSupplyMetrics(config);
console.log({
  totalSupply: metrics.totalSupplyFormatted, // "1000000.0"
  maxSupply: metrics.maxSupplyFormatted, // "10000000.0"
  remaining: metrics.remainingFormatted, // "9000000.0"
  percentage: metrics.percentage, // 10.0
});
```

### Check Token Balance

```typescript
import { getTokenBalance, formatTokenAmount } from 'celo-health-sdk';

const address = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
const balance = await getTokenBalance(config, address);
const balanceFormatted = formatTokenAmount(balance);

console.log(`Balance: ${balanceFormatted} HNT`);
```

### Check User Roles

```typescript
import { getUserRoles, isAdmin, isMinter, isPauser } from 'celo-health-sdk';

const userAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

// Check all roles at once
const roles = await getUserRoles(config, userAddress);
console.log({
  isAdmin: roles.isAdmin,
  isMinter: roles.isMinter,
  isPauser: roles.isPauser,
  hasAnyRole: roles.hasAnyRole,
});

// Or check individually
const adminStatus = await isAdmin(config, userAddress);
const minterStatus = await isMinter(config, userAddress);
const pauserStatus = await isPauser(config, userAddress);
```

## Write Functions (Wallet Required)

### Setup Wallet Client

```typescript
import { createWalletClient, custom } from 'viem';
import { celo } from 'viem/chains';

// Using browser wallet (MetaMask, MiniPay, etc.)
const walletClient = createWalletClient({
  chain: celo,
  transport: custom(window.ethereum),
});

// Get account
const [account] = await walletClient.getAddresses();
```

### Mint Tokens (Requires MINTER_ROLE)

```typescript
import { mintTokens } from 'celo-health-sdk';

const recipientAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
const amount = '1000'; // 1000 HNT

try {
  const hash = await mintTokens(
    config,
    walletClient,
    recipientAddress,
    amount
  );
  
  console.log('Minting transaction:', hash);
  
  // Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log('Tokens minted successfully!');
} catch (error) {
  console.error('Minting failed:', error);
}
```

### Transfer Tokens

```typescript
import { transferTokens } from 'celo-health-sdk';

const recipientAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';
const amount = '50'; // 50 HNT

try {
  const hash = await transferTokens(
    config,
    walletClient,
    recipientAddress,
    amount
  );
  
  console.log('Transfer transaction:', hash);
} catch (error) {
  console.error('Transfer failed:', error);
}
```

### Grant Role (Requires DEFAULT_ADMIN_ROLE)

```typescript
import { grantRole, ROLES } from 'celo-health-sdk';

const newMinterAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

try {
  const hash = await grantRole(
    config,
    walletClient,
    ROLES.MINTER,
    newMinterAddress
  );
  
  console.log('Role granted:', hash);
} catch (error) {
  console.error('Grant role failed:', error);
}
```

### Revoke Role (Requires DEFAULT_ADMIN_ROLE)

```typescript
import { revokeRole, ROLES } from 'celo-health-sdk';

const addressToRevoke = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

try {
  const hash = await revokeRole(
    config,
    walletClient,
    ROLES.MINTER,
    addressToRevoke
  );
  
  console.log('Role revoked:', hash);
} catch (error) {
  console.error('Revoke role failed:', error);
}
```

### Pause Contract (Requires PAUSER_ROLE)

```typescript
import { pauseContract } from 'celo-health-sdk';

try {
  const hash = await pauseContract(config, walletClient);
  console.log('Contract paused:', hash);
} catch (error) {
  console.error('Pause failed:', error);
}
```

### Unpause Contract (Requires PAUSER_ROLE)

```typescript
import { unpauseContract } from 'celo-health-sdk';

try {
  const hash = await unpauseContract(config, walletClient);
  console.log('Contract unpaused:', hash);
} catch (error) {
  console.error('Unpause failed:', error);
}
```

## Role Constants

```typescript
import { ROLES } from 'celo-health-sdk';

console.log(ROLES.DEFAULT_ADMIN); // "0x0000...0000"
console.log(ROLES.MINTER);         // "0x9f2d...56a6"
console.log(ROLES.PAUSER);         // "0x65d7...862a"
```

## React Hook Example

```typescript
import { useEffect, useState } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import {
  createCeloHealthConfig,
  getUserRoles,
  getSupplyMetrics,
  getTokenBalance,
} from 'celo-health-sdk';

export function useHospitalToken() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [roles, setRoles] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [balance, setBalance] = useState(0n);

  const config = createCeloHealthConfig({
    network: 'celo',
    contractAddress: '0x209c0138c80C60a570333D03b980e1cA22880fE1',
  });

  useEffect(() => {
    if (!address) return;

    async function fetchData() {
      const [userRoles, supplyMetrics, tokenBalance] = await Promise.all([
        getUserRoles(config, address),
        getSupplyMetrics(config),
        getTokenBalance(config, address),
      ]);

      setRoles(userRoles);
      setMetrics(supplyMetrics);
      setBalance(tokenBalance);
    }

    fetchData();
  }, [address]);

  return {
    roles,
    metrics,
    balance,
    walletClient,
    config,
  };
}
```

## Complete Admin Dashboard Example

```typescript
import { useState } from 'react';
import {
  createCeloHealthConfig,
  mintTokens,
  grantRole,
  revokeRole,
  pauseContract,
  unpauseContract,
  ROLES,
} from 'celo-health-sdk';

export function AdminDashboard() {
  const { walletClient, config } = useHospitalToken();
  const [loading, setLoading] = useState(false);

  const handleMint = async (to: string, amount: string) => {
    if (!walletClient) return;
    
    setLoading(true);
    try {
      const hash = await mintTokens(config, walletClient, to, amount);
      console.log('Minted:', hash);
    } catch (error) {
      console.error('Mint failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantMinter = async (address: string) => {
    if (!walletClient) return;
    
    setLoading(true);
    try {
      const hash = await grantRole(config, walletClient, ROLES.MINTER, address);
      console.log('Role granted:', hash);
    } catch (error) {
      console.error('Grant failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    if (!walletClient) return;
    
    setLoading(true);
    try {
      const hash = await pauseContract(config, walletClient);
      console.log('Paused:', hash);
    } catch (error) {
      console.error('Pause failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your admin UI here */}
    </div>
  );
}
```

## Error Handling

```typescript
import { mintTokens } from 'celo-health-sdk';

try {
  const hash = await mintTokens(config, walletClient, to, amount);
} catch (error) {
  if (error.message.includes('Wallet client must have an account')) {
    console.error('Please connect your wallet');
  } else if (error.message.includes('insufficient funds')) {
    console.error('Insufficient CELO for gas');
  } else if (error.message.includes('AccessControl')) {
    console.error('You do not have the required role');
  } else if (error.message.includes('Pausable: paused')) {
    console.error('Contract is currently paused');
  } else if (error.message.includes('ERC20ExceededCap')) {
    console.error('Would exceed max supply cap');
  } else {
    console.error('Transaction failed:', error);
  }
}
```

## Best Practices

### 1. Always Check Roles Before Actions

```typescript
const roles = await getUserRoles(config, userAddress);

if (roles.isMinter) {
  // Show minting UI
}

if (roles.isAdmin) {
  // Show role management UI
}

if (roles.isPauser) {
  // Show pause/unpause UI
}
```

### 2. Validate Inputs

```typescript
import { isAddress } from 'viem';

function validateMintInput(address: string, amount: string) {
  if (!isAddress(address)) {
    throw new Error('Invalid address');
  }
  
  if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    throw new Error('Invalid amount');
  }
  
  return true;
}
```

### 3. Check Supply Before Minting

```typescript
const metrics = await getSupplyMetrics(config);
const requestedAmount = parseUnits(amount, 18);

if (requestedAmount > metrics.remaining) {
  throw new Error('Would exceed max supply');
}
```

### 4. Handle Transaction Confirmations

```typescript
import { createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';

const publicClient = createPublicClient({
  chain: celo,
  transport: http(),
});

const hash = await mintTokens(config, walletClient, to, amount);

// Wait for confirmation
const receipt = await publicClient.waitForTransactionReceipt({
  hash,
  confirmations: 2, // Wait for 2 confirmations
});

if (receipt.status === 'success') {
  console.log('Transaction confirmed!');
} else {
  console.error('Transaction failed');
}
```

## TypeScript Types

```typescript
import type {
  CeloHealthConfig,
  ResolvedCeloHealthConfig,
  NetworkName,
} from 'celo-health-sdk';

import type { Address, Hash, WalletClient } from 'viem';

// Config type
const config: ResolvedCeloHealthConfig = createCeloHealthConfig({
  network: 'celo',
  contractAddress: '0x...',
});

// Address type
const userAddress: Address = '0x...';

// Transaction hash type
const txHash: Hash = await mintTokens(config, walletClient, to, amount);
```

## Support

For issues or questions:
- GitHub: https://github.com/Arome8240/celo-health-sdk
- Documentation: See README.md
- Contract: 0x209c0138c80C60a570333D03b980e1cA22880fE1 (Celo Mainnet)
