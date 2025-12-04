import { BandeiraCartaoList } from './components/list/bandeira-cartao-list';
import { BandeiraCartaoProvider } from './components/list/bandeira-cartao-context';

export default function BandeiraCartao() {
  return (
    <BandeiraCartaoProvider>
      <div className="container mx-auto py-6 px-4">
        <BandeiraCartaoList
          columns={[]}
          sortColumns={['descricao']}
          defaultSortField="descricao"
          defaultSortDirection="asc"
        />
      </div>
    </BandeiraCartaoProvider>
  );
}