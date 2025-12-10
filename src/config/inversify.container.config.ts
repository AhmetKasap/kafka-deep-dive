import { Container } from "inversify"
import { Config, type IConfig } from "./env.config"
import { SERVICE_TYPES } from "../types/service.types"
import App from "../app"
import { KafkaProducerService } from "@/kafka/kafka.producer"
import { KafkaConsumerService } from "@/kafka/kafka.consumer"



const container = new Container()

//! Bindings - Config
container.bind<IConfig>(SERVICE_TYPES.IConfig).to(Config)


//! Bindings - Kafka
container
	.bind(SERVICE_TYPES.KafkaProducerService)
	.to(KafkaProducerService)
	.inSingletonScope()
container
	.bind(SERVICE_TYPES.KafkaConsumerService)
	.to(KafkaConsumerService)
	.inSingletonScope()



//! Bindings - App
container.bind(SERVICE_TYPES.IApp).to(App).inSingletonScope()

export { container }
