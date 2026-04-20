document.addEventListener('DOMContentLoaded', function() {

   // Form with fields ->
   const form = document.getElementById('profile-form');
   if (!form) return;

   function toggleValidationClass(field, isValid) {
      const parent = field.closest('.profile__wrapField');
      if (!parent) return;

      // Add or remove class 'valid' and 'no-valid' depending on validation
      if (isValid) {
         parent.classList.add('valid');
         parent.classList.remove('no-valid');
      } else {
         parent.classList.add('no-valid');
         parent.classList.remove('valid');
      }

      // Add class 'filled' if field is not empty (if there is data in value)
      if (field.value.trim() !== '') {
         parent.classList.add('filled');
      } else {
         parent.classList.remove('filled');
      }
   }

   // Function to update the number of remaining characters
   function updateCharacterCount(field, minLength) {
      const infoBlock = field.closest('.profile__wrapField')?.querySelector('.info-under-the-field');
      if (!infoBlock) return;

      let counterElement = infoBlock.querySelector('.char-counter');
      if (!counterElement) {
         counterElement = document.createElement('span');
         counterElement.classList.add('char-counter');
         infoBlock.appendChild(counterElement); // Add span for the number
      }

      const remaining = minLength - field.value.length;
      infoBlock.classList.add('show'); // Add class show

      counterElement.textContent = remaining > 0 ? `${remaining}` : '0';
   }

   // Field validation
   form.querySelectorAll('input').forEach((field) => {
      let minLength = 2; // Default value for minimum length
      if (field.id === 'profile-password') minLength = 6;
      else if (field.id === 'profile-phone') minLength = 4;

      // Check that when the page loads, the 'filled' class is added if the value in the field is not empty
      const parent = field.closest('.profile__wrapField');
      if (parent && field.value.trim() !== '') {
         parent.classList.add('filled');
      }

      field.addEventListener('input', () => {
         // Processing for the email field separately
         if (field.id === 'profile-email') {
            // We prohibit entering Cyrillic in email
            field.value = field.value.replace(/[а-яА-ЯёЁ]/g, '');

            // Check for the @ symbol in an email
            const emailValue = field.value;
            const isValidEmail = emailValue.includes('@') && emailValue.indexOf('@') > 0 && emailValue.indexOf('@');

            // Email validation: valid class is only added if @ symbol is present
            toggleValidationClass(field, isValidEmail);
         }

         // Check for other fields (password, phone, and others)
         if (field.id !== 'profile-email') {
            if (field.id === 'profile-password') {
               // We prohibit entering Cyrillic characters in the password
               field.value = field.value.replace(/[а-яА-ЯёЁ]/g, '');
            }

            if (field.id === 'profile-phone') {
               // Phone restrictions
               field.value = field.value
                  .replace(/[^0-9+]/g, '') // Only numbers and + are allowed
                  .replace(/^\+{2,}/g, '+') // Eliminate duplication +
                  .replace(/^(\+)?(\d{1,15})?.*/, (match, plus, numbers) => {
                     return (plus || '') + (numbers || '');
                  });
            }

            updateCharacterCount(field, minLength); // Update character counter

            // Check for minimum length
            const isValid = field.value.length >= minLength;
            toggleValidationClass(field, isValid);
         }
      });
   });
   // <- Form with fields

   // Select photo
   const photoInput = document.getElementById('profile-photo');
   const photoWrap = document.getElementById('profile-wrap-photo');
   const buttonsWrap = document.getElementById('profile-wrap-buttons');
   const removePhotoBtn = document.getElementById('remove-photo');

   if (!photoInput || !photoWrap || !buttonsWrap || !removePhotoBtn) return;

   // Photo selection handler
   photoInput.addEventListener('change', (event) => {
      const file = event.target.files[0];

      if (file && file.type.startsWith('image/')) {
         const reader = new FileReader();
         reader.onload = (e) => {
            // Delete the old image if it exists
            let existingImg = photoWrap.querySelector('img.profile-preview');
            if (existingImg) {
               existingImg.remove();
            }

            // Create a new image
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Selected photo';
            img.classList.add('profile-preview'); // Additional class for managing styles

            // Insert the image before the SVG
            const svgElement = photoWrap.querySelector('svg');
            photoWrap.insertBefore(img, svgElement);

            // Add classes
            photoWrap.classList.add('photo-selected');
            buttonsWrap.classList.add('save-changes');
         };
         reader.readAsDataURL(file);
      }
   });

   // Photo deletion handler
   removePhotoBtn.addEventListener('click', () => {
      // Delete the image
      const existingImg = photoWrap.querySelector('img.profile-preview');
      if (existingImg) {
         existingImg.remove();
      }

      // Remove classes
      photoWrap.classList.remove('photo-selected');
      buttonsWrap.classList.remove('save-changes');

      photoInput.value = ''; // Reset the file input value
   });

   // Show/hide password
   const iconPass = document.getElementById('icon-password');
   const inputPass = document.getElementById('profile-password');
   if (iconPass && inputPass) {
      iconPass.addEventListener('click', () => {
         if (inputPass.getAttribute('type') === 'password') {
            inputPass.setAttribute('type', 'text');
            iconPass.classList.add('show-password');
         } else {
            inputPass.setAttribute('type', 'password');
            iconPass.classList.remove('show-password');
         }
      });
   }
});

