import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppService {
  async getHello() {
    const res = await axios.get('https://dev-api.nftpod.io/setting')
    return res.data
  }
}
