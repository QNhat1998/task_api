import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Task } from './task/entities/task.entity';
import { AccessToken } from './auth/entities/access-token.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TaskModule,
    UsersModule,
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const dbType = configService.get('DB_TYPE', 'mysql');
        const config = {
          type: dbType === 'postgres' ? 'postgres' : 'mysql',
          host: configService.get('DB_HOST'),
          port: parseInt(configService.get('DB_PORT', '5432')),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [User, Task, AccessToken],
          synchronize: configService.get('NODE_ENV') !== 'production',
        };

        return dbType === 'postgres'
          ? (config as PostgresConnectionOptions)
          : (config as MysqlConnectionOptions);
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
