// app/stock-correction/components/forms/stock-correction.constants.ts

export const TIPO_MOVIMENTO_OPTIONS = [
  {
    id: '7e2b1c8a-4f3a-4e2c-9b7d-2a1e6c3d8f2a',
    text: 'Entrada',
  },
  {
    id: '3c9f7e1d-8b2a-4c6e-9f1a-7d4e2b3c1a5f',
    text: 'Saída',
  },
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
    text: 'Estoque Atual',
  },
] as const;

export type TipoMovimentoOption = (typeof TIPO_MOVIMENTO_OPTIONS)[number];
