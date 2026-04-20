document.addEventListener("DOMContentLoaded", function () {

   // raise header if active header__categories-select, header__lang-select, header__blockProfile
   const header = document.querySelector('.header.header');
   const trackedElements = [
      '.header__categories-select',
      '.header__lang-select',
      '.header__blockProfile'
   ];
   const checkOpenClass = () => { // Function to check for the presence of the open class
      const hasOpenClass = trackedElements.some(selector => {
         const element = document.querySelector(selector);
         return element && element.classList.contains('open');
      });
      if (hasOpenClass) {
         header.classList.add('lift-up');
      } else {
         header.classList.remove('lift-up');
      }
   };
   const observer = new MutationObserver(checkOpenClass); // Add MutationObserver to track class changes
   trackedElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
         observer.observe(element, { attributes: true, attributeFilter: ['class'] });
      }
   });

   // Open/close the number entry field
   let openFieldPhone = document.querySelector('.select-curent');
   if (openFieldPhone) {
      openFieldPhone.addEventListener('click', () => {
         openFieldPhone.parentNode.classList.toggle('open');
      });
   }

   // Go to code input
   let parentTabs = document.querySelectorAll('.log-in-form__button.log-in-button');
   parentTabs.forEach(function (parentTab) {
      parentTab.addEventListener('click', function () {
         var parentTabId = this.getAttribute('data-tab');
         var correspondingParentTabContent = document.querySelector('.log-in-form__block[data-tabcontent="' + parentTabId + '"]');

         // Remove active classes from all parent tabs and contents
         document.querySelectorAll('.tabs__wrap-tab .tab').forEach(function (tab) {
            tab.classList.remove('log-in-form__button.log-in-button');
         });
         document.querySelectorAll('.log-in-form__block').forEach(function (content) {
            content.classList.remove('block-active');
         });

         // Add active classes to the selected parent tab and content
         //this.classList.add('log-in-form__button.log-in-button');
         correspondingParentTabContent.classList.add('block-active');
      });
   });

   // Field in focus
   const selectWrapInput = document.querySelector('.select-wrap-input input');
   if (selectWrapInput) {
      selectWrapInput.addEventListener('focus', () => {
         selectWrapInput.parentNode.parentNode.classList.add('field-in-focus');
         setTimeout(() => { // Remove class after 3 seconds
            selectWrapInput.parentNode.parentNode.classList.remove('field-in-focus');
         }, 3000);
      });
   }

   // Checking a field for validity / Add entered number to log-in-entered-number
   const inputField = document.querySelector('.select-wrap-input input');
   const loginButton = document.querySelector('.log-in-form__button.log-in-button');
   const displayFields = document.querySelectorAll('.log-in-entered-number'); // All elements for displaying the number
   if (inputField && loginButton) {
      // Limit input to numbers only (excluding +) and no more than 10 characters
      inputField.addEventListener('input', () => {
         inputField.value = inputField.value.replace(/[^\d]/g, '').slice(0, 10); // Remove non-numeric characters, including +
         const isValid = /^\d{10}$/.test(inputField.value); // Check if there are exactly 10 digits
         const formattedNumber = inputField.value.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4').trim(); // Formatting a number with spaces
         displayFields.forEach(field => { // Update all fields with class .log-in-entered-number
            field.textContent = formattedNumber;
         });
         if (isValid) {
            loginButton.classList.remove('disabled'); // Remove the class if the input is valid
         } else {
            loginButton.classList.add('disabled'); // Add class if input is invalid
         }
      });
   }

   // Starting the timer
   const timerElement = document.querySelector('.log-in-form-timer');
   const blockInfo = document.querySelector('.log-in-form__block-info');
   const wrapSubmitTwoButton = document.querySelector('.log-in-form__wrap-submit.two-button');
   let timerInterval; // Variable for storing the timer
   function startTimer() { // Timer start function
      let timeLeft = 59; // Countdown from 59 seconds
      const updateTimerDisplay = () => {
         const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
         const seconds = String(timeLeft % 60).padStart(2, '0');
         timerElement.textContent = `${minutes}:${seconds}`;
      };
      clearInterval(timerInterval); // Clear the previous timer if there was one
      updateTimerDisplay(); // Set the initial value of the timer
      timerInterval = setInterval(() => {
         timeLeft--;
         updateTimerDisplay();
         if (timeLeft <= 0) {
            clearInterval(timerInterval); // Stop the timer
            const parentBlock = timerElement.parentElement.parentElement.parentElement;
            parentBlock.classList.add('hidden'); // Add the hidden class to the parent block
            setTimeout(() => { // After 10 seconds we change classes
               parentBlock.classList.remove('hidden'); // Remove the hidden class
               parentBlock.classList.add('not-receive'); // Add the not-receive class
            }, 10000); // 10 seconds
         }
      }, 1000);
   }
   if (loginButton && timerElement) { // Event for the timer start button
      loginButton.addEventListener('click', () => {
         if (loginButton.classList.contains('disabled')) return; // If the button is disabled, do nothing
         startTimer(); // Start the timer
         wrapSubmitTwoButton.classList.add('hidden');
      });
   }
   if (blockInfo) { // Click handler for log-in-form__block-info with class not-receive
      blockInfo.addEventListener('click', () => {
         if (blockInfo.classList.contains('not-receive')) {
            blockInfo.classList.remove('not-receive'); // Remove the not-receive class
            startTimer(); // Restart the timer
         }
      });
   }

   // Enter or paste code
   const numberFields = document.querySelectorAll('.wrap-fields-number input[type="number"]');
   numberFields.forEach((field, index) => { // Function for handling input
      field.addEventListener('input', () => {
         // Leave only numbers
         field.value = field.value.replace(/\D/g, '');
         if (field.value.length > 1) { // Limit to one digit per field
            field.value = field.value[0]; // Leave only the first digit
         }
         if (field.value.length === 1 && index < numberFields.length - 1) { // If a number is entered, move to the next field
            numberFields[index + 1].focus();
         }
         // Check if all fields are filled (only 4 digits)
         const allValues = Array.from(numberFields).map(input => input.value).join('');
         if (allValues.length >= 4) {
            let values = allValues.slice(0, 4).split(''); // We take only the first 4 digits
            numberFields.forEach((input, i) => {
               input.value = values[i] || ''; // Separate the numbers by fields, if there are less than 4, leave them empty
            });
         }
      });
      field.addEventListener('paste', (e) => { // Processing paste (Ctrl + V)
         e.preventDefault();// Stop the default insert behavior
         // Get the inserted data
         const pasteData = e.clipboardData.getData('text').replace(/\D/g, ''); // Leave only numbers
         const dataToPaste = pasteData.slice(0, 4); // We take only the first 4 digits
         // Separate the numbers and insert them into fields
         let values = dataToPaste.split('');
         numberFields.forEach((input, i) => {
            input.value = values[i] || ''; // If the numbers are less than 4, leave them blank
         });
      });
   });

   // If the code is valid and the valid class is added to the parent of the code fields
   const wrapFieldsNumber = document.querySelector('.wrap-fields-number');
   const submitButton = document.querySelector('.log-in-form__block-button');
   function checkValidClass() { // Function to check if class 'valid' exists
      if (wrapFieldsNumber.classList.contains('valid')) {
         if (blockInfo) { // Add the hidden class to .log-in-form__block-info
            blockInfo.classList.add('hidden');
         }
         if (submitButton) { // Remove the disabled attribute from the button
            submitButton.removeAttribute('disabled');
         }
      } else { // If there is no 'valid' class, add the 'hidden' class back and set the disabled attribute
         if (blockInfo) {
            blockInfo.classList.remove('hidden');
         }
         if (submitButton) {
            submitButton.setAttribute('disabled', 'true');
         }
      }
   }
   const observer2 = new MutationObserver(checkValidClass); // Track changes to the valid class
   observer2.observe(wrapFieldsNumber, {
      attributes: true, // track attribute changes
      attributeFilter: ['class'] // track only class changes
   });
   checkValidClass(); // We also run the check when the page initially loads
   // Show the submit button when clicking the Confirm button
   let formBlockButton = document.querySelector('.log-in-form__block-button');
   formBlockButton.addEventListener('click', () => {
      formBlockButton.classList.add('hidden');
      document.querySelector('.log-in-form__block-info').classList.add('hidden');
      document.querySelector('.log-in-form__wrap-submit.one-button-submit').classList.add('show');
   });

});