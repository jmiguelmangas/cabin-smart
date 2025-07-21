# CabinSmart - Documentación Funcional

## Visión General del Producto

CabinSmart es una plataforma digital innovadora diseñada para revolucionar la gestión de cabinas de avión mediante tecnología en tiempo real. Permite a pasajeros y tripulación interactuar de manera inteligente con los sistemas de la cabina, mejorando la seguridad, eficiencia y experiencia del vuelo.

## Propósito y Objetivos

### Objetivo Principal
Proporcionar una solución integral para la monitorización y gestión en tiempo real de todos los aspectos críticos de una cabina de avión, incluyendo asientos, cinturones de seguridad y sistemas de baño.

### Objetivos Específicos
- **Mejorar la seguridad** mediante monitoreo automático de cinturones
- **Optimizar el uso del baño** con un sistema inteligente de colas
- **Reducir la carga de trabajo** de la tripulación
- **Mejorar la experiencia** del pasajero
- **Proporcionar datos en tiempo real** para toma de decisiones

## Usuarios Objetivo

### 1. Pasajeros
- Viajeros frecuentes y ocasionales
- Todas las edades y niveles de tecnología
- Usuarios de clase business y economy

### 2. Tripulación de Cabina
- Auxiliares de vuelo
- Jefe de cabina
- Personal de seguridad

### 3. Supervisores de Vuelo
- Personal de tierra
- Controladores de operaciones
- Gerentes de vuelo

## Casos de Uso Principales

### Para Pasajeros

#### 1. Selección y Gestión de Asiento
**Descripción:** El pasajero puede seleccionar su asiento y gestionar su estado personal.

**Flujo:**
1. El pasajero accede a la aplicación
2. Visualiza el plano de la cabina en tiempo real
3. Selecciona su asiento asignado
4. Puede ver el estado actual (ocupado, libre, clase)
5. Actualiza su información personal

**Beneficios:**
- Localización rápida del asiento
- Información clara del estado de la cabina
- Personalización de la experiencia

#### 2. Control de Cinturón de Seguridad
**Descripción:** El pasajero puede marcar el estado de su cinturón de seguridad.

**Flujo:**
1. Una vez seleccionado el asiento
2. Usa el botón de cinturón en la interfaz
3. El sistema actualiza el estado en tiempo real
4. La tripulación recibe la información inmediatamente
5. Se muestra confirmación visual al pasajero

**Beneficios:**
- Cumplimiento proactivo de normas de seguridad
- Reducción de interrupciones por parte de la tripulación
- Tranquilidad para pasajeros conscientes de seguridad

#### 3. Gestión de Cola de Baño
**Descripción:** El pasajero puede unirse a una cola virtual para usar el baño.

**Flujo:**
1. El pasajero solicita usar el baño
2. Si está libre: acceso directo con notificación
3. Si está ocupado: se añade automáticamente a la cola
4. Recibe actualizaciones de su posición en tiempo real
5. Obtiene notificación cuando sea su turno
6. Puede salir de la cola en cualquier momento

**Beneficios:**
- Eliminación de colas físicas en pasillos
- Mejor planificación del tiempo
- Reducción de ansiedad por esperas
- Mayor comodidad durante el vuelo

### Para Tripulación

#### 1. Dashboard de Monitoreo General
**Descripción:** Vista completa del estado de toda la cabina en tiempo real.

**Funcionalidades:**
- **Estado de todos los asientos:** ocupación, clase, pasajero
- **Monitoreo de cinturones:** cuántos están abrochados/desabrochados
- **Gestión de cola de baño:** quién está esperando, tiempo estimado
- **Alertas automáticas:** para situaciones que requieren atención
- **Estadísticas en tiempo real:** usuarios conectados, actividad general

**Beneficios:**
- Visión global instantánea
- Identificación rápida de problemas
- Mejor planificación de tareas
- Respuesta proactiva a necesidades

#### 2. Gestión de Seguridad
**Descripción:** Herramientas específicas para garantizar el cumplimiento de normas de seguridad.

**Funcionalidades:**
- **Lista de cinturones desabrochados:** con ubicaciones específicas
- **Alertas de pasajeros fuera de asiento:** durante períodos críticos
- **Herramientas de comunicación:** para recordatorios dirigidos
- **Reportes de cumplimiento:** para documentación

**Beneficios:**
- Cumplimiento eficiente de regulaciones
- Reducción de tiempo en verificaciones manuales
- Mejor documentación de seguridad
- Respuesta rápida en emergencias

#### 3. Optimización de Servicios
**Descripción:** Herramientas para mejorar la eficiencia del servicio de cabina.

**Funcionalidades:**
- **Gestión inteligente de cola de baño:** tiempos de espera, patrones de uso
- **Identificación de necesidades:** pasajeros que pueden requerir asistencia
- **Planificación de servicios:** basada en patrones de actividad
- **Comunicación dirigida:** mensajes a asientos específicos

**Beneficios:**
- Mejor distribución de carga de trabajo
- Servicio más personalizado
- Anticipación de necesidades
- Mayor satisfacción del pasajero

## Funcionalidades Detalladas

### 1. Sistema de Asientos Inteligente

#### Configuración de Cabina
- **198 asientos totales** (33 filas × 6 asientos)
- **Clase Business:** Filas 1-8 (48 asientos)
- **Clase Economy:** Filas 9-33 (150 asientos)
- **Nomenclatura:** 1A, 1B, 1C, 1D, 1E, 1F, etc.

#### Estados de Asiento
- **Ocupado/Libre:** Estado de ocupación
- **Cinturón abrochado/desabrochado:** Estado de seguridad
- **En asiento/Fuera del asiento:** Ubicación del pasajero
- **Información del pasajero:** Nombre asignado

