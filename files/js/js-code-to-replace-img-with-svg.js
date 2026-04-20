document.addEventListener("DOMContentLoaded", function () {
   document.querySelectorAll('.categories__item img[src$=".svg"]').forEach(img => {
      let imgURL = img.src;

      fetch(imgURL)
         .then(response => response.text())
         .then(svgContent => {
            let parser = new DOMParser();
            let svgElement = parser.parseFromString(svgContent, "image/svg+xml").querySelector("svg");

            if (svgElement) {
               // Копируем атрибуты width/height, если они есть
               if (img.hasAttribute("width")) svgElement.setAttribute("width", img.getAttribute("width"));
               if (img.hasAttribute("height")) svgElement.setAttribute("height", img.getAttribute("height"));

               // Копируем alt как aria-label для доступности
               if (img.hasAttribute("alt")) svgElement.setAttribute("aria-label", img.getAttribute("alt"));

               // Добавляем класс для удобства стилизации
               svgElement.classList.add("categories__icon");

               // Вставляем svg вместо img
               img.replaceWith(svgElement);
            }
         })
         .catch(error => console.error("Ошибка загрузки SVG:", error));
   });
});