import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AccessToken } from './entities/access-token.entity';
import * as bcrypt from 'bcrypt';
import { MoreThan } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AccessToken)
    private accessTokenRepository: Repository<AccessToken>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    // Kiểm tra xem user có token còn hiệu lực không
    const validToken = await this.accessTokenRepository.findOne({
      where: {
        user: { id: user.id },
        expiresAt: MoreThan(new Date()),
      },
    });

    if (validToken) {
      return {
        access_token: validToken.token,
        user: {
          id: user.id,
          username: user.username,
        },
      };
    }

    // Nếu không có token hợp lệ, tạo token mới
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token hết hạn sau 24 giờ

    // Lưu token vào database
    const accessToken = this.accessTokenRepository.create({
      token,
      expiresAt,
      user,
    });
    await this.accessTokenRepository.save(accessToken);

    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }
}
