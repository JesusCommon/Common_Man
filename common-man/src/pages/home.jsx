// pages/HomePage.jsx

export function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-6">
      <div className="rounded-xl bg-white p-10 shadow-lg text-center max-w-xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ¡Bienvenido a la página!
        </h1>

        <p className="text-gray-600 text-lg">
          Este es el inicio de la aplicación. Desde aquí podrás acceder a las
          diferentes funcionalidades cuando estén disponibles.
        </p>
      </div>
    </div>
  );
}