import { Injectable } from '@nestjs/common';
import { JsonDatabaseService } from '../persistence/json-database.service';

@Injectable()
export class QuestionsService {
  constructor(private readonly db: JsonDatabaseService) {}
}
