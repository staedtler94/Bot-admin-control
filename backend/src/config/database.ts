import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let dynamoDbClient: DynamoDBDocumentClient;

export function initializeDynamoDB(): DynamoDBDocumentClient {
  const endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
  const region = process.env.AWS_REGION || 'us-east-1';

  const client = new DynamoDBClient({
    endpoint,
    region,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
    },
  });

  dynamoDbClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  });

  return dynamoDbClient;
}

export function getDynamoDBClient(): DynamoDBDocumentClient {
  if (!dynamoDbClient) {
    throw new Error('DynamoDB client not initialized. Call initializeDynamoDB first.');
  }
  return dynamoDbClient;
}
