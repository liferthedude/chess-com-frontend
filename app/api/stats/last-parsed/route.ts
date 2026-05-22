import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION ?? 'eu-central-1' })

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (process.env.ENVIRONMENT === 'dev') {
    return NextResponse.json({ last_parsed_at: new Date().toISOString() })
  }

  const result = await dynamo.send(new GetItemCommand({
    TableName: 'chess-com-parser',
    Key: { key: { S: 'last_parsed_at' } },
  }))

  const value = result.Item?.value?.S ?? null
  return NextResponse.json({ last_parsed_at: value })
}
