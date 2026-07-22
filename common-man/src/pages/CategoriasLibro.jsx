// pages/UsuariosPage.jsx
import { useState } from "react";
import { useCategoriasLibros } from "../hooks/categorias/useCategorias";
import { useCrearCategoriaLibro } from "../hooks/categorias/useCrearCategoria";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorText } from "../components/ui/ErrorText";
import { Spinner } from "../components/ui/Spinner";

export function CategoriaPage() {
  const { categorias, loading: cargandoLista, error: errorLista, recargar } = useCategoriasLibros();
  const { crear, loading: creando, errores, errorApi } = useCrearCategoriaLibro();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
  });

  const handleChange = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await crear(form);
    if (resultado.success) {
      setForm({ nombre: "", descripcion: ""});
      recargar();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Categorias</h1>

      {/* Formulario de creación */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8 p-4 border rounded-lg">
        <Input
          id="nombre"
          label="Nombre"
          value={form.nombre}
          onChange={handleChange("nombre")}
          error={errores?.nombre}
        />
        <Input
            id="descripcion"
            label="descrpcion"
            value={form.descripcion}
            onChange={handleChange("descripcion")}
            error={errores?.descripcion}
        />
        <ErrorText>{errorApi}</ErrorText>

        <Button type="submit" loading={creando}>
          Crear categoria
        </Button>
      </form>

      {/* Lista de usuarios */}
      <h2 className="text-xl font-semibold mb-4">Lista de categorias</h2>

      {cargandoLista && <Spinner />}
      {errorLista && <ErrorText>{errorLista}</ErrorText>}

      {!cargandoLista && !errorLista && (
        <ul className="flex flex-col gap-2">
          {categorias.map((u) => (
            <li key={u.id} className="p-3 border rounded-lg flex justify-between">
              <span>{u.nombre}</span>
              <span className="text-sm text-gray-500">{u.descripcion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}