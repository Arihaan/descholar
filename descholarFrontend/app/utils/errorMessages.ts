export const getReadableErrorMessage = (error: any): string => {
  // Get the error message string
  const errorMessage = error?.message?.toLowerCase() || '';

  // Basic validation errors
  if (errorMessage.includes('number of grants must be greater than 0')) {
    return 'Number of grants must be greater than 0';
  }

  if (errorMessage.includes('grant amount must be greater than 0')) {
    return 'Grant amount must be greater than 0';
  }

  // Token errors
  if (errorMessage.includes('token transfer failed')) {
    return 'Token transfer failed. Please check your balance';
  }

  if (errorMessage.includes('invalid token address')) {
    return 'Invalid token address provided';
  }

  // Wallet errors
  if (errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
    return 'Transaction was cancelled';
  }

  if (errorMessage.includes('insufficient funds')) {
    return 'Not enough tokens in your wallet';
  }

  if (errorMessage.includes('network changed')) {
    return 'Please switch to EDU Chain Testnet';
  }

  // Contract specific errors
  if (errorMessage.includes('already applied')) {
    return 'You have already applied for this scholarship';
  }

  if (errorMessage.includes('scholarship ended')) {
    return 'This scholarship has ended';
  }

  if (errorMessage.includes('no grants available')) {
    return 'No more grants available for this scholarship';
  }

  if (errorMessage.includes('max grants exceeded')) {
    return 'Maximum number of grants (1000) exceeded';
  }

  // Add ERC20-specific errors
  if (errorMessage.includes('erc20 token: transfer failed')) {
    return 'ERC20 token transfer failed. Please check your balance';
  }

  // Remove references to minimum amounts and max grants
  if (errorMessage.includes('invalid grant amount')) {
    return 'Grant amount must be greater than 0';
  }

  // Default error message
  return 'Something went wrong. Please try again';
}; 