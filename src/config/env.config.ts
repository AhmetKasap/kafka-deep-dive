import dotenv from "dotenv"
import { injectable } from "inversify"
dotenv.config()

export interface IConfig {
	PORT: number
	KAFKA_PRODUCER_CLIENT_ID: string
	KAFKA_BROKERS: string
	KAFKA_GROUP_ID: string
	KAFKA_CONSUMER_CLIENT_ID: string
}

@injectable()
export class Config implements IConfig {
	PORT: number
	KAFKA_PRODUCER_CLIENT_ID: string
	KAFKA_BROKERS: string
	KAFKA_GROUP_ID: string
	KAFKA_CONSUMER_CLIENT_ID: string
	constructor() {
		this.PORT = process.env["PORT"] as unknown as number
		this.KAFKA_PRODUCER_CLIENT_ID = process.env["KAFKA_CLIENT_ID"] as string
		this.KAFKA_BROKERS = process.env["KAFKA_BROKERS"] as string
		this.KAFKA_GROUP_ID = process.env["KAFKA_GROUP_ID"] as string
		this.KAFKA_CONSUMER_CLIENT_ID = process.env[
			"KAFKA_CONSUMER_CLIENT_ID"
		] as string
	}
}
