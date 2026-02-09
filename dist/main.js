"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const jwt_auth_guard_1 = require("./security/jwt-auth.guard");
async function bootstrap() {
    console.log('=== Environment Variables Debug ===');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('DB_USERNAME:', process.env.DB_USERNAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'SET' : 'NOT SET');
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Current working directory:', process.cwd());
    console.log('===================================');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard());
    app.enableCors();
    await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
    console.log(`Server running on http://0.0.0.0:${process.env.PORT ?? 3001}`);
}
bootstrap();
//# sourceMappingURL=main.js.map