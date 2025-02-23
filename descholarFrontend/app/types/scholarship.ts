export interface Scholarship {
    id: number;
    name: string;
    details: string;
    grantAmount: string;
    remainingGrants: number;
    totalGrants: number;
    endDate: Date;
    creator: string;
    creatorUrl: string;
    active: boolean;
    createdAt: Date;
    isCancelled: boolean;
    cancellationReason: string;
    cancelledAt: Date | null;
    tokenId: string;
    tokenUrl?: string;
    tokenSymbol: string;
} 