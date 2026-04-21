import { GetCommand, ScanCommand, PutCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '../config/database';
import { Bot, CreateBotInput, UpdateBotInput } from '../models/Bot';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'bot-admin';

export class BotRepository {
  static async findAll(limit: number = 20, offset: number = 0): Promise<{ items: Bot[]; count: number }> {
    const client = getDynamoDBClient();
    const result = await client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': 'Bot',
        },
        Limit: limit,
      })
    );

    return {
      items: (result.Items as Bot[]) || [],
      count: result.Count || 0,
    };
  }

  static async findById(id: string): Promise<Bot | null> {
    const client = getDynamoDBClient();
    const result = await client.send(
      new GetCommand({
        TableName: TABLE_NAME,
        Key: { pk: 'Bot', sk: id },
      })
    );

    return (result.Item as Bot) || null;
  }

  static async create(input: CreateBotInput): Promise<Bot> {
    const client = getDynamoDBClient();
    const bot: Bot = {
      id: input.id || uuidv4(),
      name: input.name,
      description: input.description,
      status: input.status || 'ENABLED',
      created: Date.now(),
    };

    await client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: 'Bot',
          sk: bot.id,
          ...bot,
        },
      })
    );

    return bot;
  }

  static async update(id: string, input: UpdateBotInput): Promise<Bot> {
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

    if (input.status !== undefined) {
      updateExpression.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = input.status;
    }

    if (updateExpression.length === 0) {
      const existing = await this.findById(id);
      if (!existing) throw new Error('Bot not found');
      return existing;
    }

    const result = await client.send(
      new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { pk: 'Bot', sk: id },
        UpdateExpression: updateExpression.join(', '),
        ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      })
    );

    return result.Attributes as Bot;
  }

  static async delete(id: string): Promise<void> {
    const client = getDynamoDBClient();
    await client.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { pk: 'Bot', sk: id },
      })
    );
  }
}
