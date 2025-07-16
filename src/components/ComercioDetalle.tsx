import { useParams } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaGlobe, FaTags, FaArrowLeft } from 'react-icons/fa';
import { FaClock } from 'react-icons/fa';

const GET_COMERCIO_DETAIL = gql`
  query GetComercio($slug: String!) {
    comercioBy(slug: $slug) {
      title
      camposComercio {
        descripcionextendida
        imagenExtra { node { sourceUrl } }
        imagenExtra1 { node { sourceUrl } }
        imagenExtra2 { node { sourceUrl } }
        imagenExtra3 { node { sourceUrl } }
        direccion
        telefono
        sitioWeb
        categoria
        lunes
        martes
        miercoles
        jueves
        viernes
        sabado
        domingo
      }
    }
  }
`;

export default function ComercioDetalle() {
  const navigate = useNavigate();

  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = useQuery(GET_COMERCIO_DETAIL, {
    variables: { slug },
  });

  if (loading) return <p>Cargando detalle...</p>;
  if (error || !data?.comercioBy) return <p>No se encontró este comercio.</p>;

  const c = data.comercioBy.camposComercio;
  const imgs = [
    c.imagenExtra?.node?.sourceUrl,
    c.imagenExtra1?.node?.sourceUrl,
    c.imagenExtra2?.node?.sourceUrl,
    c.imagenExtra3?.node?.sourceUrl
  ].filter(Boolean) as string[];

  return (


    <div className="max-w-6xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">

      {/* Imagen destacada */}
      {imgs.length > 0 && (
        <div className="h-64 sm:h-80 md:h-96 w-full bg-gray-100 overflow-hidden">
          <img
            src={imgs[0]}
            alt={data.comercioBy.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contenido principal */}
      <div className="p-8 sm:p-12">

        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition shadow"
        >
          <FaArrowLeft /> Volver al listado
        </button>

        {/* Título */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{data.comercioBy.title}</h1>

        {/* Layout de dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Columna 1: Datos */}
          <div className="space-y-4 md:col-span-1 text-lg text-gray-700">
            <p className="flex items-start gap-3">
              <FaTags className="mt-1 text-yellow-500" />
              <span><strong>Categoría:</strong> {c.categoria}</span>
            </p>
            <p className="flex items-start gap-3">
              <FaMapMarkerAlt className="mt-1 text-red-500" />
              <span><strong>Dirección:</strong> {c.direccion}</span>
            </p>
            <p className="flex items-start gap-3">
              <FaPhoneAlt className="mt-1 text-green-500" />
              <span><strong>Teléfono:</strong> {c.telefono}</span>
            </p>
            <p className="flex items-start gap-3">
              <FaGlobe className="mt-1 text-blue-600" />
              <a
                href={c.sitioWeb}
                className="text-blue-600 underline break-all hover:text-blue-800"
                target="_blank"
                rel="noreferrer"
              >
                {c.sitioWeb}
              </a>
            </p>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FaClock className="text-yellow-500" /> Horarios de atención
              </h2>
              <ul className="text-gray-700 bg-gray-50 rounded-lg p-4 shadow-sm space-y-2">
                {[
                  { label: 'Lunes', value: c.lunes },
                  { label: 'Martes', value: c.martes },
                  { label: 'Miércoles', value: c.miercoles },
                  { label: 'Jueves', value: c.jueves },
                  { label: 'Viernes', value: c.viernes },
                  { label: 'Sábado', value: c.sabado },
                  { label: 'Domingo', value: c.domingo },
                ].map(({ label, value }) => (
                  <li key={label} className="flex justify-between border-b pb-1 last:border-b-0">
                    <span className="font-medium">{label}:</span>
                    <span>{value || 'Cerrado'}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Columna 2-3: Descripción + galería */}
          <div className="md:col-span-2 space-y-8">

            {/* Descripción extendida */}
            {c.descripcionextendida && (
              <div
                className="prose prose-lg max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: c.descripcionextendida }}
              />
            )}

            {/* Galería (excluyendo imagen principal) */}
            {imgs.length > 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Galería</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {imgs.slice(1).map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`${data.comercioBy.title} imagen ${i + 2}`}
                      className="rounded-xl shadow object-cover w-full h-64"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>

  );
}
