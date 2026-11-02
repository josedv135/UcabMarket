import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JsonDatabaseService } from '../persistence/json-database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: JsonDatabaseService,
    private readonly jwtService: JwtService,
  ) {}
}
