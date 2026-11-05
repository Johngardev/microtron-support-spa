# Documentación de Integración API Backend - Gestión de Sesiones con Calendly

## Resumen General

Se ha implementado una arquitectura completa para gestionar sesiones de soporte técnico con integración con Calendly. El sistema incluye:

- **Backend (NestJS)**: API REST con gestión de sesiones, autenticación JWT y integración con Calendly
- **Frontend (Angular)**: Interfaz moderna con Material Design y gestión de sesiones en tiempo real
- **Base de datos**: MongoDB en Cosmos DB de Azure
- **Integración Calendly**: Gestión de eventos de calendario

---

## Arquitectura Backend

### 1. Módulo de Sesiones (`src/sessions/`)

#### Estructura de Archivos
```
src/sessions/
├── sessions.module.ts          # Módulo principal
├── sessions.controller.ts       # Controlador de rutas
├── sessions.service.ts          # Lógica de negocio
├── dto/
│   ├── create-session.dto.ts    # DTO para crear sesiones
│   ├── update-session.dto.ts    # DTO para actualizar sesiones
│   └── calendly-event.dto.ts    # DTO para eventos de Calendly
└── schemas/
    └── session.schema.ts        # Schema de Mongoose
```

#### Schema de Session
```typescript
{
  id: string;                     // ID único (S-XXXXX)
  manufacturerKey: string;        // Clave del fabricante
  manufacturerName: string;       // Nombre del fabricante
  title: string;                  // Título de la sesión
  description?: string;           // Descripción
  admin: string;                  // Email del administrador
  emails: string[];               // Emails de participantes
  requestDate: Date;              // Fecha de solicitud
  scheduledDate: Date;            // Fecha programada
  status: 'Abierto' | 'Cerrado';  // Estado de la sesión
  calendlyEventUri?: string;      // URI del evento en Calendly
  calendlyInviteeUri?: string;    // URI del invitado en Calendly
  createdAt: Date;                // Fecha de creación
  updatedAt: Date;                // Fecha de actualización
}
```

### 2. Endpoints de la API

#### Gestión de Sesiones

**Crear una sesión**
```
POST /sessions
Content-Type: application/json

{
  "manufacturerKey": "adobe",
  "manufacturerName": "Adobe",
  "title": "Adobe Photoshop Training",
  "description": "Sesión de entrenamiento avanzado",
  "admin": "john@example.com",
  "emails": ["user1@example.com", "user2@example.com"],
  "requestDate": "2025-11-25T10:00:00Z",
  "scheduledDate": "2025-12-01T14:00:00Z"
}

Response: 201 Created
{
  "id": "S-a1b2c3d4",
  "manufacturerKey": "adobe",
  "manufacturerName": "Adobe",
  ... (datos completos)
}
```

**Obtener todas las sesiones**
```
GET /sessions

Optional query parameters:
- status=Abierto|Cerrado

Response: 200 OK
[
  { session1 },
  { session2 },
  ...
]
```

**Obtener estadísticas de sesiones**
```
GET /sessions/stats

Response: 200 OK
{
  "total": 10,
  "open": 6,
  "closed": 4
}
```

**Obtener una sesión por ID**
```
GET /sessions/{id}

Response: 200 OK
{ session data }
```

**Actualizar una sesión**
```
PATCH /sessions/{id}
Content-Type: application/json

{
  "title": "Nuevo título",
  "status": "Cerrado",
  ...
}

Response: 200 OK
{ updated session data }
```

**Eliminar una sesión**
```
DELETE /sessions/{id}

Response: 204 No Content
```

#### Integración con Calendly

**Crear evento en Calendly**
```
POST /sessions/{id}/calendly-event
Content-Type: application/json

{
  "eventTypeUri": "https://api.calendly.com/event_types/...",
  "inviteeEmail": "user@example.com",
  "inviteeName": "John Doe"
}

Response: 201 Created
{
  "eventUri": "https://api.calendly.com/scheduled_events/...",
  "inviteeUri": "https://api.calendly.com/invitees/..."
}
```

**Cancelar evento en Calendly**
```
DELETE /sessions/{id}/calendly-event

Response: 204 No Content
```

**Obtener detalles del evento en Calendly**
```
GET /sessions/{id}/calendly-event/details?eventUri={eventUri}

Response: 200 OK
{ event details from Calendly }
```

---

## Configuración del Backend

### Variables de Entorno (.env)
```
COSMOS_MONGO_CONN=mongodb://your-connection-string
DATABASE_NAME=support
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
CALENDLY_TOKEN=your-calendly-api-token
```

### Instalación de Dependencias
```bash
# Instalar UUID para generar IDs únicos
npm install uuid
npm install --save-dev @types/uuid
```

### Integración en app.module.ts
```typescript
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    // ... otros módulos
    SessionsModule,
  ],
})
export class AppModule {}
```

---

## Arquitectura Frontend

### 1. Servicio de Sesiones (`core/services/session.service.ts`)

El servicio actúa como capa de abstracción entre componentes e API backend.

