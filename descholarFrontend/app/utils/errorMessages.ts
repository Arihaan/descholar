export const getReadableErrorMessage = (error: any): string => {
  // Get the error message string
  const errorMessage = error?.message?.toLowerCase() || '';

  // Common MetaMask/Wallet errors
  if (errorMessage.includes('user rejected') || errorMessage.includes('user denied')) {
    return 'Transaction was cancelled';
  }

  if (errorMessage.includes('insufficient funds')) {
    return 'Not enough EDU tokens in your wallet';
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

  if (errorMessage.includes('invalid grant amount')) {
    return 'Grant amount must be at least 0.01 EDU';
  }

  if (errorMessage.includes('max grants exceeded')) {
    return 'Maximum number of grants (1000) exceeded';
  }

  // Default error message
  return 'Something went wrong. Please try again';
}; 