#### Visualización
- **Mapa interactivo:** Representación gráfica de la cabina
- **Códigos de color:** Verde (todo OK), Rojo (atención requerida), Amarillo (alerta)
- **Información contextual:** Detalles al pasar el mouse o tocar
- **Filtros:** Por clase, estado, problemas

### 2. Sistema de Cola de Baño Inteligente

#### Lógica de Cola
- **Detección automática:** Si el baño está libre u ocupado
- **Acceso directo:** Notificación inmediata si está disponible
- **Cola virtual:** Posicionamiento automático por orden de llegada
- **Estimaciones de tiempo:** Basadas en patrones históricos

#### Notificaciones
- **Push en tiempo real:** Cuando sea tu turno
- **Actualizaciones de posición:** Cambios en la cola
- **Tiempos estimados:** Cuánto tiempo falta
- **Opciones de cancelación:** Salir de la cola fácilmente

#### Gestión por Tripulación
- **Vista de cola completa:** Todos los pasajeros esperando
- **Gestión manual:** Capacidad de reordenar si es necesario
- **Estadísticas de uso:** Patrones y tiempos promedio
- **Alertas de congestión:** Si la cola es muy larga

### 3. Sistema de Comunicación en Tiempo Real

#### Sincronización Instantánea
- **Actualizaciones inmediatas:** Cualquier cambio se refleja en todos los dispositivos
- **Estado consistente:** Todos ven la misma información
- **Recuperación automática:** Reconexión tras interrupciones
- **Cache inteligente:** Mantiene estado durante desconexiones breves

#### Tipos de Eventos
- **Cambios de asiento:** Ocupación, cinturón, ubicación
- **Actualizaciones de cola:** Nuevos miembros, cambios de posición
- **Alertas de seguridad:** Cinturones desabrochados, pasajeros fuera de lugar
- **Notificaciones de servicio:** Baño disponible, mensajes importantes

## Beneficios del Sistema

### Para Pasajeros
- **Mayor comodidad:** Eliminación de colas físicas
- **Mejor información:** Estado en tiempo real de servicios
- **Participación activa:** Control sobre su experiencia de vuelo
- **Reducción de estrés:** Información clara y oportuna

### Para Tripulación
- **Eficiencia operativa:** Menos interrupciones y verificaciones manuales
- **Mejor servicio:** Información instantánea para atención personalizada
- **Cumplimiento de seguridad:** Monitoreo automático y alertas
- **Reducción de carga de trabajo:** Automatización de tareas rutinarias

### Para Aerolínea
- **Mejora en satisfacción del cliente:** Experiencia de vuelo superior
- **Optimización de recursos:** Mejor gestión de tiempo de tripulación
- **Cumplimiento regulatorio:** Documentación automática de seguridad
- **Datos valiosos:** Analytics de comportamiento y patrones de uso

## Flujos de Usuario Completos

### Flujo del Pasajero: Experiencia Completa de Vuelo

1. **Embarque**
   - Accede a la aplicación via QR o enlace
   - Selecciona su asiento asignado
   - Confirma su nombre o lo actualiza

2. **Despegue**
   - Abrocha el cinturón
   - Marca el estado en la aplicación
   - Recibe confirmación visual

3. **Durante el vuelo**
   - Decide usar el baño
   - Verifica disponibilidad en la app
   - Se une a cola virtual si es necesario
   - Recibe notificación cuando sea su turno

4. **Aterrizaje**
   - Abrocha el cinturón para aterrizaje
   - La tripulación puede verificar cumplimiento instantáneamente

### Flujo de Tripulación: Gestión Eficiente

1. **Pre-vuelo**
   - Accede al dashboard de tripulación
   - Verifica configuración de cabina
   - Revisa lista de pasajeros

2. **Embarque**
   - Monitorea ocupación de asientos en tiempo real
   - Identifica pasajeros que no han seleccionado asiento
   - Asiste según necesidades identificadas

3. **Despegue**
   - Verifica que todos los cinturones estén abrochados
   - Identifica rápidamente incumplimientos
   - Realiza verificaciones dirigidas en lugar de generales

4. **Crucero**
   - Monitorea actividad de baño
   - Gestiona cola si es necesario
   - Atiende alertas específicas

5. **Aterrizaje**
   - Verifica cumplimiento de cinturones
   - Confirma que pasajeros están en sus asientos

## Métricas de Éxito

### KPIs de Experiencia del Usuario
- **Tiempo de respuesta:** < 2 segundos para cualquier acción
- **Disponibilidad del sistema:** 99.9% uptime
- **Adopción:** > 80% de pasajeros usan el sistema
- **Satisfacción:** Score > 4.5/5 en encuestas

### KPIs Operativos
- **Reducción de tiempo de verificación:** 60% menos tiempo en checks de cinturón
- **Eficiencia de baño:** 40% reducción en tiempo de espera promedio
- **Cumplimiento de seguridad:** 99% de cumplimiento documentado
- **Productividad de tripulación:** 30% más tiempo para servicio al cliente

### KPIs de Negocio
- **Satisfacción del pasajero:** Incremento del 25% en scores NPS
- **Eficiencia operativa:** Reducción del 20% en quejas relacionadas con servicio
- **Cumplimiento regulatorio:** 100% de documentación automática
- **ROI del sistema:** Payback en 18 meses

Este sistema representa una evolución significativa en la gestión de cabinas de avión, combinando tecnología avanzada con necesidades reales de usuarios para crear una experiencia superior de vuelo.
