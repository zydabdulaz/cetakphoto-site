export type Group = 'print' | 'frame' | 'service';
export type Item = { name: string; detail: string; price: string };
export type Section = { id: string; group: Group; title: string; intro: string; items: Item[] };
const rows = (r: string[][]): Item[] => r.map(([name, detail, price]) => ({ name, detail, price }));
export const catalog: Section[] = [
  {
    id: 'paper',
    group: 'print',
    title: 'Cetak Foto · Kertas Foto',
    intro: 'Ukuran 2R sampai 24R, glossy atau doff.',
    items: rows([
      ['2R', '6 × 9 cm', 'Rp2.500'],
      ['3R', '8,9 × 12,7 cm', 'Rp3.500'],
      ['4R', '10,2 × 15,2 cm', 'Rp5.000'],
      ['5R', '12,7 × 17,8 cm', 'Rp8.000'],
      ['6R', '15,2 × 20,3 cm', 'Rp12.000'],
      ['8R', '20,3 × 25,4 cm', 'Rp22.000'],
      ['10R', '25,4 × 30,5 cm', 'Rp38.000'],
      ['12R', '30,5 × 38,1 cm', 'Rp65.000'],
      ['16R', '40,6 × 50,8 cm', 'Rp135.000'],
      ['20R', '50,8 × 60,9 cm', 'Rp210.000'],
      ['24R', '60,9 × 80 cm', 'Rp325.000'],
    ]),
  },
  {
    id: 'canvas',
    group: 'print',
    title: 'Cetak Foto · Canvas',
    intro: 'Tekstur hangat untuk dekorasi dan karya visual.',
    items: rows([
      ['Canvas 12R', '30,5 × 38,1 cm', 'Rp125.000'],
      ['Canvas 16R', '40,6 × 50,8 cm', 'Rp195.000'],
      ['Canvas 20R', '50,8 × 60,9 cm', 'Rp285.000'],
      ['Canvas 24R', '60,9 × 80 cm', 'Rp425.000'],
    ]),
  },
  {
    id: 'minimalist',
    group: 'frame',
    title: 'Frame Minimalis',
    intro: 'Profil bersih untuk foto 2R sampai 24R.',
    items: rows(
      ['2R', '3R', '4R', '5R', '6R', '8R', '10R', '12R', '16R', '20R', '24R'].map((s) => [
        `Frame Minimalis ${s}`,
        `Untuk foto ukuran ${s}`,
        'Mulai Rp35.000',
      ])
    ),
  },
  {
    id: 'decorative',
    group: 'frame',
    title: 'Frame Decorative',
    intro: 'Frame 3D, Baby, Graduation, Wedding, dan custom.',
    items: rows([
      ['Frame 3D', 'Layer dekoratif dan elemen timbul', 'Rp185.000'],
      ['Frame Baby', 'Nama dan detail kelahiran', 'Rp195.000'],
      ['Frame Graduation', 'Nama, gelar, kampus, dan tanggal wisuda', 'Rp210.000'],
      ['Frame Custom', 'Tema dan ukuran sesuai kebutuhan', 'Tanya harga'],
    ]),
  },
  {
    id: 'pasfoto',
    group: 'service',
    title: 'Jasa Pas Foto',
    intro: 'Untuk dokumen, sekolah, kerja, visa, dan administrasi.',
    items: rows([
      ['Pas Foto Basic', '4 lembar 3×4 dan file digital', 'Rp35.000'],
      ['Pas Foto Lengkap', 'Ukuran 2×3, 3×4, 4×6, file digital', 'Rp65.000'],
      ['Pas Foto Premium', 'Makeup ringan, retouch, seluruh ukuran', 'Rp125.000'],
    ]),
  },
  {
    id: 'studio',
    group: 'service',
    title: 'Photo Studio · Paket',
    intro: 'Sesi dengan fotografer dan arahan pose.',
    items: rows([
      ['Paket Keluarga', '60 menit · maks. 6 orang · 15 file edit', 'Rp550.000'],
      ['Paket Graduation', '45 menit · graduate + keluarga · 10 file edit', 'Rp425.000'],
      ['Paket Couple', '45 menit · 2 orang · 10 file edit', 'Rp375.000'],
      ['Paket Group', '60 menit · maks. 10 orang · 15 file edit', 'Rp650.000'],
    ]),
  },
  {
    id: 'self',
    group: 'service',
    title: 'Self-Studio',
    intro: 'Studio privat dengan remote shutter.',
    items: rows([
      ['Self-Studio Mini', '15 menit · maks. 2 orang · semua file', 'Rp95.000'],
      ['Self-Studio Standard', '25 menit · maks. 4 orang · semua file', 'Rp155.000'],
      ['Self-Studio Group', '35 menit · maks. 8 orang · semua file', 'Rp245.000'],
    ]),
  },
  {
    id: 'photobox',
    group: 'service',
    title: 'Photobox',
    intro: 'Foto spontan dengan template strip.',
    items: rows([
      ['Photobox Basic', '6 pose · 2 strip cetak', 'Rp45.000'],
      ['Photobox Duo', '10 pose · 4 strip cetak', 'Rp75.000'],
      ['Photobox Event', '2 jam · unlimited session · custom template', 'Rp1.250.000'],
    ]),
  },
];
