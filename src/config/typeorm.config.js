"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeormConfig = void 0;
var typeorm_1 = require("typeorm");
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
var rawUrl = process.env.DATABASE_URL;
var dbName = process.env.DATABASE_NAME || process.env.DB_NAME || 'clever_sermon';
var databaseUrl = rawUrl;
if (rawUrl && dbName) {
    try {
        var parsed = new URL(rawUrl);
        if (!parsed.pathname || parsed.pathname === '/') {
            parsed.pathname = "/".concat(dbName);
            databaseUrl = parsed.toString();
        }
    }
    catch (_a) {
        databaseUrl = rawUrl;
    }
}
exports.typeormConfig = {
    type: 'postgres',
    url: databaseUrl,
    host: databaseUrl ? undefined : process.env.DATABASE_HOST,
    port: databaseUrl ? undefined : parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: databaseUrl ? undefined : process.env.DATABASE_USER,
    password: databaseUrl ? undefined : process.env.DATABASE_PASSWORD,
    database: databaseUrl ? undefined : dbName,
    entities: ['src/**/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*{.ts,.js}'],
    synchronize: false,
};
exports.default = new typeorm_1.DataSource(exports.typeormConfig);
