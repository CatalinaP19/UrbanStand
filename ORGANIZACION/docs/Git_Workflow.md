### Convención de commits
Se utilizará la convención de Conventional Commits:

- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `style`: Formato, sin cambios en código (espacios, comas, etc.)
- `refactor`: Refactorización del código sin cambios funcionales
- `test`: Agregar o corregir pruebas
- `chore`: Tareas de mantenimiento


### Frecuencia de push/pull
- Realizar `git pull` al comenzar el día y antes de comenzar una nueva tarea.
- Hacer `git push` cada vez que se complete una funcionalidad o parte importante del código (mínimo una vez al día).
- Evitar dejar commits locales por varios días sin hacer push.


### Política de Pull Requests
- Todo cambio debe realizarse en una rama distinta a `develop` (por ejemplo, `feature/nombre-funcionalidad`).
- Los Pull Requests se deben hacer contra la rama `develop`.
- Todo PR debe ser revisado y aprobado por al menos un miembro del equipo antes de hacer merge.
- No se permiten merges sin revisión previa.
- Se deben resolver todos los conflictos antes de hacer merge.
