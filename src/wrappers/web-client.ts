import * as process from 'process';
import { ofetch } from 'ofetch';
import Logger from '@/wrappers/logger';
import { LogTagEnum } from '@/enums';

interface ActivateCodeResponse {
  code: number;
  msg: string;
}

class WebClient {
  private readonly host: string;

  private id: number;

  private promo: string;

  constructor(id?: number, promo?: string) {
    this.setId(id).setPromo(promo);

    this.host = process.env.TIME_PRINCESS_ROUTE!;
  }

  async activatePromo(): Promise<ActivateCodeResponse | null> {
    if (!this.getId() || !this.getPromo()) {
      return null;
    }

    const params = new URLSearchParams();
    params.set('iggid', this.getId().toString());
    params.set('cdkey', this.getPromo());

    const options = {
      method     : 'POST',
      body       : params.toString(),
      headers    : { 'Content-Type': 'application/x-www-form-urlencoded' },
      retry      : 5,
      retryDelay : 300,
    };

    try {
      const result = await ofetch(this.getHost(), options);

      return result as ActivateCodeResponse;
    } catch (e) {
      Logger.error(`Error while making request with options ${JSON.stringify(options)}. Error: ${e.data}`, LogTagEnum.System);

      return null;
    }
  }

  getHost(): string {
    return this.host;
  }

  getId(): number {
    return this.id;
  }

  setId(id?: number): WebClient {
    this.id = id;

    return this;
  }

  getPromo(): string {
    return this.promo;
  }

  setPromo(promo?: string): WebClient {
    this.promo = promo;

    return this;
  }
}

export default WebClient;
