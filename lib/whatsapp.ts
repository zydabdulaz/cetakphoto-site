const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
export const whatsappUrl = (context: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(`Halo CetakPhoto, saya ingin konsultasi tentang ${context}.`)}`;
