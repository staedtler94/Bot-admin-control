import { QueryCommand, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { getDynamoDBClient } from '../config/database';
import { Log, CreateLogInput, LogFilter } from '../models/Log';
import { v4 as uuidv4 } from 'uuid';

const TABLE_NAME = 'bot-admin';

export class LogRepository {
  static async findByBotId(botId: string, limit: number = 20, offset: number = 0): Promise<{ items: Log[]; count: number; total: number }> {
    const client = getDynamoDBClient();
    const adjustedLimit = limit + offset + 1; // Fetch one extra to detect if there's more
    const result = await client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': `Log#${botId}`,
        },
        Limit: adjustedLimit,
        ScanIndexForward: false, // Most recent first
      })
    );

    const items = (result.Items as Log[]) || [];
    const paginatedItems = items.slice(offset, offset + limit);
    
    // Calculate total: if we got more items than requested, we know there's more beyond
    const hasMore = items.length > limit + offset;
    const total = hasMore ? offset + limit + paginatedItems.length + 1 : items.length;

    return {
      items: paginatedItems,
      count: paginatedItems.length,
      total,
    };
  }

  static async findByWorkerId(botId: string, workerId: string, limit: number = 20, offset: number = 0): Promise<{ items: Log[]; count: number; total: number }> {
    const client = getDynamoDBClient();
    const adjustedLimit = limit + offset + 1; // Fetch one extra to detect if there's more
    const result = await client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :workerId)',
        ExpressionAttributeValues: {
          ':pk': `Log#${botId}`,
          ':workerId': `${workerId}#`,
        },
        Limit: adjustedLimit,
        ScanIndexForward: false, // Most recent first
      })
    );

    const items = (result.Items as Log[]) || [];
    const paginatedItems = items.slice(offset, offset + limit);
    
    // Calculate total: if we got more items than requested, we know there's more beyond
    const hasMore = items.length > limit + offset;
    const total = hasMore ? offset + limit + paginatedItems.length + 1 : items.length;

    return {
      items: paginatedItems,
      count: paginatedItems.length,
      total,
    };
  }

  static async findWithFilter(filter: LogFilter): Promise<{ items: Log[]; count: number; total: number }> {
    const client = getDynamoDBClient();
    const limit = Math.min(filter.limit || 20, 100);
    const offset = Math.max(filter.offset || 0, 0);
    const adjustedLimit = limit + offset + 1; // Fetch one extra to detect if there's more

    let result;

    if (filter.worker && filter.bot) {
      result = await client.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'pk = :pk AND begins_with(sk, :workerId)',
          FilterExpression: this.buildFilterExpression(filter),
          ExpressionAttributeValues: this.buildAttributeValues(filter),
          ExpressionAttributeNames: filter.messageSearch ? { '#message': 'message' } : undefined,
          Limit: adjustedLimit,
          ScanIndexForward: false,
        })
      );
    } else if (filter.bot) {
      result = await client.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'pk = :pk',
          FilterExpression: this.buildFilterExpression(filter),
          ExpressionAttributeValues: this.buildAttributeValues(filter),
          ExpressionAttributeNames: filter.messageSearch ? { '#message': 'message' } : undefined,
          Limit: adjustedLimit,
          ScanIndexForward: false,
        })
      );
    } else {
      result = await client.send(
        new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: this.buildFilterExpression(filter),
          ExpressionAttributeValues: this.buildAttributeValues(filter),
          ExpressionAttributeNames: filter.messageSearch ? { '#message': 'message' } : undefined,
          Limit: adjustedLimit,
        })
      );
    }

    const items = (result.Items as Log[]) || [];
    const paginatedItems = items.slice(offset, offset + limit);
    
    // Calculate total: if we got more items than requested, we know there's more beyond
    const hasMore = items.length > limit + offset;
    const total = hasMore ? offset + limit + paginatedItems.length + 1 : items.length;

    return {
      items: paginatedItems,
      count: paginatedItems.length,
      total,
    };
  }

  static async create(input: CreateLogInput): Promise<Log> {
    const client = getDynamoDBClient();
    const log: Log = {
      id: input.id || uuidv4(),
      created: new Date().toISOString(),
      message: input.message,
      bot: input.bot,
      worker: input.worker,
    };

    await client.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          pk: `Log#${log.bot}`,
          sk: `${log.worker}#${log.id}`,
          ...log,
        },
      })
    );

    return log;
  }

  private static buildFilterExpression(filter: LogFilter): string | undefined {
    const conditions: string[] = [];

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

    if (filter.messageSearch) {
      values[':messageSearch'] = filter.messageSearch;
    }

    if (filter.startDate) {
      values[':startDate'] = filter.startDate;
    }

    if (filter.endDate) {
      values[':endDate'] = filter.endDate;
    }

    if (filter.bot) {
      values[':pk'] = `Log#${filter.bot}`;
    }

    if (filter.worker) {
      values[':workerId'] = `${filter.worker}#`;
    }

    return values;
  }
}

