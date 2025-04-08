import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('access_tokens')
export class AccessToken {
  @ApiProperty({ description: 'The unique identifier of the access token' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The JWT token string' })
  @Column()
  token: string;

  @ApiProperty({ description: 'The expiration date of the token' })
  @Column()
  expiresAt: Date;

  @ApiProperty({ description: 'The ID of the user who owns this token' })
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.accessTokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({ description: 'The date when the token was created' })
  @CreateDateColumn()
  createdAt: Date;
}
