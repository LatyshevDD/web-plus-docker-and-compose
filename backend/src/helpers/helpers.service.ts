import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HelpersService {
 compare(password: string, userPassword: string ) {
    return bcrypt.compare(password, userPassword);
  }

  hash(password: string) {
   return bcrypt.hash(password, 10);
  }

}