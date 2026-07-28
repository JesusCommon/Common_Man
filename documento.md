Posible estructura del proyecto:

src/
│
├── api/
│   ├── client/
│   │   ├── axios.ts
│   │   ├── fetchClient.ts
│   │   └── interceptors.ts
│   │
│   ├── endpoints/
│   │   ├── auth.ts
│   │   ├── usuarios.ts
│   │   ├── productos.ts
│   │   ├── pedidos.ts
│   │   └── index.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── usuarios.service.ts
│   │   ├── productos.service.ts
│   │   └── pedidos.service.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── usuario.ts
│   │   ├── producto.ts
│   │   └── api.ts
│   │
│   ├── hooks/
│   │   ├── useUsuarios.ts
│   │   ├── useProductos.ts
│   │   └── useAuth.ts
│   │
│   └── index.ts
│
├── components/
├── pages/
├── layouts/
├── routes/
├── contexts/
├── store/
├── utils/
├── constants/
├── assets/
├── styles/
├── App.tsx
└── main.tsx