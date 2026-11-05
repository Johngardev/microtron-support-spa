# Guía de Configuración de Calendly

## Pasos para integrar Calendly con el sistema

### 1. Registrarse en Calendly

1. Ir a https://calendly.com
2. Crear una cuenta o iniciar sesión
3. Ir a "Settings" → "API & Webhooks"

### 2. Generar Token de API

1. En el dashboard de Calendly, ir a **Integrations** → **API & Webhooks**
2. En la sección "Personal Access Token", hacer clic en "Generate"
3. Copiar el token generado
4. **NUNCA compartir este token públicamente**

### 3. Configurar el Evento en Calendly

1. Crear un nuevo evento o usar uno existente
2. Ir a **Event Settings**
3. En **Invitee Questions**, añadir las siguientes preguntas personalizadas:

#### Preguntas Recomendadas:

**Pregunta 1 (a1):**
- Label: "Descripción de la sesión"
- Type: "Short Text"
- Required: Sí

**Pregunta 2 (a2):**
- Label: "Fabricante"
- Type: "Single Choice"
- Options: Adobe, Anydesk, Autodesk, Claris, Corel, GraphiSoft, Kaspersky, Microsoft, Panopto, SketchUp, Starlab

**Pregunta 3 (a3):**
- Label: "Título del tema"
- Type: "Short Text"
- Required: Sí

### 4. Obtener Event Type URI

1. En el dashboard de Calendly, ir al evento configurado
2. La URL será similar a: `https://calendly.com/tu-usuario/nombre-evento`
3. Para obtener el URI, hacer una llamada GET a:
   ```
   GET https://api.calendly.com/event_types
   Authorization: Bearer {TU_TOKEN}
   ```
4. El response incluirá el `uri` del evento tipo

### 5. Configurar en el Proyecto

#### Backend (.env)
```env
CALENDLY_TOKEN=<tu-token-api-aquí>
```

#### Frontend (package.json scripts)
Si usas webhooks, configurar el endpoint:
```json
{
  "calendlyWebhookUrl": "https://tu-api.com/webhooks/calendly"
}
```

#### Incluir Script de Calendly (index.html)
```html
<script src="https://assets.calendly.com/assets/external/widget.js"></script>
```

### 6. Flujo de Integración

```
Usuario completa formulario
    ↓
Click en "Seleccionar Fecha y Hora"
    ↓
Script Calendly abre popup
    ↓
Usuario selecciona fecha/hora
    ↓
Calendly envia 'calendly.event_scheduled' via postMessage
    ↓
Frontend captura evento
    ↓
Frontend envia POST /sessions/{id}/calendly-event al backend
    ↓
Backend crea evento en Calendly
    ↓
Backend guarda eventUri en BD
    ↓
Frontend notifica éxito al usuario
```

### 7. Estructura de Datos de Calendly

#### Event Scheduled Payload
```json
{
  "event": "calendly.event_scheduled",
  "payload": {
    "event": {
      "uri": "https://api.calendly.com/scheduled_events/123456",
      "name": "Meeting with John Doe",
      "status": "active",
      "start_time": "2025-12-01T14:00:00Z",
      "end_time": "2025-12-01T15:00:00Z",
      "event_type": {
        "uri": "https://api.calendly.com/event_types/123"
      },
      "location": {
        "type": "physical_location",
        "location": "Meeting Room 1"
      },
      "invitees": [
        {
          "uri": "https://api.calendly.com/invitees/123",
          "email": "user@example.com",
          "name": "John Doe",
          "status": "active",
          "timezone": "America/New_York"
        }
      ]
    },
    "invitee": {
      "uri": "https://api.calendly.com/invitees/123",
      "email": "user@example.com",
      "name": "John Doe",
      "status": "active",
      "timezone": "America/New_York"
    }
  }
}
```

### 8. Errores Comunes y Soluciones

#### Error: "Invalid token"
- Verificar que el token sea válido
- Regenerar el token si es necesario
- Verificar que no contenga espacios

#### Error: "Event not found"
- Verificar que el event_type_uri sea correcto
- Usar endpoint `/event_types` para obtener el URI correcto

#### Error: "CORS error"
- Asegurar que Calendly permite llamadas desde tu dominio
- Configurar CORS en el backend

#### Error: "Message not received from Calendly"
- Verificar que el script de Calendly esté incluido
- Verificar que el origin sea exactamente `https://calendly.com`

### 9. Testing de la Integración

#### Con cURL
```bash
# Obtener event types
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.calendly.com/event_types

# Crear scheduled event
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "https://api.calendly.com/event_types/123",
    "invitee": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  }' \
  https://api.calendly.com/scheduled_events
```

### 10. Webhooks (Opcional)

Para sincronización en tiempo real:

1. En Calendly → Settings → Webhooks
2. Crear nuevo webhook
3. URL: `https://tu-api.com/webhooks/calendly`
4. Eventos: `invitee.created`, `invitee.cancelled`, `event_type.created`

### 11. Referencias

- [Documentación API Calendly](https://developer.calendly.com/api-docs)
- [Calendly Embed Widget](https://calendly.com/help/embed)
- [Webhooks Calendly](https://developer.calendly.com/webhooks)

### 12. Seguridad

✅ Nunca exponer el token en el cliente
✅ Validar solicitudes de webhooks
✅ Usar HTTPS en producción
✅ Rotar tokens regularmente
✅ Limitar permisos del token al mínimo necesario
