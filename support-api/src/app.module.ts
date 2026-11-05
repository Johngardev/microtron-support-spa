import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth/auth.module';
import { UsersModule } from './users/users.module';
import { IncidentsModule } from './incidents/incidents.module';
import { SessionsModule } from './sessions/sessions.module';
import { ChatModule } from './chat/chat.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión "en caliente" a Cosmos DB
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.COSMOS_MONGO_CONN, // conexión Mongo
        dbName: process.env.DATABASE_NAME || 'support', // nombre de la BD
      }),
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    IncidentsModule,
    SessionsModule,
    ChatModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
