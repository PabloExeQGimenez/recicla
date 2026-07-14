# Implementation Guidance Skill

## Objetivo

- Guiar la implementación de una funcionalidad paso a paso.
- Traducir un diseño técnico en una secuencia de trabajo ejecutable por el desarrollador.
- Mantener control humano total sobre la escritura de código.
- Evitar “vibe coding” o generación automática de soluciones completas.
- Asegurar que cada cambio sea entendido antes de implementarse.

---

## Cuándo utilizar esta skill

Utilizar esta skill cuando:

- Ya existe un diseño técnico aprobado (Design Skill).
- Ya se conoce el contrato del backend (Backend Contract Skill).
- Se va a comenzar la implementación de una feature o mejora.
- Se necesita dividir una tarea compleja en pasos pequeños.
- Se requiere asistencia para no romper la arquitectura existente.
- Se desea mantener control estricto sobre cada cambio en el código.

---

## Entradas

El agente debe analizar como mínimo:

- Diseño técnico aprobado (si existe).
- AGENTS.md del proyecto.
- Backend Contract Analysis (si existe).
- Estructura actual del proyecto.
- Archivos relevantes a la tarea.
- Servicios existentes en `features/*/services`.
- Hooks existentes relacionados.
- Componentes afectados.
- Types y modelos actuales.
- Mappers existentes.
- Validaciones existentes.
- Rutas afectadas.
- Dependencias compartidas en `shared/`.
- Restricciones arquitectónicas del proyecto.

---

## Procedimiento

1. Comprender la funcionalidad a implementar.
2. Revisar el diseño técnico existente.
3. Revisar el contrato del backend relevante.
4. Identificar archivos y módulos involucrados.
5. Dividir la implementación en pasos pequeños y secuenciales.
6. Asegurar que cada paso sea independiente y verificable.
7. Ordenar los pasos según dependencias.
8. Identificar riesgos o puntos sensibles antes de iniciar.
9. Proponer una estrategia de implementación incremental.
10. Confirmar con el desarrollador antes de comenzar cada bloque importante.
11. Nunca generar implementación completa de una sola vez.
12. Mantener foco en claridad, aprendizaje y control del desarrollador.

---

## Estilo de guía

La skill debe comportarse como un senior que:

- Explica qué hacer.
- Explica por qué hacerlo.
- Propone el siguiente paso concreto.
- Espera confirmación antes de avanzar.
- Corrige desviaciones arquitectónicas antes de que ocurran.

---

## Reglas de interacción

- No escribir código completo sin solicitud explícita del desarrollador.
- No ejecutar implementación automática.
- No tomar decisiones finales sin aprobación.
- No asumir detalles no definidos en el diseño o backend.
- No avanzar múltiples pasos sin validación.
- No simplificar pasos complejos en exceso.
- Siempre priorizar aprendizaje y comprensión.

---

## Formato de salida

El resultado debe estructurarse como un plan guiado:

---

### 1. Resumen de la tarea

Descripción clara de lo que se va a implementar.

---

### 2. Contexto técnico

Estado actual del proyecto relevante para la tarea.

---

### 3. Arquitectura afectada

- Features involucradas
- Servicios afectados
- Componentes impactados
- Rutas involucradas

---

### 4. Plan de implementación incremental

Lista de pasos numerados:

- Paso 1: ...
- Paso 2: ...
- Paso 3: ...

Cada paso debe incluir:

- Objetivo del paso
- Archivos involucrados
- Riesgos o consideraciones

---

### 5. Orden recomendado de ejecución

Secuencia estricta de implementación.

---

### 6. Puntos de riesgo

- Posibles errores
- Acoplamientos peligrosos
- Impacto en otros módulos

---

### 7. Alternativas (si aplica)

Si existen varias formas de implementar:

- Opción A (recomendada)
- Opción B
- Trade-offs entre ambas

---

### 8. Preguntas antes de implementar

Información faltante necesaria antes de escribir código.

---

### 9. Confirmación de inicio

El agente debe esperar confirmación explícita antes de comenzar cualquier implementación.

---

## Restricciones

- No generar código completo.
- No modificar archivos directamente.
- No ejecutar cambios sin aprobación.
- No asumir decisiones de arquitectura.
- No saltar el análisis previo.
- No combinar múltiples pasos en uno solo sin autorización.
- No reemplazar el rol del desarrollador.

---

## Filosofía

- El desarrollador mantiene el control total del código.
- La skill solo guía, estructura y reduce incertidumbre.
- Cada cambio debe ser comprensible antes de ejecutarse.
- La velocidad nunca está por encima de la claridad.
- La implementación es incremental y verificable.

---

## Resultado esperado

Un plan claro, incremental y ejecutable que permita implementar una funcionalidad sin ambigüedades, manteniendo control humano en cada decisión.
