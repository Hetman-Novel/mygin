document.addEventListener('DOMContentLoaded', function() {

   // Determining if maximum height is exceeded
   function checkScrollInBlocks() {
      const blocks = document.querySelectorAll('.block-with-result__block');
      blocks.forEach(block => {
         if (block.scrollHeight > block.clientHeight) {
            block.classList.add('there-is-a-scroll');
         } else {
            block.classList.remove('there-is-a-scroll');
         }
      });
   }
   checkScrollInBlocks(); // Initialization on boot
   window.addEventListener('resize', checkScrollInBlocks); // Track window resizing
   const observer = new MutationObserver(() => { // Monitoring changes in blocks
      checkScrollInBlocks();
   });
   document.querySelectorAll('.block-with-result__block').forEach(block => { // Setting up the observer
      observer.observe(block, {
         childList: true, // Track the addition and removal of child elements
         subtree: true, // Include child nodes
         characterData: true // Track changes in text content
      });
   });


   // demo ->

   // Add class when clicking on input
   document.querySelectorAll('.form-culumn.cat input').forEach(input => {
      // Обработчик клика на поле
      input.addEventListener('click', (e) => {
         e.stopPropagation(); // Останавливаем всплытие события
         document.querySelectorAll('.form-culumn.cat').forEach(column => {
            column.classList.remove('show-result');
         });
         if (input.value.trim().length > 0) {
            input.closest('.form-culumn.cat').classList.add('show-result');
         }
      });

      // Обработчик ввода в поле
      input.addEventListener('input', () => {
         if (input.value.trim().length > 0) {
            document.querySelectorAll('.form-culumn.cat').forEach(column => {
               column.classList.remove('show-result');
            });
            input.closest('.form-culumn.cat').classList.add('show-result');
         } else {
            input.closest('.form-culumn.cat').classList.remove('show-result');
         }
      });
   });
   // For regions - >
   document.querySelector('.form-culumn.regions input').addEventListener('click', () => {
      document.querySelector('.form-culumn.regions').classList.add('show-result');
   });
   // Check the field for characters to move the show class
   function toggleRegionClass(input) {
      const formColumn = input.closest('.form-culumn.regions');
      const wrapAllCountry = formColumn.querySelector('.wrap-all-country');
      const wrapRegionList = formColumn.querySelector('.wrap-region-list');

      if (input.value.trim().length > 0) {
         wrapAllCountry.classList.remove('show');
         wrapRegionList.classList.add('show');
      } else {
         wrapAllCountry.classList.add('show');
         wrapRegionList.classList.remove('show');
      }
   }
   // Hides the block with results by clicking on All country
   document.querySelector('.border.region a').addEventListener('click', () => {
      document.querySelector('.form-culumn.regions').classList.remove('show-result');
   });
   // <- For regions

   // Track input into the field
   document.querySelectorAll('.form-culumn.regions input').forEach(input => {
      input.addEventListener('input', () => {
         toggleRegionClass(input);
      });
   });

   // Remove class when clicking outside the block
   document.addEventListener('click', (e) => {
      if (!e.target.closest('.form-culumn')) {
         document.querySelectorAll('.form-culumn').forEach(column => {
            column.classList.remove('show-result');
         });
      }
   });

   // Checking the field for characters
   function toggleCloseButtonClass(input) {
      const formColumn = input.closest('.form-culumn');
      const closeButton = formColumn.querySelector('.form-culumn-btn-close');

      if (input.value.trim().length > 0) {
         closeButton.classList.add('show');
      } else {
         closeButton.classList.remove('show');
      }
   }

   // Track input into the field
   document.querySelectorAll('.form-culumn input').forEach(input => {
      input.addEventListener('input', () => {
         toggleCloseButtonClass(input);
      });
   });

   // Clear button
   document.querySelectorAll('.form-culumn-btn-close').forEach(button => {
      button.addEventListener('click', (e) => {
         e.stopPropagation(); // Stop event bubbling
         const formColumn = button.closest('.form-culumn');
         const input = formColumn.querySelector('input');
         if (input) {
            input.value = ''; // Clear the field
            toggleCloseButtonClass(input); // Reset the show class of the button
         }
         formColumn.classList.remove('show-result'); // Hide the block with results
      });
   });

   /*
   let searchTimeout; // Delay before searching
   // Input handler for the field
   document.querySelectorAll('.form-culumn input').forEach(input => {
      input.addEventListener('input', () => {
         clearTimeout(searchTimeout); // Reset the previous timer

         const formColumn = input.closest('.form-culumn');
         const resultsList = formColumn.querySelector('.wrap-region-list ul');
         const searchingItem = resultsList.querySelector('.hidden-searching');
         const noResultItem = resultsList.querySelector('.hidden-no-result');
         const searchTerm = input.value.trim().toLowerCase();

         // Clear all li elements except static ones
         resultsList.querySelectorAll('li:not(.hidden-searching):not(.hidden-no-result)').forEach(li => li.remove());

         // Показываем "Searching..."
         searchingItem?.classList.add('show');
         noResultItem?.classList.remove('show');

         searchTimeout = setTimeout(() => {
            // Remove "Searching..." after search is complete
            searchingItem?.classList.remove('show');

            if (searchTerm.length > 0) {
               const categories = document.querySelectorAll('.categories__items .categories__name');
               let resultsFound = false;

               categories.forEach(category => {
                  const categoryText = category.textContent.toLowerCase();
                  // Check for a match from the beginning of the string
                  if (categoryText.startsWith(searchTerm)) {
                     resultsList.innerHTML += `
                        <li><a href="#">${category.textContent}</a></li>
                     `;
                     resultsFound = true;
                  }
               });

               // If nothing found
               if (!resultsFound) {
                  noResultItem?.classList.add('show');
               }
            } else {
               // If the field is empty
               noResultItem?.classList.remove('show');
            }
         }, 1000); // 1 second delay
      });
   });

   // Click on a link in search results
   document.querySelectorAll('.form-culumn').forEach(formColumn => {
      const resultsList = formColumn.querySelector('.wrap-region-list ul');
      resultsList.addEventListener('click', (e) => {
         if (e.target.tagName === 'A') {
            e.preventDefault();
            const input = formColumn.querySelector('input');
            input.value = e.target.textContent.trim();
            formColumn.classList.remove('show-result');
         }
      });
   });
   */
});