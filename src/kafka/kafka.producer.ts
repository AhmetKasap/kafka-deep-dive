import { IConfig } from "@/config/env.config"
import { SERVICE_TYPES } from "@/types/service.types"
import { inject, injectable } from "inversify"
import { Kafka, logLevel, Producer } from "kafkajs"

@injectable()
export class KafkaProducerService {
	private kafka: Kafka
	private producer: Producer
	private isConnected: boolean = false

	constructor(
		@inject(SERVICE_TYPES.IConfig) private readonly config: IConfig
	) {
		this.kafka = new Kafka({
			clientId: this.config.KAFKA_PRODUCER_CLIENT_ID,
			brokers: this.config.KAFKA_BROKERS.split(";"),

			logLevel: logLevel.INFO
		})

		this.producer = this.kafka.producer({
			allowAutoTopicCreation: false,
			retry: {
				retries: 5,
				initialRetryTime: 300,
				maxRetryTime: 3000,
				factor: 2
			}
		})
	}

	async connect() {
		if (this.isConnected) return
		try {
			await this.producer.connect()
			this.isConnected = true
		} catch (error) {
			throw error
		}
	}

	async sendMessage(topic: string, message: string) {
		if (!this.isConnected) await this.connect()

		await this.producer.send({
			topic,
			messages: [{ value: message }]
		})
	}

	async disconnect() {
		if (!this.isConnected) return

		try {
			await this.producer.disconnect()
			this.isConnected = false
		} catch (err) {
			throw err
		}
	}

	/** Health Check */
	async healthCheck() {
		try {
			await this.kafka.admin().connect()
			await this.kafka.admin().disconnect()
			return true
		} catch {
			return false
		}
	}
}
