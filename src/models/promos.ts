import BaseModel from '@/models/base-model';
import PromoDto from '@/data-transfer-objects/models/promo-dto';

class Promos extends BaseModel {
  protected getTableName(): string {
    return 'promos';
  }

  protected getTableOptions(): Record<string, unknown> | undefined {
    return undefined;
  }

  protected getDto(): PromoDto {
    return new PromoDto();
  }
}

export default Promos;
