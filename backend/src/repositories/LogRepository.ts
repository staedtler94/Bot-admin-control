import { QueryCommand, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '../config/database';
import { Log, CreateLogInput, LogFilter } from '../models/Log';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'logs';

export class LogRepository {
  static async findByBotId(botId: string, limit: number = 20): Promise<{ items: Log[]; count: number }> {
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
        ScanIndexForward: false, // Most recent first
      })
    );

    return {
      items: (result.Items as Log[]) || [],
      count: result.Count || 0,
    };
  }

  static async findByWorkerId(workerId: string, limit: number = 20): Promise<{ items: Log[]; count: number }> {
    const client = getDynamoDBClient();
    const result = await client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'worker-index',
        KeyConditionExpression: 'worker = :workerId',
        ExpressionAttributeValues: {
          ':workerId': workerId,
        },
        Limit: limit,
        ScanIndexForward: false, // Most recent first
      })
    );

    return {
      items: (result.Items as Log[]) || [],
      count: result.Count || 0,
    };
  }

  static async findWithFilter(filter: LogFilter): Promise<{ items: Log[]; count: number }> {
    const client = getDynamoDBClient();
    const limit = Math.min(filter.limit || 20, 100);

    let result;

    if (filter.bot) {
      result = await client.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: 'bot-index',
          KeyConditionExpression: 'bot = :botId',
          FilterExpression: this.buildFilterExpression(filter),
          ExpressionAttributeValues: this.buildAttributeValues(filter),
          Limit: limit,
          ScanIndexForward: false,
        })
      );
    } else if (filter.worker) {
      result = await client.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: 'worker-index',
          KeyConditionExpression: 'worker = :workerId',
          FilterExpression: this.buildFilterExpression(filter),
          ExpressionAttributeValues: this.buildAttributeValues(filter),
          Limit: limit,
          ScanIndexForward: false,
        })
      );
    } else {
      result = await client.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: this.buildFilterExpression(filter),
          ExpressionAttributeValues: this.buildAttributeValues(filter),
          Limit: limit,
        })
      );
    }

    return {
      items: (result.Items as Log[]) || [],
      count: result.Count || 0,
    };
  }

  static async create(input: CreateLogInput): Promise<Log> {
    const client = getDynamoDBClient();
    const log: Log = {
      id: uuidv4(),
      created: new Date().toISOString(),
      message: input.message,
      bot: input.bot,
      worker: input.worker,
    };

    await client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: log,
      })
    );

    return log;
  }

  private static buildFilterExpression(filter: LogFilter): string | undefined {
    const conditions: string[] = [];

    if (filter.bot) {
      conditions.push('bot = :botId');
    }

    if (filter.worker) {
      conditions.push('worker = :workerId');
    }

    if (filter.messageSearch) {
      conditions.push('contains(#message, :messageSearch)');
    }

    if (filter.startDate) {
      conditions.push('created >= :startDate');
    }

    if (filter.endDate) {
      conditions.push('created <= :endDate');
    }

    return conditions.length > 0 ? conditions.join(' AND ') : undefined;
  }

  private static buildAttributeValues(filter: LogFilter): Record<string, any> {
    const values: Record<string, any> = {};

    if (filter.bot) {
      values[':botId'] = filter.bot;
    }

    if (filter.worker) {
      values[':workerId'] = filter.worker;
    }

    if (filter.messageSearch) {
      values[':messageSearch'] = filter.messageSearch;
    }

    if (filter.startDate) {
      values[':startDate'] = filter.startDate;
    }

    if (filter.endDate) {
      values[':endDate'] = filter.endDate;
    }

    return values;
  }
}
