// src/components/ComercioCard.tsx
// src/components/Comercios.tsx
// src/components/ComercioCard.tsx
import { useNavigate } from 'react-router-dom';
interface ComercioProps {
  title: string;
  direccion: string;
  telefono: string;
  categoria: string;
  sitioWeb: string;
  imagenUrl?: string;
  slug: string;
  descripcionextendida?: string;
  imagenExtra1Url?: string;
  imagenExtra2Url?: string;
  imagenExtra3Url?: string;
}

export default function ComercioCard({
  slug, title, direccion, telefono, categoria, sitioWeb, imagenUrl
}: ComercioProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/comercio/${slug}`)}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg cursor-pointer"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p>{direccion}</p>
      <p>{telefono}</p>
      <p>{categoria}</p>
      <a href={sitioWeb} target="_blank" rel="noreferrer">{sitioWeb}</a>
      {imagenUrl && <img src={imagenUrl} alt={title} className="mt-2 rounded w-full object-contain" />}
    </div>
  );
}

