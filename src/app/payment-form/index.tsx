import { PaymentFormList } from './components/list/payment-form-list';
import { PaymentFormProvider } from './components/list/payment-form-context';

export default function PaymentForm() {
  return (
    <PaymentFormProvider>
      <div className="container mx-auto py-6 px-4">
        <PaymentFormList
          columns={[]}
          sortColumns={['descricao', 'numeroParcela', 'tipoPagamento']}
          defaultSortField="descricao"
          defaultSortDirection="asc"
        />
      </div>
    </PaymentFormProvider>
  );
}
