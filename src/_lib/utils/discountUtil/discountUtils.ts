export const DISCOUNT_PERCENT = 20;

export function calculateDiscountPrice(originalPrice: number, isOffer?: boolean): number {

    if ( !isOffer || originalPrice <=0) return originalPrice;
    return originalPrice * (1 - DISCOUNT_PERCENT / 100);
}
