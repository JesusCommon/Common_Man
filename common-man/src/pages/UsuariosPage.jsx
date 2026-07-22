// pages/UsuariosPage.jsx
import { useState } from "react";
import { useUsuarios } from "../hooks/usuarios/useUsuarios";
import { useCrearUsuario } from "../hooks/usuarios/useCrearUsuario";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ErrorText } from "../components/ui/ErrorText";
import { Spinner } from "../components/ui/Spinner";

export function UsuariosPage() {
  const { usuarios, loading: cargandoLista, error: errorLista, recargar } = useUsuarios();
  const { crear, loading: creando, errores, errorApi } = useCrearUsuario();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    username: "",
    correo: "",
    password: "",
  });

  const handleChange = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultado = await crear(form);
    if (resultado.success) {
      setForm({ nombre: "", apellido: "", username: "", correo: "", password: "" });
      recargar();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Usuarios</h1>

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
            id="apellido"
            label="apellido"
            value={form.apellido}
            onChange={handleChange("apellido")}
            error={errores?.apellido}
        />
        <Input
          id="username"
          label="Username"
          value={form.username}
          onChange={handleChange("username")}
          error={errores?.username}
        />
        <Input
          id="correo"
          label="Correo"
          type="email"
          value={form.correo}
          onChange={handleChange("correo")}
          error={errores?.correo}
        />
        <Input
          id="password"
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
          error={errores?.password}
        />

        <ErrorText>{errorApi}</ErrorText>

        <Button type="submit" loading={creando}>
          Crear usuario
        </Button>
      </form>

      {/* Lista de usuarios */}
      <h2 className="text-xl font-semibold mb-4">Lista de usuarios</h2>

      {cargandoLista && <Spinner />}
      {errorLista && <ErrorText>{errorLista}</ErrorText>}

      {!cargandoLista && !errorLista && (
        <ul className="flex flex-col gap-2">
          {usuarios.map((u) => (
            <li key={u.id} className="p-3 border rounded-lg flex justify-between">
              <span>{u.nombre} {u.apellido} (@{u.username})</span>
              <span className="text-sm text-gray-500">{u.correo}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}