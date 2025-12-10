import type App from "./app"
import { container } from "./config/inversify.container.config"
import { SERVICE_TYPES } from "./types/service.types"

const app = container.get<App>(SERVICE_TYPES.IApp)
app.start()
