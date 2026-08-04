import { GraphQLClient, gql } from 'graphql-request';

const waveClient = new GraphQLClient(process.env.WAVE_API_URL || 'https://api.wave.com/graphql', {
  headers: {
    Authorization: `Bearer ${process.env.WAVE_API_KEY}`,
  },
});

export interface InitiateWavePaymentInput {
  listingId: string;
  amount: number; // XOF
  phoneNumber: string; // +221 format
  buyerId: string;
  sellerId: string;
  listingTitle: string;
}

export async function initiateWavePayment(input: InitiateWavePaymentInput) {
  try {
    const query = gql`
      mutation InitiateSendMoney(
        $amount: Int!
        $phoneNumber: String!
        $memo: String!
      ) {
        initiateSendMoney(
          input: {
            amount: $amount
            phoneNumber: $phoneNumber
            memo: $memo
          }
        ) {
          transaction {
            id
            status
            deeplinkUrl
          }
          errors {
            code
            message
          }
        }
      }
    `;

    const variables = {
      amount: Math.round(input.amount / 100), // Convert to XOF
      phoneNumber: input.phoneNumber,
      memo: `Yembal: ${input.listingTitle}`,
    };

    const response: any = await waveClient.request(query, variables);

    if (response.initiateSendMoney.errors?.length > 0) {
      throw new Error(response.initiateSendMoney.errors[0].message);
    }

    const transaction = response.initiateSendMoney.transaction;

    return {
      transactionId: transaction.id,
      status: transaction.status,
      deeplinkUrl: transaction.deeplinkUrl,
    };
  } catch (error) {
    console.error('Wave payment error:', error);
    throw error;
  }
}

export async function checkWaveTransactionStatus(transactionId: string) {
  try {
    const query = gql`
      query GetTransaction($id: ID!) {
        transaction(id: $id) {
          id
          status
          amount
          direction
          failureReason
        }
      }
    `;

    const response: any = await waveClient.request(query, { id: transactionId });

    return response.transaction;
  } catch (error) {
    console.error('Wave status check error:', error);
    throw error;
  }
}

export function verifyWaveWebhookSignature(
  payload: string,
  signature: string | undefined
): boolean {
  try {
    if (!signature) return false;

    // Wave sends HMAC-SHA256 signature in X-Wave-Signature header
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha256', process.env.WAVE_API_KEY || '')
      .update(payload)
      .digest('hex');

    return hash === signature;
  } catch (error) {
    console.error('Wave signature verification error:', error);
    return false;
  }
}
