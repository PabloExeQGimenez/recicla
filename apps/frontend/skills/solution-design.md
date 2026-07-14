# Diseño de Solución

## Objetivo
- Analizar una funcionalidad antes de comenzar su implementación.
- El objetivo de esta skill es diseñar una solución técnica, evaluar alternativas, identificar el impacto sobre la arquitectura y elaborar un plan de implementación incremental.
- Esta skill no debe generar código ni modificar archivos. Su función es asistir en la toma de decisiones técnicas para que el desarrollador implemente la solución con pleno conocimiento de su diseño.
- El desarrollador mantiene el control de todas las decisiones técnicas. La skill debe recomendar, justificar y planificar, pero nunca decidir ni implementar sin aprobación.

## Cuando Utilizar esta skill
Utilizar esta skill antes de comenzar una tarea que implique cambios en la arquitectura, incorporación de nuevas funcionalidades o modificaciones relevantes sobre el código existente.
Es especialmente útil cuando:
- Se va a desarrollar una nueva feature.
- Se desea modificar una funcionalidad existente.
- Existen varias alternativas de implementación.
- Se necesita evaluar el impacto de una decisión técnica.
- Se pretende mantener la consistencia con la arquitectura del proyecto.
- Se desea dividir una tarea grande en etapas pequeñas y planificadas.
- Esta skill debe ejecutarse antes de cualquier implementación. Su proposito es validar el enfoque técnico y obtener la aprobación del desarrollador antes de comenzar a escribir código.

## Entradas
Antes de elaborar una propuesta, el agente debe recopilar toda la información necesaria sobre la tarea.
Cuando corresponda analizar como mínimo:
- La descripción de la funcionalidad solicitada.
- AGENTS.md.
- La estructura del proyecto.
- Los archivos relacionados con la funcionalidad.
- La organización y arquitectura actual del proyecto.
- Los módulos, componentes, hooks, servicios involucrados y utilidades relacionadas con la funcinalidad.
- Tipos y validaciones existentes.
- Rutas afectadas.
- Código reutilizable disponible en shared/.
- Documentación oficial de librerías utilizadas (utilizando context7 cuando sea necesario)
- Si durante el análisis se detecta que la arquitectura actual presenta problemas importantes, el agente puede proponer una alternativa, justificando claramente sus ventajas, desventajas e impacto sobre el proyecto.
- No debe asumir que la arquitectura existente es necesariamente la mejor opción.

## Procedimiento
1. Comprender el problema planteado por el desarrollador.
2. Analizar el contexto del proyecto utilizando las entradas disponibles.
3. Identificar los módulos, archivos y dependencias involucradas.
4. Detectar restricciones técnicas, arquitectónicas y funcionales relevantes.
5. Verificar si ya existe una implementación o solución reutilizable dentro del proyecto.
6. Evaluar las posibles alternativas de implementación.
7. Comparar las alternativas indicando ventajas, desventajas, impacto y trade-offs.
8. Recomendar la alternativa más adecuada justificando técnicamente la decisión.
9. Dividir la implementación en etapas pequeñas, independientes y verificables.
10. Identificar riesgos, dependencias y posibles efectos secundarios de la solución propuesta.
11. Formular las preguntas necesarias cuando la información disponible no sea suficiente para realizar una recomendación fundamentada.
12. No avanzar hacia la implementación hasta recibir la aprobación explícita del desarrollador.

## Criterios de revisión
Evaluar la solución propuesta considerando, cuando corresponda:
- Consistencia con AGENTS.md.
- Simplicidad de la solución.
- Separación de responsabilidades.
- Clean Architecture.
- Arquitectura basada en Features.
- Cohesión y acoplamiento.
- Reutilización de código existente.
- Escalabilidad.
- Mantenibilidad.
- Legibilidad.
- Modularidad.
- Consistencia con el resto del proyecto.
- Impacto sobre funcionalidades existentes.
- Facilidad de testing futuro.
- Complejidad de implementación.
- Relación entre beneficio y esfuerzo.

## Restricciones
- No generar código bajo ninguna circunstancia.
- No modificar archivos del proyecto.
- No asumir requisitos funcionales no explícitamente mencionados.
- No comenzar la implementación de la solución.
- No tomar decisiones arquitectónicas finales sin aprobación del desarrollador.
- No proponer dependencias nuevas sin justificar su necesidad.
- No ignorar la arquitectura existente sin análisis previo.
- No simplificar el análisis omitiendo alternativas relevantes.
- No dar por hecho la existencia de endpoints, datos o funcionalidades del backend.
- No avanzar a etapas de implementación aunque el diseño esté completo.
- No ejecutar tareas fuera del alcance de análisis y diseño.
## Resultado esperado
El agente debe entregar un informe estructurado con la siguiente forma:

### 1. Resumen del problema
Descripción clara y breve de la funcionalidad solicitada.

### 2. Contexto analizado
Descripción del estado actual del proyecto y elementos relevantes detectados.

### 3. Alcance técnico
Identificación de módulos, archivos y dependencias involucradas.

### 4. Restricciones y consideraciones
Limitaciones técnicas, arquitectónicas o funcionales detectadas.

### 5. Alternativas de implementación
Listado de posibles soluciones con sus respectivas características.

### 6. Comparación de alternativas
Análisis de ventajas, desventajas, impacto y trade-offs de cada opción.

### 7. Recomendación técnica
Solución recomendada con justificación clara y técnica.

### 8. Plan de implementación incremental
Descomposición de la solución en etapas pequeñas, ordenadas y ejecutables.

### 9. Riesgos y efectos secundarios
Posibles problemas, dependencias o impactos negativos de la solución propuesta.

### 10. Preguntas abiertas
Información faltante necesaria para validar o completar la implementación.

### 11. Conclusión
Decisión final propuesta y nivel de confianza en la solución.
