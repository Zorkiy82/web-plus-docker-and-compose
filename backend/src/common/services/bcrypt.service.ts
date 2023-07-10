import { Injectable } from '@nestjs/common';
import { compare as bcryptCompare, hash as bcryptHash } from 'bcrypt';

@Injectable()
export class BcryptService {
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return await bcryptCompare(data, encrypted);
  }

  async hash(
    data: string | Buffer,
    saltOrRounds: string | number,
  ): Promise<string> {
    return await bcryptHash(data, saltOrRounds);
  }
}
