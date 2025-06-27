# Cómo usar el componente Markdown Viewer

Este proyecto incluye un componente modular para mostrar archivos Markdown en cualquier página web de tu sitio.

## ¿Cómo integrarlo?

1. **Agrega el archivo JS**

Incluye el archivo `markdown-viewer.js` en tu HTML:

```html
<script src="markdown-viewer.js"></script>
```

2. **Agrega un contenedor donde quieras mostrar el Markdown**

Por ejemplo:
```html
<div id="mi-markdown"></div>
```

3. **Llama a la función para renderizar el Markdown**

Después de incluir el JS y el contenedor, llama:

```html
<script>
  renderMarkdown('info.md', 'mi-markdown');
</script>
```

- El primer parámetro es la ruta a tu archivo `.md`.
- El segundo parámetro es el `id` del contenedor donde se mostrará el contenido.

## Ejemplo completo

```html
<div id="mi-markdown"></div>
<script src="markdown-viewer.js"></script>
<script>
  renderMarkdown('info.md', 'mi-markdown');
</script>
```

## Personalización

- Puedes usar cualquier archivo Markdown.
- Puedes tener varios contenedores en la misma página, solo usa diferentes `id` y llama varias veces a `renderMarkdown`.

---
