import { Injectable } from '@nestjs/common';
import { JsonDatabaseService } from '../persistence/json-database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly db: JsonDatabaseService) {}
}