```typescript
// Métodos principales
getAllSessions(): Observable<Session[]>
getSessionById(id: string): Observable<Session>
getSessions(status: SessionStatus): Observable<Session[]>
getSessionStats(): Observable<{total: number; open: number; closed: number}>
createSession(session: Omit<Session, 'id'>): Observable<Session>
updateSession(id: string, updates: Partial<Session>): Observable<Session>
deleteSession(id: string): Observable<void>
createCalendlyEvent(...): Observable<{eventUri: string; inviteeUri: string}>
cancelCalendlyEvent(sessionId: string): Observable<void>
getCalendlyEventDetails(sessionId: string, eventUri: string): Observable<any>
```

### 2. Componentes

#### SessionsComponent (Dashboard)
- Ubicación: `features/dashboard/components/sessions/`
- Responsabilidades:
  - Listar sesiones por estado
  - Filtrar y buscar sesiones
  - Mostrar estadísticas
  - Abrir diálogo para crear nuevas sesiones

#### AdminSessionsComponent (Admin Dashboard)
- Ubicación: `features/admin-dashboard/components/admin-sessions/`
- Responsabilidades:
  - Gestión completa de sesiones
  - Filtrado avanzado
  - Administración de usuarios

#### CreateSessionComponent (Modal)
- Ubicación: `shared/create-session/`
- Responsabilidades:
  - Formulario para crear sesiones
  - Integración con Calendly
  - Validación de datos
  - Comunicación con API backend

### 3. Modelo de Datos

```typescript
interface Session {
  id: string;
  manufacturer: Manufacturer;
  title: string;
  description?: string;
  admin: string;
  emails: string[];
  requestDate: Date;
  scheduledDate: Date;
  status: 'Abierto' | 'Cerrado';
}

interface Manufacturer {
  key: string;
  name: string;
  topics: HelpTopic[];
}
```

---

## Flujo de Integración Calendly

### 1. Frontend (CreateSessionComponent)

```
User completa formulario
    ↓
Click en "Seleccionar Fecha y Hora"
    ↓
Script Calendly se abre (popup)
    ↓
User selecciona fecha/hora en Calendly
    ↓
Calendly envía mensaje postMessage
    ↓
HostListener captura evento 'calendly.event_scheduled'
    ↓
Formulario se actualiza con eventUri y fecha
    ↓
User hace click en "Confirmar Sesión"
    ↓
Se envía petición POST al backend
```

### 2. Backend (SessionsService)

```
POST /sessions/{id}/calendly-event recibida
    ↓
Validar datos
    ↓
Realizar llamada HTTP a API Calendly
    ↓
Si éxito: guardar eventUri en DB
    ↓
Retornar eventUri al frontend
```

### 3. Configuración de Calendly

Para que la integración funcione, necesitas:

1. **Token de API**: Obtener en https://calendly.com/integrations/api_webhooks
2. **Event Type URI**: Obtener del calendario específico
3. **Preguntas personalizadas** en el evento:
   - `a1`: Descripción
   - `a2`: Fabricante
   - `a3`: Título

---

## Manejo de Errores

### Backend
- Validación de DTOs con `class-validator`
- Manejo de excepciones HTTP
- Logging de errores
- Respuestas consistentes

### Frontend
- Interceptor de errores HTTP
- Notificaciones al usuario
- Manejo de loading states
- Unsubscribe automático (takeUntil)

---

## Mejores Prácticas Implementadas

### Backend
✅ Separación de responsabilidades (DTOs, Services, Controllers)
✅ Validación de entrada con decoradores
✅ Manejo de errores robusto
✅ Integración con API externa (Calendly)
✅ Modularidad con @Module

### Frontend
✅ Componentes standalone
✅ Gestión reactiva con RxJS
✅ Unsubscribe automático
✅ Material Design
✅ Formularios reactivos
✅ Tipado fuerte (TypeScript)

---

## Variables de Entorno Necesarias

### Backend
```env
# Cosmos DB MongoDB
COSMOS_MONGO_CONN=mongodb://...

# JWT
JWT_SECRET=<tu-secreto-jwt>
JWT_EXPIRES_IN=24h

# Calendly
CALENDLY_TOKEN=<tu-token-api-calendly>
```

### Frontend
```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};
```

---

## Instrucciones de Ejecución

### Backend
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run start:dev

# Construir para producción
npm run build

# Ejecutar en producción
npm run start:prod
```

### Frontend
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Construir para producción
npm run build
```

---

## Testing

### Backend
```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar tests e2e
npm run test:e2e
```

---

## Próximos Pasos

1. ✅ Implementar autenticación en rutas de sesiones
2. ✅ Agregar guards para roles (admin, user)
3. ✅ Implementar paginación en listados
4. ✅ Agregar webhooks de Calendly para sincronización
5. ✅ Implementar notificaciones por email
6. ✅ Agregar endpoint para exportar sesiones a CSV
7. ✅ Implementar búsqueda avanzada
8. ✅ Agregar métricas y reportes

---

## Solución de Problemas

### Error de conexión a Calendly
- Verificar que el token API sea válido
- Verificar permisos en Calendly
- Revisar logs del backend

### Sesiones no aparecen en el frontend
- Verificar que el backend esté corriendo en `http://localhost:3000`
- Revisar console del navegador para errores HTTP
- Verificar conectividad a MongoDB

### Calendly popup no funciona
- Incluir script de Calendly en `index.html`
- Verificar que la URL del evento sea correcta
- Revisar permisos CORS

---

## Contacto y Soporte

Para más información o problemas, contacta al equipo de desarrollo.
