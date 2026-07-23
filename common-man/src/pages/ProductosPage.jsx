// pages/ProductosPage.jsx
import { useState } from "react";
import { useProductos } from "../hooks/productos/useProductos";
import { useCrearProducto } from "../hooks/productos/useCrearProducto";
import { useCategoriaProducto } from "../hooks/categorias/useCategorias";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Checkbox } from "../components/ui/Checkbox";
import { Button } from "../components/ui/Button";
import { ErrorText } from "../components/ui/ErrorText";
import { Spinner } from "../components/ui/Spinner";

const FORM_INICIAL = {
  nombre: "",
  codigo: "",
  descripcion: "",
  precio: "",
  stock: "",
  descuento: "",
  disponible: true,
  categoria: "",
};

export function ProductosPage() {
  const { productos, loading: cargandoLista, error: errorLista, recargar } = useProductos();
  const { crear, loading: creando, errores, errorApi } = useCrearProducto();
  const { categorias, loading: cargandoCategorias } = useCategoriaProducto();

  const [form, setForm] = useState(FORM_INICIAL);

  const handleChange = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  // Checkbox maneja "checked", no "value" -> handler separado
  const handleCheckboxChange = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.checked }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convertimos strings vacíos/numéricos antes de validar con Zod
    const datosConvertidos = {
      ...form,
      precio: form.precio === "" ? undefined : Number(form.precio),
      stock: form.stock === "" ? undefined : Number(form.stock),
      descuento: form.descuento === "" ? undefined : Number(form.descuento),
    };

    const resultado = await crear(datosConvertidos);
    if (resultado.success) {
      setForm(FORM_INICIAL);
      recargar();
    }
  };

  const opcionesCategoria = categorias.map((cat) => ({
    value: cat.id,
    label: cat.nombre,
  }));

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Productos</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8 p-4 border rounded-lg">
        <Input
          id="nombre"
          label="Nombre"
          value={form.nombre}
          onChange={handleChange("nombre")}
          error={errores?.nombre}
        />
        <Input
          id="codigo"
          label="Código"
          value={form.codigo}
          onChange={handleChange("codigo")}
          error={errores?.codigo}
        />
        <Input
          id="descripcion"
          label="Descripción"
          value={form.descripcion}
          onChange={handleChange("descripcion")}
          error={errores?.descripcion}
        />
        <Input
          id="precio"
          label="Precio"
          type="number"
          step="0.01"
          value={form.precio}
          onChange={handleChange("precio")}
          error={errores?.precio}
        />
        <Input
          id="stock"
          label="Stock"
          type="number"
          value={form.stock}
          onChange={handleChange("stock")}
          error={errores?.stock}
        />
        <Input
          id="descuento"
          label="Descuento (%)"
          type="number"
          min="0"
          max="100"
          value={form.descuento}
          onChange={handleChange("descuento")}
          error={errores?.descuento}
        />

        <Select
          id="categoria"
          label="Categoría"
          value={form.categoria}
          onChange={handleChange("categoria")}
          options={opcionesCategoria}
          error={errores?.categoria}
          disabled={cargandoCategorias}
        />
        {cargandoCategorias && (
          <span className="text-sm text-gray-500">Cargando categorías...</span>
        )}

        <Checkbox
          id="disponible"
          label="Disponible para la venta"
          checked={form.disponible}
          onChange={handleCheckboxChange("disponible")}
          error={errores?.disponible}
        />

        <ErrorText>{errorApi}</ErrorText>

        <Button type="submit" loading={creando}>
          Crear producto
        </Button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Lista de productos</h2>

      {cargandoLista && <Spinner />}
      {errorLista && <ErrorText>{errorLista}</ErrorText>}

      {!cargandoLista && !errorLista && (
        <ul className="flex flex-col gap-2">
          {productos.map((p) => (
            <li key={p.id} className="p-3 border rounded-lg flex justify-between items-center">
              <span>{p.nombre} ({p.codigo})</span>
              <span className="text-sm text-gray-500">
                ${p.precio} {!p.disponible && "· No disponible"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}