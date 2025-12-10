import { inject, injectable } from "inversify"
import { Kafka, Consumer, logLevel } from "kafkajs"
import { SERVICE_TYPES } from "../types/service.types"
import { IConfig } from "../config/env.config"
import { IMessageHandler } from "./interfaces/message-handler.interface"

@injectable()
export class KafkaConsumerService {
	private kafka: Kafka
	private consumer: Consumer
	private isConnected: boolean = false
	private handlers: Map<string, IMessageHandler> = new Map()

	constructor(
		@inject(SERVICE_TYPES.IConfig) private readonly config: IConfig
	) {
		this.kafka = new Kafka({
			clientId: this.config.KAFKA_CONSUMER_CLIENT_ID,
			brokers: this.config.KAFKA_BROKERS.split(";"),
			logLevel: logLevel.INFO
		})

		this.consumer = this.kafka.consumer({
			groupId: this.config.KAFKA_GROUP_ID
		})
	}

	registerHandler(handler: IMessageHandler): void {
		const topic = handler.getTopic()
		this.handlers.set(topic, handler)
	}

	registerHandlers(handlers: IMessageHandler[]): void {
		handlers.forEach((handler) => this.registerHandler(handler))
	}

	async connect() {
		if (this.isConnected) {
			return
		}

		if (this.handlers.size === 0) {
			return
		}

		try {
			await this.consumer.connect()
			this.isConnected = true

			const topics = Array.from(this.handlers.keys())
			for (const topic of topics) {
				await this.consumer.subscribe({ topic, fromBeginning: true })
			}

			await this.consumer.run({
				eachMessage: async (payload) => {
					const { topic } = payload
					const handler = this.handlers.get(topic)
					if (handler) {
						try {
							await handler.handleMessage(payload)
						} catch (err) {
							console.error(
								`[Kafka Consumer] Error processing message in handler ${handler.constructor.name}:`,
								err
							)
						}
					}
				}
			})
		} catch (err) {
			throw err
		}
	}

	async disconnect() {
		if (!this.isConnected) return
		try {
			await this.consumer.disconnect()
			this.isConnected = false
		} catch (err) {
			throw err
		}
	}

	/** Health Check */
	async healthCheck(): Promise<boolean> {
		try {
			const admin = this.kafka.admin()
			await admin.connect()
			await admin.disconnect()
			return true
		} catch {
			return false
		}
	}
}
