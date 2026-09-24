import { motion } from "framer-motion";
import type { LibroResponse } from "@/api/types";

interface BookCardProps {
  libro: LibroResponse;
  autor: string;
  genero: string;
  onOpen: () => void;
}

export function BookCard({ libro, autor, genero, onOpen }: BookCardProps) {
  return (
    <button onClick={onOpen} className="group text-left w-full">
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        className="relative aspect-2/3 rounded-l-sm rounded-r-xl overflow-hidden bg-[#2e2a24] shadow-[0_10px_24px_rgba(34,30,25,0.14)] transition-shadow group-hover:shadow-[0_24px_48px_rgba(34,30,25,0.24)]"
      >
        {libro.portada ? (
          <img
            src={libro.portada}
            alt={libro.nombre}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <span className="font-editorial absolute inset-0 flex items-center justify-center text-6xl text-[#f3eee5] bg-linear-to-br from-[#3a352d] to-[#221e19]">
            {libro.nombre.charAt(0).toUpperCase()}
          </span>
        )}

        <div className="absolute left-0 top-0 bottom-0 w-2.5 z-10 bg-linear-to-r from-black/30 to-transparent" />

        <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-linear-to-t from-[#221e19]/60 to-transparent flex items-end p-3">
          <span className="text-xs font-medium text-[#f3eee5] tracking-wide">Ver libro →</span>
        </div>
      </motion.div>

      <h3 className="font-editorial mt-3 text-sm font-semibold leading-snug text-[#221e19] group-hover:text-[#b23a2f] transition-colors line-clamp-2">
        {libro.nombre}
      </h3>
      <p className="mt-0.5 text-xs text-[#8b8377] truncate">{autor}</p>
      <p className="text-[11px] text-[#8b8377]/80 truncate">
        {genero ? `${genero} · ` : ""}
        {libro.anio_publicacion}
      </p>
    </button>
  );
}