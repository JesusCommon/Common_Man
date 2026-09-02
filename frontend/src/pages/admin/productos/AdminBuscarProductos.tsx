import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useBuscarProductos,
  useObtenerProductoPorSlug,
  useListarPorCategoria,
  useObtenerProductosRecientes,
  useListarCategoriasActivas,
} from "@/hooks";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { Select } from "@/components/ui/Select";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { Tabs } from "@/components/ui/Tabs";
import type { TabItem } from "@/components/ui/Tabs";
import { Package, Pencil, Search } from "lucide-react";
import type { ProductoPublicResponse } from "@/api/types";

type ModoBusqueda = "nombre" | "slug" | "categoria" | "recientes";
type ListaPublica =
  | ProductoPublicResponse[]
  | { items: ProductoPublicResponse[]; total: number };

function extractItems(data: ListaPublica | undefined): ProductoPublicResponse[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.items;
}

const formatPrecio = (precio: number): string =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(precio);

function ProductoCard({ producto }: { producto: ProductoPublicResponse }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
      <div className="w-full h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <div className="min-w-0">
        <p className="font-medium text-gray-900 truncate">{producto.nombre}</p>
        <p className="text-xs text-gray-500 truncate">{producto.slug}</p>
      </div>
      <p className="text-sm font-semibold text-emerald-600">
        {formatPrecio(producto.precio)}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => navigate(`/admin/productos/editar/${producto.id}`)}
      >
        <Pencil className="w-4 h-4 mr-2" />
        Editar
      </Button>
    </div>
  );
}

function ResultGrid({ productos }: { productos: ProductoPublicResponse[] }) {
  if (productos.length === 0) {
    return <p className="text-sm text-gray-500">No se encontraron productos.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {productos.map((p) => (
        <ProductoCard key={p.id} producto={p} />
      ))}
    </div>
  );
}

export default function AdminBuscarProductos() {
  const [modo, setModo] = useState<ModoBusqueda>("nombre");
  const [nombreInput, setNombreInput] = useState("");
  const [nombreQuery, setNombreQuery] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [slugQuery, setSlugQuery] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const categorias = useListarCategoriasActivas({ skip: 0, limit: 100 });
  const porNombre = useBuscarProductos(
    nombreQuery ? { nombre: nombreQuery } : {}
  );
  const porSlug = useObtenerProductoPorSlug(slugQuery);
  const porCategoria = useListarPorCategoria(categoriaId);
  const recientes = useObtenerProductosRecientes();

  const tabs: TabItem<ModoBusqueda>[] = [
    { key: "nombre", label: "Por Nombre" },
    { key: "slug", label: "Por Slug" },
    { key: "categoria", label: "Por Categoría" },
    { key: "recientes", label: "Recientes" },
  ];

  const categoriasOptions =
    categorias.data?.items?.map((c) => ({ value: c.id, label: c.nombre })) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Buscar Productos
        </h1>
        <p className="text-gray-500 text-sm">
          Centro de búsqueda del catálogo: por nombre, slug, categoría o
          productos recientes.
        </p>
      </div>

      <Tabs tabs={tabs} active={modo} onChange={setModo} />

      {/* ===== POR NOMBRE ===== */}
      {modo === "nombre" && (
        <section className="space-y-4">
          <form
            className="flex items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setNombreQuery(nombreInput.trim());
            }}
          >
            <div className="flex-1">
              <TextField
                label="Nombre del producto"
                value={nombreInput}
                onChange={setNombreInput}
                placeholder="Ej: camiseta, gorra, taza..."
                icon={Search}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!nombreInput.trim()}
            >
              Buscar
            </Button>
          </form>

          {porNombre.isLoading && <Spinner />}
          {porNombre.isError && (
            <ErrorAlert
              error={porNombre.error}
              fallback="Error al buscar productos"
            />
          )}
          {porNombre.data && (
            <ResultGrid productos={extractItems(porNombre.data)} />
          )}
        </section>
      )}

      {/* ===== POR SLUG ===== */}
      {modo === "slug" && (
        <section className="space-y-4">
          <form
            className="flex items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSlugQuery(slugInput.trim().toLowerCase());
            }}
          >
            <div className="flex-1">
              <TextField
                label="Slug del producto"
                value={slugInput}
                onChange={setSlugInput}
                placeholder="Ej: camiseta-negra"
                icon={Search}
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              disabled={!slugInput.trim()}
            >
              Buscar
            </Button>
          </form>

          {porSlug.isLoading && <Spinner />}
          {porSlug.isError && (
            <ErrorAlert
              error={porSlug.error}
              fallback="No se encontró un producto con ese slug."
            />
          )}
          {porSlug.data && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ProductoCard producto={porSlug.data} />
            </div>
          )}
        </section>
      )}

      {/* ===== POR CATEGORÍA ===== */}
      {modo === "categoria" && (
        <section className="space-y-4">
          <div className="max-w-sm">
            <Select
              label="Categoría"
              value={categoriaId}
              onChange={setCategoriaId}
              options={categoriasOptions}
              placeholder="Selecciona una categoría..."
            />
          </div>

          {porCategoria.isLoading && <Spinner />}
          {porCategoria.isError && (
            <ErrorAlert
              error={porCategoria.error}
              fallback="Error al listar productos por categoría"
            />
          )}
          {porCategoria.data && (
            <ResultGrid productos={extractItems(porCategoria.data)} />
          )}
        </section>
      )}

      {/* ===== RECIENTES ===== */}
      {modo === "recientes" && (
        <section className="space-y-4">
          {recientes.isLoading && <Spinner />}
          {recientes.isError && (
            <ErrorAlert
              error={recientes.error}
              fallback="Error al cargar productos recientes"
            />
          )}
          {recientes.data && (
            <ResultGrid productos={extractItems(recientes.data)} />
          )}
        </section>
      )}
    </div>
  );
}