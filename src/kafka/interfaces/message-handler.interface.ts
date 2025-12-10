import { EachMessagePayload } from "kafkajs"

/**
 * Kafka Message Handler Interface
 * Her consumer bu interface'i implement ederek kendi iş mantığını yazar
 */
export interface IMessageHandler {
	/**
	 * Handler'ın dinleyeceği topic adı
	 */
	getTopic(): string

	/**
	 * Mesaj işleme mantığı
	 * @param payload Kafka'dan gelen mesaj payload'ı
	 */
	handleMessage(payload: EachMessagePayload): Promise<void>
}
