import { useQuery, gql } from '@apollo/client';
import { useState, useMemo } from 'react';
import SearchFilter from './SearchFilter';
import ComercioCard from './ComercioCard';

/* ---------- Tipos ---------- */
type Comercio = {
  title: string;
  slug: string;
  camposComercio: {
    categoria?: string | string[];
    direccion?: string;
    telefono?: string;
    sitioWeb?: string;
    descripcionextendida?: string;
    imagenExtra?: {
      node?: { sourceUrl?: string };
    };
    imagenExtra1?: {
      node?: { sourceUrl?: string };
    };
    imagenExtra2?: {
      node?: { sourceUrl?: string };
    };
    imagenExtra3?: {
      node?: { sourceUrl?: string };
    };
    imagenExtra4?: {
      node?: { sourceUrl?: string };
    };
  };
};

/* ---------- Query con cursores ---------- */
const GET_COMERCIOS = gql`
  query GetComercios($first: Int!, $after: String) {
    comercios(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          title
          slug
          camposComercio {
            categoria
            direccion
            telefono
            sitioWeb


            descripcionextendida
            imagenExtra { node { sourceUrl } }
            imagenExtra1 { node { sourceUrl } }
            imagenExtra2 { node { sourceUrl } }
            imagenExtra3 { node { sourceUrl } }
            imagenExtra4 { node { sourceUrl } }
          }
        }
      }
    }
  }
`;

/* Util para normalizar texto (sin tildes, minúsculas) */
const normalize = (raw: any) =>
  (typeof raw === 'string' ? raw : '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/* ---------- Componente principal ---------- */
export default function Comercios() {
  const { data, loading, error, fetchMore, networkStatus } = useQuery(
    GET_COMERCIOS,
    {
      variables: { first: 6, after: null },
      notifyOnNetworkStatusChange: true,
    },
  );

  const [filter, setFilter] = useState<{ search: string; cats: string[] }>({
    search: '',
    cats: [],
  });

  // Categorías únicas para los checkboxes
  const categories = useMemo(() => {
    const cats = new Set<string>();
    data?.comercios.edges?.forEach((edge: any) => {
      const node = edge?.node;
      if (!node) return;
      const raw = node.camposComercio?.categoria;
      const cat = Array.isArray(raw) ? raw[0] : raw || '';
      if (cat) cats.add(cat);
    });
    return Array.from(cats);

  }, [data]);

  // Filtrar localmente lo que ya llegó
  type ComercioEdge = { node: Comercio };

  const edges: ComercioEdge[] = data?.comercios.edges ?? [];

  const filteredEdges = useMemo(() => {
    const term = normalize(filter.search);
    const selectedCats = filter.cats.map(normalize);

    return edges.filter(({ node }) => {
      const raw = node.camposComercio?.categoria;
      const cat = normalize(Array.isArray(raw) ? raw[0] : raw || '');
      const title = normalize(node.title);


      const matchText = !term || title.includes(term) || cat.includes(term);
      const matchCat = selectedCats.length === 0 || selectedCats.includes(cat);
      return matchText && matchCat;

    });
  }, [edges, filter]);

  const hasNext = data?.comercios.pageInfo?.hasNextPage;
  const endCursor = data?.comercios.pageInfo?.endCursor;
  const isFetchingMore = networkStatus === 3;

  if (loading && !data) return <p>Cargando…</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {/* Buscador y checkboxes */}
      <SearchFilter
        categories={categories}
        onFilter={(search, cats) => setFilter({ search, cats })}
      />

      {/* Grid de tarjetas */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEdges.map(({ node }) => (
          <ComercioCard
            key={node.slug}
            slug={node.slug}
            title={node.title}
            categoria={node.camposComercio?.categoria ?? []}

            direccion={node.camposComercio?.direccion ?? ''}
            telefono={node.camposComercio?.telefono ?? ''}
            sitioWeb={node.camposComercio?.sitioWeb ?? ''}
            imagenUrl={node.camposComercio?.imagenExtra?.node?.sourceUrl ?? ''}
            descripcionextendida={node.camposComercio?.descripcionextendida ?? ''}


            imagenExtra1Url={node.camposComercio?.imagenExtra1?.node?.sourceUrl ?? ''}
            imagenExtra2Url={node.camposComercio?.imagenExtra2?.node?.sourceUrl ?? ''}
            imagenExtra3Url={node.camposComercio?.imagenExtra3?.node?.sourceUrl ?? ''}
            imagenExtra4Url={node.camposComercio?.imagenExtra3?.node?.sourceUrl ?? ''}


        />

        ))}
      </div>

      {/* Botón Cargar más */}
      {hasNext && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() =>
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (!fetchMoreResult) return prev;
                  return {
                    comercios: {
                      __typename: prev.comercios.__typename,
                      edges: [
                        ...prev.comercios.edges,
                        ...fetchMoreResult.comercios.edges,
                      ],
                      pageInfo: fetchMoreResult.comercios.pageInfo,
                    },
                  };
                },
              })
            }
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            disabled={isFetchingMore}
          >
            {isFetchingMore ? 'Cargando…' : 'Cargar más'}
          </button>
        </div>
      )}

      {/* Mensaje cuando no quedan coincidencias */}
      {filteredEdges.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No se encontraron comercios.
        </p>
      )}
    </div>
  );
}