// Tabs
var parent2Tabs = document.querySelectorAll('.profile__subButtons .profile__subButton');
if (parent2Tabs) {
   parent2Tabs.forEach(function (parent2Tab) {
      parent2Tab.addEventListener('click', function () {
         var parent2TabId = this.getAttribute('data-subtab');
         var correspondingParent2TabContent = document.querySelector('.profile__subTabContent[data-subcontent="' + parent2TabId + '"]');
         document.querySelectorAll('.profile__subButtons .profile__subButton').forEach(function (tab2) {
            tab2.classList.remove('active');
         });
         document.querySelectorAll('.profile__subTabContent').forEach(function (content2) {
            content2.classList.remove('show-content');
         });
         this.classList.add('active');
         correspondingParent2TabContent.classList.add('show-content');
      });
   });
}

// For form-help
const textarea = document.querySelector('.form-help__text');
const submitButton = document.querySelector('.form-help__submit');
const infoBlock = document.querySelector('.info-under-the-field');
if (textarea && submitButton && infoBlock) { // Check for the presence of elements
   const MIN_CHAR_COUNT = 9; // Minimum number of characters without spaces

   // Function to check the number of characters
   function validateTextarea() {
      const text = textarea.value.replace(/\s/g, ''); // Remove all spaces
      const remaining = Math.max(MIN_CHAR_COUNT - text.length, 0); // Count the remaining characters
      const parentField = textarea.closest('.wrap-textarea'); // Parent of the element

      // Add show class on input
      if (text.length > 0) {
         infoBlock.classList.add('show');
      } else {
         infoBlock.classList.remove('show');
      }

      // Update the counter text
      let counterElement = infoBlock.querySelector('.char-counter');
      if (!counterElement) {
         counterElement = document.createElement('strong');
         counterElement.classList.add('char-counter');
         infoBlock.appendChild(counterElement); // Add the element if it doesn't exist
      }
      counterElement.textContent = remaining;
      submitButton.disabled = text.length < MIN_CHAR_COUNT; // Activate/deactivate button
      if (parentField) { // Add/remove the valid class from the parent
         if (text.length >= MIN_CHAR_COUNT) {
            parentField.classList.add('valid');
         } else {
            parentField.classList.remove('valid');
         }
      }
   }
   textarea.addEventListener('input', validateTextarea); // We attach an event handler to the input in textarea
   validateTextarea(); // Initialization on page load
}