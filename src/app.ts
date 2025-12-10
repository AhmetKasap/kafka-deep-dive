import { createServer, Server } from "http"
import type { Express } from "express"
import { inject, injectable } from "inversify"
import express from "express"
import { IConfig } from "./config/env.config"
import { SERVICE_TYPES } from "./types/service.types"

@injectable()
class App {
	app: Express
	httpServer: Server

	constructor(
		@inject(SERVICE_TYPES.IConfig) private readonly config: IConfig
	) {
		const app: Express = express()

		app.use(express.json())
		app.use(express.urlencoded({ extended: true }))
		

		this.app = app
		this.httpServer = createServer(this.app)
	}
	async start() {
		this.httpServer.listen(this.config.PORT, () => {
			console.log(`Server is running on port ${this.config.PORT}`)
		})
	}
	
}

export default App
