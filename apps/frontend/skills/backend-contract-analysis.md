# Backend Contract Analysis Skill

## Objetivo

- Analizar y documentar el contrato real del backend consumido por el frontend.
- Identificar endpoints disponibles, estructura de datos, reglas de negocio expuestas y consistencia entre frontend y backend.
- Detectar inconsistencias, endpoints inexistentes o mal utilizados.
- Servir como base para que el frontend no haga suposiciones sobre la API.
- Mantener alineación estricta entre backend y frontend.
- No generar código ni modificar el proyecto.

---

## Cuándo utilizar esta skill

Utilizar esta skill cuando:

- Se conecta el frontend a un backend existente o nuevo.
- Se implementa una nueva feature que depende de API.
- Hay dudas sobre la forma real de los datos del backend.
- Se detectan errores de integración o inconsistencias.
- Antes de crear servicios en `features/*/services`.
- Antes de definir types o mappers en frontend.
- Antes de consumir un endpoint por primera vez.

---

## Entradas

El agente debe analizar como mínimo:

- Código del backend (si está disponible).
- Controladores / rutas (NestJS).
- DTOs / schemas / validaciones del backend.
- Servicios del backend.
- Configuración de endpoints.
- Código del frontend que consume la API.
- `shared/lib/api.ts`.
- Servicios existentes en `features/*/services`.
- Types actuales del frontend relacionados.
- Mappers existentes.
- Documentación existente (si existe).
- Context7 (solo para documentación de frameworks o librerías, no para inferir API propia).

---

## Procedimiento

1. Identificar módulos del backend relevantes al frontend.
2. Listar endpoints disponibles por dominio (auth, materiales, pesajes, etc.).
3. Documentar cada endpoint con:
   - Método HTTP
   - URL
   - Propósito funcional
4. Analizar DTOs de entrada (request models).
5. Analizar DTOs de salida (response models).
6. Identificar validaciones reales del backend.
7. Comparar contratos backend vs frontend.
8. Detectar inconsistencias entre tipos frontend y DTOs backend.
9. Verificar endpoints consumidos en frontend que no existan o estén mal usados.
10. Detectar endpoints disponibles no utilizados en frontend.
11. Evaluar naming inconsistente entre backend y frontend.
12. Detectar acoplamiento indebido a estructuras internas del backend.
13. Proponer un modelo de contrato frontend basado en el backend real.
14. Identificar oportunidades de simplificación del mapeo API → UI.
15. Priorizar problemas según impacto.

---

## Criterios de revisión

Evaluar el contrato considerando:

- Consistencia backend ↔ frontend.
- Fidelidad de los DTOs.
- Correctitud de tipos TypeScript.
- Separación entre modelo API y modelo UI.
- Cohesión por dominio.
- Reutilización de endpoints.
- Claridad del contrato.
- Bajo acoplamiento.
- Escalabilidad del modelo de datos.
- Simplicidad del mapeo.
- Robustez ante cambios del backend.

---

## Restricciones

- No generar código.
- No modificar backend ni frontend.
- No inventar endpoints o estructuras de datos.
- No asumir respuestas del backend sin evidencia.
- No “corregir” el backend desde el frontend.
- No simplificar contratos sin justificar impacto.
- No proponer cambios sin evidencia en el código analizado.
- No redefinir arquitectura del backend.
- No avanzar a implementación.

---

## Resultado esperado

El agente debe entregar un informe estructurado:

---

### 1. Resumen del backend analizado

Descripción general de módulos y dominios existentes.

---

### 2. Inventario de endpoints

Listado por dominio:

- Método
- URL
- Propósito
- Uso actual en frontend (si existe)

---

### 3. Contratos de datos

Para cada endpoint relevante:

- Request DTOs
- Response DTOs
- Validaciones del backend
- Campos obligatorios y opcionales

---

### 4. Mapeo frontend vs backend

- Coincidencias correctas
- Inconsistencias
- Uso incorrecto de endpoints
- Campos mal interpretados
- Tipos desalineados

---

### 5. Inconsistencias detectadas

- Tipos incorrectos
- Campos faltantes
- Campos sobrantes
- Diferencias de naming
- Errores de interpretación del contrato

---

### 6. Problemas de diseño de contrato

- Acoplamiento excesivo frontend-backend
- Falta de separación API model vs UI model
- Reutilización incorrecta de DTOs
- Servicios duplicados o inconsistentes

---

### 7. Propuesta de modelo frontend

Definir cómo deberían estructurarse los modelos en frontend basados en el backend real:

- Modelos API (entrada/salida)
- Modelos UI (transformados)
- Mappers necesarios

(Sin escribir código obligatorio)

---

### 8. Riesgos de integración

- Posibles bugs futuros por desalineación de contratos
- Inestabilidad de tipos
- Fragilidad ante cambios del backend
- Overfetching o underfetching de datos

---

### 9. Acciones recomendadas (sin código)

Ordenadas por prioridad:

- Críticas
- Altas
- Medias
- Bajas

Cada una con justificación técnica.

---

### 10. Conclusión técnica

Estado general del contrato frontend-backend:

- Nivel de alineación
- Nivel de riesgo
- Estabilidad del diseño actual
- Recomendaciones generales

---

## Filosofía de la skill

- El backend define el contrato.
- El frontend lo interpreta y adapta.
- No se asume información no observada.
- La precisión es más importante que la velocidad.
- El objetivo es evitar integración por suposiciones.
