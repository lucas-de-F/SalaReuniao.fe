import { type RouteConfig, index, route, layout, prefix } from "@react-router/dev/routes";

export default [
  // rota pública

  // rotas protegidas
  layout("layouts/protected.tsx", [
    layout("layouts/AppLayout.tsx", [
    route("salas-de-reuniao", "routes/salas-de-reuniao.tsx"),
    route("reservar-sala/:id", "routes/reservar-sala.$id.tsx"),
    route("minhas-reservas", "routes/minhas-reservas.tsx"),
    
    route("minhas-salas", "routes/minhas-salas.tsx"),
    route("minhas-salas/editar/:id", "routes/sala-de-reuniao.$id.tsx"),
    route("minhas-salas/criar", "routes/sala-de-reuniao-criar.tsx"),
    ]),
  ]),

  // página inicial
  layout("layouts/noAuth.tsx", [
      index("routes/login.tsx"),
  ]),
] satisfies RouteConfig;
