# Frontend Architecture Audit

## Objetivo

Auditar la arquitectura del frontend para evaluar su organización, mantenibilidad y escalabilidad.
El objetivo es elaborar un diagnóstico técnico y un plan de mejoras. No debe modificar el código.

---

## Cuándo utilizar esta Skill
- Al comenzar a trabajar en un proyecto existente.
- Antes de una refactorización importante.
- Antes de desarrollar funcionalidades grandes.
- Cuando existan dudas sobre la arquitectura.

---

## Entradas

Analizar como mínimo:

- `AGENTS.md`
- Estructura del proyecto
- Organización por features
- Componentes
- Hooks
- Services
- Shared
- Rutas
- Configuración global
- Comunicación con la API

---

## Procedimiento

1. Analizar la estructura del proyecto.
2. Identificar la arquitectura actual.
3. Compararla con las reglas definidas en `AGENTS.md`.
4. Detectar problemas de organización y responsabilidades.
5. Evaluar la capa de servicios y la comunicación con la API.
6. Detectar duplicaciones y deuda técnica.
7. Priorizar las mejoras.
8. Generar o actualizar `spec/plan-de-mejoras-arquitectura.md`.

---

## Criterios de evaluación

Evaluar considerando:

- Clean Architecture
- Arquitectura basada en Features
- Separación de responsabilidades
- Cohesión
- Acoplamiento
- Reutilización
- Escalabilidad
- Consistencia
- Mantenibilidad
- Legibilidad
- Modularidad

---

## Evidencias

Cada observación debe incluir:

- Archivo o carpeta afectada.
- Problema detectado.
- Justificación técnica.
- Impacto.
- Recomendación.

No realizar observaciones sin evidencias.

---

## Resultado esperado

Generar un informe con:

- Resumen ejecutivo.
- Arquitectura actual.
- Fortalezas.
- Debilidades.
- Cumplimiento de Clean Architecture.
- Problemas detectados.
- Deuda técnica.
- Plan de mejoras priorizado.
- Conclusión.

Cada mejora debe indicar:

- Prioridad (Crítica, Alta, Media o Baja).
- Beneficio esperado.
- Esfuerzo estimado.
- Recomendación.

---

## Documento generado

Crear o actualizar:

`spec/plan-de-mejoras-arquitectura.md`

El documento debe contener:

- Estado general del proyecto.
- Resumen ejecutivo.
- Fortalezas.
- Debilidades.
- Problemas detectados.
- Deuda técnica.
- Plan de mejoras priorizado.
- Roadmap recomendado.
- Estado de cada mejora (Pendiente, En progreso o Completada).

En auditorías posteriores, actualizar este documento en lugar de crear uno nuevo.
