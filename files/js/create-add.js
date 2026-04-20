document.addEventListener('DOMContentLoaded', function () {
   // Main block with a large picture
   const mainPhotoInput = document.getElementById('profile-photo');
   const mainPhotoWrap = document.getElementById('create-add-wrap-photo');
   const additionalImagesWrap = document.querySelector('.create-add__additional-images');

   // Update image and add class for main block
   setupPhotoHandler(mainPhotoInput, mainPhotoWrap, additionalImagesWrap);

   // Processing additional images
   const additionalPhotoInputs = document.querySelectorAll('[id^="profile-photo-additional-"]');
   additionalPhotoInputs.forEach(input => {
      const wrap = input.closest('.create-add__wrapPhoto');
      setupPhotoHandler(input, wrap);
   });

   // Clearing the image by button
   const removeButtons = document.querySelectorAll('[id^="remove-photo-"]');
   removeButtons.forEach(button => {
      button.addEventListener('click', function () {
         const id = button.id.replace('remove-photo-', '');
         const wrap = document.getElementById(`create-add-wrap-additional-photo-${id}`);
         const input = document.getElementById(`profile-photo-additional-${id}`);
         clearPhoto(wrap, input);
      });
   });

   /**
    * Image processing initialization function
    * @param {HTMLInputElement} input - Image upload field
    * @param {HTMLElement} wrap - Image wrapper
    * @param {HTMLElement|null} additionalWrap - Additional wrapping (if any)
    */
   function setupPhotoHandler(input, wrap, additionalWrap = null) {
      // Handle image change via input
      input.addEventListener('change', function () {
         handlePhotoChange(input, wrap, additionalWrap);
      });
      // Add drag and drop support
      wrap.addEventListener('dragover', (e) => {
         e.preventDefault();
         wrap.classList.add('dragover');
      });
      wrap.addEventListener('dragleave', () => {
         wrap.classList.remove('dragover');
      });
      wrap.addEventListener('drop', (e) => {
         e.preventDefault();
         wrap.classList.remove('dragover');
         const file = e.dataTransfer.files[0];
         if (file && file.type.startsWith('image/')) {
            handleDroppedPhoto(file, wrap, input, additionalWrap);
         }
      });
   }

   /**
    * Image selection processing function
    * @param {HTMLInputElement} input - Image upload field
    * @param {HTMLElement} wrap - Image wrapper
    * @param {HTMLElement|null} additionalWrap - Additional wrapping (if any)
    */
   function handlePhotoChange(input, wrap, additionalWrap = null) {
      if (input.files && input.files[0]) {
         const reader = new FileReader();
         reader.onload = function (e) {
            let img = wrap.querySelector('img');
            if (!img) {
               img = document.createElement('img');
               wrap.appendChild(img);
            }
            img.src = e.target.result;
            wrap.classList.add('photo-selected');
            if (additionalWrap) {
               additionalWrap.classList.add('show-additional-photo');
            }
         };
         reader.readAsDataURL(input.files[0]);
      }
   }

   /**
    * Image processing function while dragging
    * @param {File} file - Dragged file
    * @param {HTMLElement} wrap - Image wrapper
    * @param {HTMLInputElement} input - Image upload field
    * @param {HTMLElement|null} additionalWrap - Additional wrapping (if any)
    */
   function handleDroppedPhoto(file, wrap, input, additionalWrap = null) {
      const reader = new FileReader();
      reader.onload = function (e) {
         let img = wrap.querySelector('img');
         if (!img) {
            img = document.createElement('img');
            wrap.appendChild(img);
         }
         img.src = e.target.result;
         wrap.classList.add('photo-selected');
         if (additionalWrap) {
            additionalWrap.classList.add('show-additional-photo');
         }
      };
      reader.readAsDataURL(file);

      // Update input to sync
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
   }

   /**
    * Image cleaning function
    * @param {HTMLElement} wrap - Image wrapper
    * @param {HTMLInputElement} input - Image upload field
    */
   function clearPhoto(wrap, input) {
      const img = wrap.querySelector('img');
      if (img) {
         img.remove();
      }
      input.value = ''; // Reset the value of input
      wrap.classList.remove('photo-selected');
   }

   // Validate Form
   const form = document.querySelector('.create-add__form');
   const submitButton = form.querySelector('button[type="submit"]');
   const previewButton = form.querySelector('.create-add__form-button.preview');
   const titleField = document.getElementById('create-add-title');
   const categoriesField = document.getElementById('create-add-categories');
   const addressField = document.getElementById('create-add-address');
   const descriptionField = document.getElementById('create-add-description');
   const priceField = document.getElementById('create-add-price');
   const negotiablePriceRadios = document.querySelectorAll('input[name="negotiable-price"]');
   const currencyRadios = document.querySelectorAll('input[name="currency"]');
   const unitRadios = document.querySelectorAll('input[name="unit"]');

   // Checking fields
   function validateForm() {
      let isValid = true;

      // Checking the main image
      if (!mainPhotoWrap.querySelector('img')) {
         isValid = false;
      }

      // Checking text fields
      if (!titleField.value.trim()) isValid = false;
      if (!categoriesField.value.trim()) isValid = false;
      if (!addressField.value.trim()) isValid = false;
      if (!descriptionField.value.trim()) isValid = false;
      if (!priceField.value.trim()) isValid = false;

      // Checking radio buttons
      if (![...negotiablePriceRadios].some(radio => radio.checked)) isValid = false;
      if (![...currencyRadios].some(radio => radio.checked)) isValid = false;
      if (![...unitRadios].some(radio => radio.checked)) isValid = false;

      // Remove or add disabled depending on validation status
      if (isValid) {
         submitButton.disabled = false;
         if (previewButton) {
            previewButton.classList.remove('disabled');
         }
      } else {
         submitButton.disabled = true;
         if (previewButton) {
            previewButton.classList.add('disabled');
         }
      }
   }

   // Event handlers for all fields
   titleField.addEventListener('input', validateForm);
   categoriesField.addEventListener('input', validateForm);
   addressField.addEventListener('input', validateForm);
   descriptionField.addEventListener('input', validateForm);
   priceField.addEventListener('input', validateForm);
   negotiablePriceRadios.forEach(radio => radio.addEventListener('change', validateForm));
   currencyRadios.forEach(radio => radio.addEventListener('change', validateForm));
   unitRadios.forEach(radio => radio.addEventListener('change', validateForm));

   // Check the main image when it changes
   mainPhotoInput.addEventListener('change', function () {
      if (mainPhotoInput.files && mainPhotoInput.files[0]) {
         const reader = new FileReader();
         reader.onload = function (e) {
            let img = mainPhotoWrap.querySelector('img');
            if (!img) {
               img = document.createElement('img');
               mainPhotoWrap.appendChild(img);
            }
            img.src = e.target.result;
            mainPhotoWrap.classList.add('photo-selected');
            validateForm();
         };
         reader.readAsDataURL(mainPhotoInput.files[0]);
      }
   });
   validateForm(); // Initialization on boot
});