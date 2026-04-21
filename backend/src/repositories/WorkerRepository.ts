import { GetCommand, QueryCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '../config/database';
import { Worker, CreateWorkerInput, UpdateWorkerInput } from '../models/Worker';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'workers';

export class WorkerRepository {
  static async findAll(limit: number = 20, offset: number = 0): Promise<{ items: Worker[]; count: number }> {
    const client = getDynamoDBClient();
    // For demo, just scan all workers
    const result = await client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        Limit: limit,
      })
    );

    return {
      items: (result.Items as Worker[]) || [],
      count: result.Count || 0,
    };
  }

  static async findById(id: string): Promise<Worker | null> {
    const client = getDynamoDBClient();
    const result = await client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );

    return (result.Item as Worker) || null;
  }

  static async findByBotId(botId: string, limit: number = 20): Promise<{ items: Worker[]; count: number }> {
    const client = getDynamoDBClient();
    const result = await client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'bot-index',
        KeyConditionExpression: 'bot = :botId',
        ExpressionAttributeValues: {
          ':botId': botId,
        },
        Limit: limit,
      })
    );

    return {
      items: (result.Items as Worker[]) || [],
      count: result.Count || 0,
    };
  }

  static async create(input: CreateWorkerInput): Promise<Worker> {
    const client = getDynamoDBClient();
    const worker: Worker = {
      id: uuidv4(),
      name: input.name,
      description: input.description,
      bot: input.bot,
      created: Date.now(),
    };

    await client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: worker,
      })
    );

    return worker;
  }

  static async update(id: string, input: UpdateWorkerInput): Promise<Worker> {
    const client = getDynamoDBClient();
    const updateExpression: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    if (input.name !== undefined) {
      updateExpression.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = input.name;
    }

    if (input.description !== undefined) {
      updateExpression.push('description = :description');
      expressionAttributeValues[':description'] = input.description;
    }

    if (updateExpression.length === 0) {
      const existing = await this.findById(id);
      if (!existing) throw new Error('Worker not found');
      return existing;
    }

    const result = await client.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: updateExpression.join(', '),
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes as Worker;
  }

  static async delete(id: string): Promise<void> {
    const client = getDynamoDBClient();
    await client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id },
      })
    );
  }
}
