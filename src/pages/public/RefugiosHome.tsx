import { useEffect, useState } from "react";
import { getShelters } from "../../api/shelters.api";
import type { Shelter } from "../../types/shelter.types";

export default function RefugiosHome() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getShelters()
      .then(setShelters)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-center text-gray-500">
        Cargando refugios...
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
      {shelters.map((shelter) => (
        <div
          key={shelter.id}
          className="bg-white rounded-2xl shadow-md p-6
                     flex flex-col items-center text-center
                     hover:shadow-xl transition"
        >
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 mb-4">
            {shelter.photo ? (
              <img
                src={shelter.photo}
                alt={shelter.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                🏠
              </div>
            )}
          </div>

          <h3 className="font-semibold text-gray-800">
            {shelter.name}
          </h3>

          <span className="mt-2 text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
            {shelter.pets_count} mascotas
          </span>
        </div>
      ))}
    </div>
  );
}