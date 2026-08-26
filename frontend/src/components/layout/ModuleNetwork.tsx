import { motion } from "framer-motion";

const nodes = [
  { id: "usuarios", label: "Usuarios", x: 200, y: 200, r: 34, primary: true },
  { id: "follow", label: "Follow", x: 90, y: 110, r: 24 },
  { id: "categorias", label: "Categorías", x: 320, y: 100, r: 24 },
  { id: "productos", label: "Productos", x: 300, y: 320, r: 24 },
  { id: "mas", label: "+", x: 80, y: 300, r: 18 },
];

const edges = [
  { from: "usuarios", to: "follow" },
  { from: "usuarios", to: "categorias" },
  { from: "usuarios", to: "productos" },
  { from: "usuarios", to: "mas" },
];

const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

export function ModuleNetwork() {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="w-full h-full max-w-112.5 mx-auto">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
        role="img"
        aria-label="Diagrama animado de los módulos conectados del sistema: Usuarios, Follow, Categorías y Productos"
      >
        {/* Líneas de conexión */}
        {edges.map((edge, i) => {
          const from = nodeById[edge.from];
          const to = nodeById[edge.to];
          return (
            <motion.line
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#D4D4CE"
              strokeWidth={1.5}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.4 + i * 0.15, ease: "easeOut" }}
            />
          );
        })}

        {/* Pulso viajando por cada línea */}
        {!prefersReducedMotion &&
          edges.map((edge, i) => {
            const from = nodeById[edge.from];
            const to = nodeById[edge.to];
            return (
              <motion.circle
                key={`pulse-${edge.from}-${edge.to}`}
                // CORRECCIÓN: Se definen explícitamente cx y cy como atributos base
                cx={from.x}
                cy={from.y}
                r={3}
                fill="#2563EB"
                // CORRECCIÓN: Se incluyen en el estado initial para evitar el "undefined"
                initial={{ opacity: 0, cx: from.x, cy: from.y }}
                animate={{
                  cx: [from.x, to.x],
                  cy: [from.y, to.y],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 2.2,
                  delay: 1.6 + i * 0.5,
                  repeat: Infinity,
                  repeatDelay: 3 + i * 0.8,
                  ease: "easeInOut",
                }}
              />
            );
          })}

        {/* Nodos */}
        {nodes.map((node, i) => (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r={node.r}
              fill={node.primary ? "#18181B" : "#FFFFFF"}
              stroke={node.primary ? "#18181B" : "#E4E4E1"}
              strokeWidth={1.5}
            />
            {!prefersReducedMotion && (
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill="none"
                stroke={node.primary ? "#18181B" : "#2563EB"}
                strokeWidth={1}
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 1.4 }}
                transition={{
                  duration: 2,
                  delay: 1.2 + i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: "easeOut",
                }}
              />
            )}
            <text
              x={node.x}
              y={node.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={node.primary ? 12 : node.id === "mas" ? 16 : 10.5}
              fontWeight={500}
              fill={node.primary ? "#FAFAF8" : "#18181B"}
              fontFamily="Inter, sans-serif"
            >
              {node.label}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}