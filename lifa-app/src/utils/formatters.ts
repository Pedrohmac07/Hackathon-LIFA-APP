import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatMoney = (val: number) => {
 return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const formatDate = (dateString: string) => {
 return dateString ? format(new Date(dateString), "dd MMM", { locale: ptBR }) : '';
};
