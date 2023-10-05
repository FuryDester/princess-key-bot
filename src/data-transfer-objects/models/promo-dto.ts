import Lokiable from '@/data-transfer-objects/lokiable';

class PromoDto extends Lokiable {
  promo: string;

  chat_id: number;

  created_at: number;

  updated_at: number;
}

export default PromoDto;
