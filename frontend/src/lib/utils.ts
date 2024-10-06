import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberToCurrency(price: number) {
  const PHPeso = new Intl.NumberFormat('fil-PH', {
    style: 'currency',
    currency: 'PHP'
  });

  return PHPeso.format(price);
}
