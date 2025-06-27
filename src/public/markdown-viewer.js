// Componente modular para mostrar Markdown en cualquier página
// Uso: <div id="mi-markdown"></div> <script src="markdown-viewer.js"></script>
// Llama: renderMarkdown('info.md', 'mi-markdown');

(function() {
  window.renderMarkdown = function(mdPath, containerId) {
    // Crea el contenedor si no existe
    let cont = document.getElementById(containerId);
    if (!cont) {
      cont = document.createElement('div');
      cont.id = containerId;
      document.body.appendChild(cont);
    }
    cont.className = 'prose prose-lg bg-white/90 rounded-xl shadow-lg p-8 border border-blue-100 max-w-3xl mx-auto my-8';
    // Carga la librería marked si no está
    function loadMarked(cb) {
      if (window.marked) return cb();
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
      s.onload = cb;
      document.head.appendChild(s);
    }
    loadMarked(function() {
      fetch(mdPath)
        .then(res => res.text())
        .then(md => {
          cont.innerHTML = window.marked.parse(md);
        });
    });
  };
})();
