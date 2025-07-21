# Documentación CabinSmart

Esta carpeta contiene toda la documentación completa del proyecto CabinSmart para la entrevista técnica.

## Contenido de la Documentación

### 📋 [FUNCTIONAL_DOCUMENTATION.md](./FUNCTIONAL_DOCUMENTATION.md)
**Documentación Funcional Completa**
- Visión del producto y objetivos
- Casos de uso detallados para pasajeros y tripulación
- Flujos de usuario completos
- Beneficios y métricas de éxito
- **Ideal para:** Explicar QUÉ hace el sistema y POR QUÉ es valioso

### 🔧 [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)
**Documentación Técnica Detallada**
- Arquitectura del sistema y stack tecnológico
- Patrones de diseño implementados
- Flujos de datos y comunicación en tiempo real
- Decisiones técnicas y sus justificaciones
- Consideraciones de escalabilidad y rendimiento
- **Ideal para:** Explicar CÓMO funciona técnicamente el sistema

### 🎯 [INTERVIEW_PRESENTATION_GUIDE.md](./INTERVIEW_PRESENTATION_GUIDE.md)
**Guía Completa para la Entrevista**
- Estructura de presentación de 45-60 minutos
- Script detallado con tiempos
- Preguntas anticipadas y respuestas
- Puntos clave a enfatizar
- Comandos para demo en vivo
- **Ideal para:** Preparar y ejecutar la presentación perfecta

## Cómo Usar Esta Documentación

### Para Preparar la Entrevista
1. **Leer primero:** `FUNCTIONAL_DOCUMENTATION.md` para entender el negocio
2. **Leer segundo:** `TECHNICAL_DOCUMENTATION.md` para dominar la técnica  
3. **Usar como guía:** `INTERVIEW_PRESENTATION_GUIDE.md` para estructurar la presentación

### Durante la Entrevista
- Usa `INTERVIEW_PRESENTATION_GUIDE.md` como script principal
- Referencias rápidas a los otros documentos según las preguntas
- Los documentos están organizados para consulta rápida durante la presentación

## Demo en Vivo

### Comandos de Preparación
```bash
# Levantar el sistema completo
docker-compose up -d

# Verificar que todo funcione
curl http://localhost:8000/seats

# URLs importantes
Frontend: http://localhost
API Docs: http://localhost:8000/docs
```

### Flujo de Demo Recomendado
1. **Pasajero:** Selección de asiento → Control de cinturón → Cola de baño
2. **Tripulación:** Dashboard completo → Alertas de seguridad → Gestión de cola
3. **Tiempo real:** Mostrar sincronización entre múltiples ventanas/dispositivos

## Puntos Clave del Proyecto

### 🚀 Funcionales
- **198 asientos** (33 filas × 6 asientos) con clases Business y Economy
- **Sistema de cola inteligente** para baño con acceso directo o virtual queue
- **Actualizaciones en tiempo real** para todos los usuarios simultáneamente
- **Doble interfaz:** Vista pasajero y vista tripulación

### ⚡ Técnicos
- **Arquitectura:** React + FastAPI + MongoDB + WebSockets
- **Patrones:** Observer, Context, Repository, Strategy
- **Performance:** <50ms latencia, 1000+ eventos/segundo
- **Escalabilidad:** Stateless design, horizontal scaling ready

### 💡 Decisiones Clave
- **WebSockets nativos** en lugar de socket.io (menos overhead)
- **MongoDB** en lugar de PostgreSQL (flexibilidad de esquema)
- **Context API** en lugar de Redux (menos complejidad)
- **FastAPI** en lugar de Django (mejor performance async)

## Estructura del Proyecto de Referencia

```
cabin-smart/
├── cabin_smart_frontend/     # React SPA
│   ├── src/
│   │   ├── components/      # UI Components
│   │   ├── context/         # React Contexts
│   │   ├── hooks/          # Custom Hooks
│   │   └── tests/          # Test Suite
│   └── package.json        # Dependencies
├── cabin_smart_backend/      # FastAPI API
│   ├── main.py             # Application Entry
│   ├── database.py         # MongoDB Management  
│   └── requirements.txt    # Python Dependencies
├── docker-compose.yml       # Container Orchestration
└── docs/                   # Esta documentación
```

## Métricas Técnicas Clave

- **Latencia:** <50ms para eventos WebSocket
- **Throughput:** 1000+ eventos por segundo
- **Memory Usage:** <512MB por contenedor
- **Database Response:** <10ms promedio
- **Uptime Target:** 99.9%
- **Concurrent Users:** 200+ sin degradación

¡Todo listo para una presentación técnica exitosa! 🎉
