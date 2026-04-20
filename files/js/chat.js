document.addEventListener("DOMContentLoaded", function () {
   var parentTabs = document.querySelectorAll('.chat__asideButtons .chat__asideButton');
   parentTabs.forEach(function (parentTab) {
      parentTab.addEventListener('click', function () {
         var parentTabId = this.getAttribute('data-chat-tab');
         var correspondingParentTabContent = document.querySelector('.chat__list-contacts[data-chat-tabcontent="' + parentTabId + '"]');

         // Remove active classes from all parent tabs and contents
         document.querySelectorAll('.chat__asideButtons .chat__asideButton').forEach(function (tab) {
            tab.classList.remove('action');
         });
         document.querySelectorAll('.chat__list-contacts').forEach(function (content) {
            content.classList.remove('list-contacts-active');
         });

         // Add active classes to the selected parent tab and content
         this.classList.add('action');
         correspondingParentTabContent.classList.add('list-contacts-active');
      });
   });
   var subTabs = document.querySelectorAll('.chat__user-wrap-content, .show-messages');
   subTabs.forEach(function (subTab) {
      subTab.addEventListener('click', function (event) {
         event.stopPropagation(); // Stop event bubbling

         var subTabId = this.getAttribute('data-tab');
         var correspondingSubTabContent = document.querySelector('.chat__item .chat__wrap-message[data-tabcontent="' + subTabId + '"]');

         // Remove active classes from all sub-tabs and contents
         document.querySelectorAll('.chat__user-wrap-content, .show-messages').forEach(function (subTab) {
            subTab.classList.remove('chat__wrap-message');
         });
         document.querySelectorAll('.chat__wrap-message').forEach(function (content) {
            content.classList.remove('active-message');
         });

         // Add active classes to the selected sub-tab and content
         //this.classList.add('subTab-active');
         correspondingSubTabContent.classList.add('active-message');
      });
   });

   // Adding class user-sms-before-author
   const smsBlocks = document.querySelectorAll('.user-sms');
   smsBlocks.forEach((block, index) => {
      if (block.classList.contains('author') && index > 0) {
         const prevBlock = smsBlocks[index - 1];
         if (!prevBlock.classList.contains('author')) {
            prevBlock.classList.add('user-sms-before-author');
         }
      }
   });

   // When a scroll appears, the scroll-appeared class is added
   function checkOverflowInActiveMessage() { // Function to check for content overflow
      const activeBlock = document.querySelector('.chat__wrap-message.active-message');
      if (!activeBlock) return;
      // Check all messages inside the active block
      const messages = activeBlock.querySelectorAll('.chat__wrap-message-message');
      messages.forEach(message => {
         if (message.scrollHeight > message.clientHeight) {
            message.classList.add('scroll-appeared');
         } else {
            message.classList.remove('scroll-appeared');
         }
      });
   }
   const classObserver = new MutationObserver(mutations => { // Class change observer (to track active-message changes)
      mutations.forEach(mutation => {
         if (mutation.attributeName === 'class') {
            checkOverflowInActiveMessage();
         }
      });
   });
   const contentObserver = new MutationObserver(mutations => { // Watch for content changes (to track new messages being added)
      mutations.forEach(mutation => {
         if (mutation.type === 'childList' || mutation.type === 'subtree') {
            checkOverflowInActiveMessage();
         }
      });
   });
   // Watch all chat__wrap-message blocks
   const chatWrapMessages = document.querySelectorAll('.chat__wrap-message');
   chatWrapMessages.forEach(block => {
      classObserver.observe(block, { attributes: true }); // Track attribute changes (active-message)
      contentObserver.observe(block, { childList: true, subtree: true }); // Track content changes
   });
   window.addEventListener('resize', checkOverflowInActiveMessage); // Recheck when window resizes
   checkOverflowInActiveMessage(); // Initialization on boot

   // Generate SMS block
   function addMessage(inputField) { 
      const message = inputField.value.trim();
      if (!message) return; // If the field is empty, do not send the message
      const parentBlock = inputField.closest('.chat__wrap-message');
      const messageContainer = parentBlock.querySelector('.chat__wrap-message-message');
      // Create a new message element
      const messageBlock = document.createElement('div');
      messageBlock.classList.add('user-sms', 'author');
      const messageText = document.createElement('p');
      messageText.classList.add('user-sms-text');
      messageText.textContent = message;
      const messageTime = document.createElement('span');
      messageTime.classList.add('user-sms-time');
      const currentTime = new Date();
      const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      messageTime.textContent = formattedTime;
      // Add SVG icon (if needed)
      const svgIcon = ` <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.8"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.5115 2.96526C11.7722 2.64339 11.7227 2.17111 11.4008 1.91039C11.0789 1.64968 10.6066 1.69925 10.3459 2.02112L4.38829 9.3761L1.95729 6.96111C1.66343 6.66919 1.18855 6.67075 0.896631 6.96461C0.604707 7.25847 0.606277 7.73335 0.900137 8.02527L3.92003 11.0253C4.07051 11.1748 4.27725 11.2535 4.48905 11.2421C4.70084 11.2307 4.8979 11.1301 5.0314 10.9653L11.5115 2.96526ZM16.4938 2.98631C16.7662 2.6742 16.7339 2.20042 16.4218 1.9281C16.1097 1.65577 15.6359 1.68803 15.3636 2.00014L8.90609 9.40117L8.45379 8.9577C8.15803 8.6677 7.68318 8.67238 7.39318 8.96814C7.10319 9.26391 7.10787 9.73876 7.40363 10.0288L8.42353 11.0288C8.57096 11.1733 8.77147 11.2507 8.97779 11.2427C9.18411 11.2346 9.37799 11.1419 9.51374 10.9863L16.4938 2.98631Z" fill="#090909"/></g></svg>`;
      messageTime.innerHTML += svgIcon;
      // Add elements to the message
      messageBlock.appendChild(messageText);
      messageBlock.appendChild(messageTime);
      messageContainer.appendChild(messageBlock); // Add message to container
      messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll down to the last message
      inputField.value = ''; // Clear the input field
      // Remove 'the-field-is-not-empty' class from the parent block after adding the message
      const messageFooter = inputField.closest('.chat__wrap-message-footer');
      messageFooter.classList.remove('the-field-is-not-empty');
   }
   document.querySelectorAll('.chat__message-field').forEach(input => { // Handler for Enter key and mobile send button
      input.addEventListener('keypress', (e) => {
         if (e.key === 'Enter') {
            addMessage(input);
         }
      });
      input.addEventListener('input', (e) => { // For mobile send button
         if (e.inputType === 'insertLineBreak') {
            addMessage(input);
         }
      });
   });
   document.querySelectorAll('.send-sms').forEach(button => { // Handler for all send-sms buttons
      button.addEventListener('click', () => {
         const inputField = button.closest('.chat__wrap-message-footer').querySelector('.chat__message-field'); // Get the input field from the same parent
         addMessage(inputField); // Add the message
      });
   });

   // Generate SMS block with image
   const fileInputs = document.querySelectorAll('.chat__wrap-message-footer .wrap-select-file input[type="file"]');
   fileInputs.forEach(input => {
      input.addEventListener('change', (event) => {
         const file = event.target.files[0];
         if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
               const imageUrl = e.target.result;
               const messageBlock = document.createElement('div');
               messageBlock.classList.add('user-sms', 'img-author');
               messageBlock.innerHTML = `
                  <img src="${imageUrl}" alt="Uploaded Image">
                  <span class="user-sms-time">${getCurrentTime()}</span>
               `;
               const messageContainer = input.closest('.chat__wrap-message').querySelector('.chat__wrap-message-message');
               messageContainer.appendChild(messageBlock);
               requestAnimationFrame(() => { // Scroll down while waiting for DOM to update
                  messageContainer.scrollTop = messageContainer.scrollHeight;
               });
               input.value = ''; // Clean up the input
            };
            reader.readAsDataURL(file);
         }
      });
   });
   function getCurrentTime() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
   }

   // Adding the active-message class when changing screen orientation (for screens larger than 861px)
   const chatWrapMessage = document.querySelector('.chat__wrap-message.no-chat-selected');
   const handleScreenOrientation = () => { // Function to check screen width and add/remove class
      if (window.innerWidth > 860) { // Add active-message class if screen width > 860px
         if (chatWrapMessage) {
            chatWrapMessage.classList.add('active-message');
         }
      } else { // Remove the active-message class if the screen width is <= 860px
         if (chatWrapMessage) {
            chatWrapMessage.classList.remove('active-message');
         }
      }
   };
   window.addEventListener('resize', handleScreenOrientation); // Track screen orientation changes
   handleScreenOrientation(); // Call it immediately for initial loading

   // Removing the active-message class when clicking on a button with the chat__wrap-message-close class (for screens up to 860px)
   const closeButtons = document.querySelectorAll('.chat__wrap-message-close');
   closeButtons.forEach(button => {
      button.addEventListener('click', () => {
         if (window.innerWidth <= 860) {
            const parentMessage = button.closest('.chat__wrap-message');
            if (parentMessage) {
               parentMessage.classList.remove('active-message');
            }
         }
      });
   });

   // Add class the-field-is-not-empty to parent if chat__message-field is not empty
   document.querySelectorAll('.chat__message-field').forEach((messageField) => {
      const checkFieldContent = () => { // Function to check the contents of the field
         const parentElement = messageField.closest('.chat__wrap-message-footer'); // Find the parent block
         if (messageField.value.trim() !== '') {
            parentElement.classList.add('the-field-is-not-empty'); // Add the class if the field is not empty
         } else {
            parentElement.classList.remove('the-field-is-not-empty'); // Remove the class if the field is empty
         }
      };
      messageField.addEventListener('input', checkFieldContent); // Track text input in the field
      checkFieldContent(); // Check initially in case there's already content in the field
   });

   // Menu (Circle with dots)
   document.querySelectorAll('.chat__wrap-message-headerWrapMenu').forEach(menu => {
      const menuButton = menu.querySelector('.chat__wrap-message-headerMenuButton');
      const leaveFeedbackItem = menu.querySelector('.leave-feedback');
   
      // Открытие/закрытие меню
      menuButton.addEventListener('click', () => {
         menu.classList.toggle('show');
      });
   
      // Добавление блока отзыва
      leaveFeedbackItem.addEventListener('click', () => {
         menu.classList.remove('show'); // Закрываем меню
         
         const parentMessage = menu.closest('.chat__wrap-message'); // Находим родительский .chat__wrap-message
         const messageBlock = parentMessage.querySelector('.chat__wrap-message-message'); // Внутри ищем .chat__wrap-message-message
   
         if (!messageBlock) return; // Если нет блока для вставки, выходим
   
         // Проверяем, существует ли уже блок отзыва, чтобы не дублировать
         if (parentMessage.querySelector('.chat__leave-a-review')) return;
   
         // Создаем блок отзыва
         const reviewBlock = document.createElement('div');
         reviewBlock.classList.add('chat__leave-a-review');
         reviewBlock.innerHTML = `<div class="chat__leave-a-reviewHead">
               <h2>Leave a review</h2>
               <div class="columns">
                  <div class="column">
                     <div class="wrap-photo">
                        <div class="block-photo">
                           <img src="images/chat-leave-a-review-photo.jpg" alt="">
                        </div>
                        <h5>Andriy LongNickname</h5>
                     </div>
                  </div>
                  <div class="column">
                     <div class="rate-this-article__wrapStarsRating">
                        ${[1,2,3,4,5].map(num => `
                           <label>
                              <input id="review-rating-${num}" type="radio" name="review-rating" value="${num}">
                              <img class="no-active" src="images/svg/star-post.svg" alt="">
                              <img class="active" src="images/svg/star-post-active.svg" alt="">
                           </label>
                        `).join('')}
                     </div>
                  </div>
               </div>
               <button type="button" class="chat__leave-a-reviewClose">
                  <img src="images/svg/close-block-review-chat.svg" alt="">
               </button>
            </div>
            <div class="chat__leave-a-reviewBlockReview">
               <div class="chat__leave-a-reviewBlockReviewHead">
                  <textarea placeholder="Add a review (optional)"></textarea>
               </div>
               <p>Add a photo (optional)</p>
               <div class="chat__leave-a-reviewContainer">
                  <div class="chat__leave-a-reviewBlockPhoto">
                     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5889 20.5476H14.7221V14.5475H20.7307V13.4142H14.7221V7.28929H13.5889V13.4142H7.47244V14.5475H13.5889V20.5476ZM14.1163 27.1767C12.2705 27.1767 10.5482 26.8288 8.94963 26.133C7.35078 25.4372 5.94823 24.4867 4.74197 23.2817C3.53571 22.0767 2.58443 20.6746 1.88813 19.0755C1.19158 17.4762 0.843304 15.7526 0.843304 13.9048C0.843304 12.0759 1.19121 10.3564 1.88702 8.74622C2.58284 7.13633 3.53326 5.73439 4.73829 4.54041C5.94332 3.34643 7.34538 2.40129 8.94447 1.70498C10.5438 1.00843 12.2674 0.660156 14.1152 0.660156C15.9441 0.660156 17.6636 1.00806 19.2738 1.70388C20.8837 2.39969 22.2856 3.34397 23.4796 4.53673C24.6736 5.72948 25.6187 7.13215 26.315 8.74475C27.0116 10.3571 27.3598 12.0768 27.3598 13.9037C27.3598 15.7495 27.0119 17.4718 26.3161 19.0704C25.6203 20.6692 24.676 22.0696 23.4833 23.2714C22.2905 24.473 20.8878 25.4243 19.2752 26.1252C17.6629 26.8262 15.9432 27.1767 14.1163 27.1767ZM14.12 26.0435C17.4807 26.0435 20.3387 24.8645 22.694 22.5065C25.0491 20.1485 26.2266 17.2796 26.2266 13.9C26.2266 10.5393 25.0514 7.68127 22.701 5.32596C20.3504 2.9709 17.4839 1.79337 14.1016 1.79337C10.7342 1.79337 7.87153 2.96857 5.51353 5.31896C3.15552 7.6696 1.97652 10.5361 1.97652 13.9184C1.97652 17.2858 3.15552 20.1485 5.51353 22.5065C7.87153 24.8645 10.7404 26.0435 14.12 26.0435Z" fill="#1C1B1F"/>
                     </svg>
                     <p>Add Photo</p>
                     <input type="file" title="">
                  </div>
                  <div class="chat__leave-a-reviewBlockPhoto">
                     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5889 20.5476H14.7221V14.5475H20.7307V13.4142H14.7221V7.28929H13.5889V13.4142H7.47244V14.5475H13.5889V20.5476ZM14.1163 27.1767C12.2705 27.1767 10.5482 26.8288 8.94963 26.133C7.35078 25.4372 5.94823 24.4867 4.74197 23.2817C3.53571 22.0767 2.58443 20.6746 1.88813 19.0755C1.19158 17.4762 0.843304 15.7526 0.843304 13.9048C0.843304 12.0759 1.19121 10.3564 1.88702 8.74622C2.58284 7.13633 3.53326 5.73439 4.73829 4.54041C5.94332 3.34643 7.34538 2.40129 8.94447 1.70498C10.5438 1.00843 12.2674 0.660156 14.1152 0.660156C15.9441 0.660156 17.6636 1.00806 19.2738 1.70388C20.8837 2.39969 22.2856 3.34397 23.4796 4.53673C24.6736 5.72948 25.6187 7.13215 26.315 8.74475C27.0116 10.3571 27.3598 12.0768 27.3598 13.9037C27.3598 15.7495 27.0119 17.4718 26.3161 19.0704C25.6203 20.6692 24.676 22.0696 23.4833 23.2714C22.2905 24.473 20.8878 25.4243 19.2752 26.1252C17.6629 26.8262 15.9432 27.1767 14.1163 27.1767ZM14.12 26.0435C17.4807 26.0435 20.3387 24.8645 22.694 22.5065C25.0491 20.1485 26.2266 17.2796 26.2266 13.9C26.2266 10.5393 25.0514 7.68127 22.701 5.32596C20.3504 2.9709 17.4839 1.79337 14.1016 1.79337C10.7342 1.79337 7.87153 2.96857 5.51353 5.31896C3.15552 7.6696 1.97652 10.5361 1.97652 13.9184C1.97652 17.2858 3.15552 20.1485 5.51353 22.5065C7.87153 24.8645 10.7404 26.0435 14.12 26.0435Z" fill="#1C1B1F"/>
                     </svg>
                     <p>Add Photo</p>
                     <input type="file" title="">
                  </div>
                  <div class="chat__leave-a-reviewBlockPhoto">
                     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5889 20.5476H14.7221V14.5475H20.7307V13.4142H14.7221V7.28929H13.5889V13.4142H7.47244V14.5475H13.5889V20.5476ZM14.1163 27.1767C12.2705 27.1767 10.5482 26.8288 8.94963 26.133C7.35078 25.4372 5.94823 24.4867 4.74197 23.2817C3.53571 22.0767 2.58443 20.6746 1.88813 19.0755C1.19158 17.4762 0.843304 15.7526 0.843304 13.9048C0.843304 12.0759 1.19121 10.3564 1.88702 8.74622C2.58284 7.13633 3.53326 5.73439 4.73829 4.54041C5.94332 3.34643 7.34538 2.40129 8.94447 1.70498C10.5438 1.00843 12.2674 0.660156 14.1152 0.660156C15.9441 0.660156 17.6636 1.00806 19.2738 1.70388C20.8837 2.39969 22.2856 3.34397 23.4796 4.53673C24.6736 5.72948 25.6187 7.13215 26.315 8.74475C27.0116 10.3571 27.3598 12.0768 27.3598 13.9037C27.3598 15.7495 27.0119 17.4718 26.3161 19.0704C25.6203 20.6692 24.676 22.0696 23.4833 23.2714C22.2905 24.473 20.8878 25.4243 19.2752 26.1252C17.6629 26.8262 15.9432 27.1767 14.1163 27.1767ZM14.12 26.0435C17.4807 26.0435 20.3387 24.8645 22.694 22.5065C25.0491 20.1485 26.2266 17.2796 26.2266 13.9C26.2266 10.5393 25.0514 7.68127 22.701 5.32596C20.3504 2.9709 17.4839 1.79337 14.1016 1.79337C10.7342 1.79337 7.87153 2.96857 5.51353 5.31896C3.15552 7.6696 1.97652 10.5361 1.97652 13.9184C1.97652 17.2858 3.15552 20.1485 5.51353 22.5065C7.87153 24.8645 10.7404 26.0435 14.12 26.0435Z" fill="#1C1B1F"/>
                     </svg>
                     <p>Add Photo</p>
                     <input type="file" title="">
                  </div>
                  <div class="chat__leave-a-reviewBlockPhoto">
                     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5889 20.5476H14.7221V14.5475H20.7307V13.4142H14.7221V7.28929H13.5889V13.4142H7.47244V14.5475H13.5889V20.5476ZM14.1163 27.1767C12.2705 27.1767 10.5482 26.8288 8.94963 26.133C7.35078 25.4372 5.94823 24.4867 4.74197 23.2817C3.53571 22.0767 2.58443 20.6746 1.88813 19.0755C1.19158 17.4762 0.843304 15.7526 0.843304 13.9048C0.843304 12.0759 1.19121 10.3564 1.88702 8.74622C2.58284 7.13633 3.53326 5.73439 4.73829 4.54041C5.94332 3.34643 7.34538 2.40129 8.94447 1.70498C10.5438 1.00843 12.2674 0.660156 14.1152 0.660156C15.9441 0.660156 17.6636 1.00806 19.2738 1.70388C20.8837 2.39969 22.2856 3.34397 23.4796 4.53673C24.6736 5.72948 25.6187 7.13215 26.315 8.74475C27.0116 10.3571 27.3598 12.0768 27.3598 13.9037C27.3598 15.7495 27.0119 17.4718 26.3161 19.0704C25.6203 20.6692 24.676 22.0696 23.4833 23.2714C22.2905 24.473 20.8878 25.4243 19.2752 26.1252C17.6629 26.8262 15.9432 27.1767 14.1163 27.1767ZM14.12 26.0435C17.4807 26.0435 20.3387 24.8645 22.694 22.5065C25.0491 20.1485 26.2266 17.2796 26.2266 13.9C26.2266 10.5393 25.0514 7.68127 22.701 5.32596C20.3504 2.9709 17.4839 1.79337 14.1016 1.79337C10.7342 1.79337 7.87153 2.96857 5.51353 5.31896C3.15552 7.6696 1.97652 10.5361 1.97652 13.9184C1.97652 17.2858 3.15552 20.1485 5.51353 22.5065C7.87153 24.8645 10.7404 26.0435 14.12 26.0435Z" fill="#1C1B1F"/>
                     </svg>
                     <p>Add Photo</p>
                     <input type="file" title="">
                  </div>
                  <div class="chat__leave-a-reviewBlockPhoto">
                     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5889 20.5476H14.7221V14.5475H20.7307V13.4142H14.7221V7.28929H13.5889V13.4142H7.47244V14.5475H13.5889V20.5476ZM14.1163 27.1767C12.2705 27.1767 10.5482 26.8288 8.94963 26.133C7.35078 25.4372 5.94823 24.4867 4.74197 23.2817C3.53571 22.0767 2.58443 20.6746 1.88813 19.0755C1.19158 17.4762 0.843304 15.7526 0.843304 13.9048C0.843304 12.0759 1.19121 10.3564 1.88702 8.74622C2.58284 7.13633 3.53326 5.73439 4.73829 4.54041C5.94332 3.34643 7.34538 2.40129 8.94447 1.70498C10.5438 1.00843 12.2674 0.660156 14.1152 0.660156C15.9441 0.660156 17.6636 1.00806 19.2738 1.70388C20.8837 2.39969 22.2856 3.34397 23.4796 4.53673C24.6736 5.72948 25.6187 7.13215 26.315 8.74475C27.0116 10.3571 27.3598 12.0768 27.3598 13.9037C27.3598 15.7495 27.0119 17.4718 26.3161 19.0704C25.6203 20.6692 24.676 22.0696 23.4833 23.2714C22.2905 24.473 20.8878 25.4243 19.2752 26.1252C17.6629 26.8262 15.9432 27.1767 14.1163 27.1767ZM14.12 26.0435C17.4807 26.0435 20.3387 24.8645 22.694 22.5065C25.0491 20.1485 26.2266 17.2796 26.2266 13.9C26.2266 10.5393 25.0514 7.68127 22.701 5.32596C20.3504 2.9709 17.4839 1.79337 14.1016 1.79337C10.7342 1.79337 7.87153 2.96857 5.51353 5.31896C3.15552 7.6696 1.97652 10.5361 1.97652 13.9184C1.97652 17.2858 3.15552 20.1485 5.51353 22.5065C7.87153 24.8645 10.7404 26.0435 14.12 26.0435Z" fill="#1C1B1F"/>
                     </svg>
                     <p>Add Photo</p>
                     <input type="file" title="">
                  </div>
                  <div class="chat__leave-a-reviewBlockPhoto">
                     <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.5889 20.5476H14.7221V14.5475H20.7307V13.4142H14.7221V7.28929H13.5889V13.4142H7.47244V14.5475H13.5889V20.5476ZM14.1163 27.1767C12.2705 27.1767 10.5482 26.8288 8.94963 26.133C7.35078 25.4372 5.94823 24.4867 4.74197 23.2817C3.53571 22.0767 2.58443 20.6746 1.88813 19.0755C1.19158 17.4762 0.843304 15.7526 0.843304 13.9048C0.843304 12.0759 1.19121 10.3564 1.88702 8.74622C2.58284 7.13633 3.53326 5.73439 4.73829 4.54041C5.94332 3.34643 7.34538 2.40129 8.94447 1.70498C10.5438 1.00843 12.2674 0.660156 14.1152 0.660156C15.9441 0.660156 17.6636 1.00806 19.2738 1.70388C20.8837 2.39969 22.2856 3.34397 23.4796 4.53673C24.6736 5.72948 25.6187 7.13215 26.315 8.74475C27.0116 10.3571 27.3598 12.0768 27.3598 13.9037C27.3598 15.7495 27.0119 17.4718 26.3161 19.0704C25.6203 20.6692 24.676 22.0696 23.4833 23.2714C22.2905 24.473 20.8878 25.4243 19.2752 26.1252C17.6629 26.8262 15.9432 27.1767 14.1163 27.1767ZM14.12 26.0435C17.4807 26.0435 20.3387 24.8645 22.694 22.5065C25.0491 20.1485 26.2266 17.2796 26.2266 13.9C26.2266 10.5393 25.0514 7.68127 22.701 5.32596C20.3504 2.9709 17.4839 1.79337 14.1016 1.79337C10.7342 1.79337 7.87153 2.96857 5.51353 5.31896C3.15552 7.6696 1.97652 10.5361 1.97652 13.9184C1.97652 17.2858 3.15552 20.1485 5.51353 22.5065C7.87153 24.8645 10.7404 26.0435 14.12 26.0435Z" fill="#1C1B1F"/>
                     </svg>
                     <p>Add Photo</p>
                     <input type="file" title="">
                  </div>
               </div>
            </div>
            <button type="button" class="chat__leave-a-reviewButton" disabled>Publish</button>`;
   
         messageBlock.appendChild(reviewBlock);
   
         // Прокрутка вниз к добавленному блоку
         reviewBlock.scrollIntoView({ block: 'end' });
   
         // Закрытие блока отзыва
         reviewBlock.querySelector('.chat__leave-a-reviewClose').addEventListener('click', () => {
            reviewBlock.remove();
         });
      });
   });

   // для созданного блока отзыва
   const observer3 = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
         mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
               if (node.classList.contains("chat__leave-a-review")) {
                  initReviewBlock(node);
               }
               const reviewBlocks = node.querySelectorAll(".chat__leave-a-review");
               reviewBlocks.forEach(initReviewBlock);
            }
         });
      });
   });
   observer3.observe(document.body, { childList: true, subtree: true });
   
   function initReviewBlock(reviewBlock) {
      const ratingInputs = reviewBlock.querySelectorAll('input[name="review-rating"]');
      const submitButton = reviewBlock.querySelector('.chat__leave-a-reviewButton');
      const photoContainer = reviewBlock.querySelector('.chat__leave-a-reviewBlockPhoto');
   
      if (!submitButton || !photoContainer) return;
   
      // Проверяем выбор рейтинга
      ratingInputs.forEach(input => {
         input.addEventListener("change", () => {
            submitButton.removeAttribute("disabled");
            submitButton.classList.remove("disabled");
         });
      });
   
      // Функция для обработки загрузки изображений
      function handleFileInput(event) {
         const fileInput = event.target;
         if (fileInput.files.length === 0) return;
   
         const file = fileInput.files[0];
         if (!file.type.startsWith("image/")) return;
   
         const reader = new FileReader();
         reader.onload = function (e) {
            if (photoContainer.querySelectorAll(".image-preview").length >= 6) return;
   
            const imageWrapper = document.createElement("div");
            imageWrapper.classList.add("image-preview");
   
            const img = document.createElement("img");
            img.src = e.target.result;
   
            const removeBtn = document.createElement("button");
            removeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.14882 11.2297L0.97168 10.0526L5.14784 5.87641L0.97168 1.72792L2.14882 0.550781L6.32498 4.72694L10.4735 0.550781L11.6506 1.72792L7.47445 5.87641L11.6506 10.0526L10.4735 11.2297L6.32498 7.05355L2.14882 11.2297Z" fill="#1C1B1F"/></svg>';
            removeBtn.classList.add("remove-image");
   
            removeBtn.addEventListener("click", () => {
               imageWrapper.remove();
               if (photoContainer.querySelectorAll(".image-preview").length < 6) {
                  addNewFileInput();
               }
            });
   
            imageWrapper.appendChild(img);
            imageWrapper.appendChild(removeBtn);
            photoContainer.appendChild(imageWrapper);
   
            // Удаляем старый input и создаем новый, если изображений < 6
            fileInput.remove();
            if (photoContainer.querySelectorAll(".image-preview").length < 6) {
               addNewFileInput();
            }
         };
         reader.readAsDataURL(file);
      }
   
      // Функция для добавления нового input file
      function addNewFileInput() {
         const newFileInput = document.createElement("input");
         newFileInput.type = "file";
         newFileInput.title = "";
         newFileInput.classList.add("review-photo-input"); // Добавляем класс для делегирования событий
         photoContainer.appendChild(newFileInput);
      }
   
      // Добавляем делегирование событий для работы со всеми будущими input[type="file"]
      photoContainer.addEventListener("change", (event) => {
         if (event.target.matches('input[type="file"]')) {
            handleFileInput(event);
         }
      });
   
      // Если уже есть input[type="file"], запускаем обработку
      const existingFileInput = photoContainer.querySelector('input[type="file"]');
      if (!existingFileInput) {
         addNewFileInput();
      }
   }
   if (!window.observer3) {
      window.observer3 = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
               if (node.nodeType === 1) {
                  if (node.classList.contains("chat__leave-a-review")) {
                     initReviewBlock(node);
                  }
                  const reviewBlocks = node.querySelectorAll(".chat__leave-a-review");
                  reviewBlocks.forEach(initReviewBlock);
               }
            });
         });
      });
      window.observer3.observe(document.body, { childList: true, subtree: true });
   }
   function initReviewBlock(reviewBlock) {
      const ratingInputs = reviewBlock.querySelectorAll('input[name="review-rating"]');
      const submitButton = reviewBlock.querySelector('.chat__leave-a-reviewButton');
      const photoContainers = reviewBlock.querySelectorAll('.chat__leave-a-reviewBlockPhoto'); // ВСЕ контейнеры
      if (!submitButton || photoContainers.length === 0) return;
      // Проверяем выбор рейтинга
      ratingInputs.forEach(input => {
         input.addEventListener("change", () => {
            submitButton.removeAttribute("disabled");
            submitButton.classList.remove("disabled");
         });
      });
      photoContainers.forEach(photoContainer => {
         // Функция для обработки загрузки изображений
         function handleFileInput(fileInput) {
            fileInput.addEventListener("change", function () {
               if (fileInput.files.length === 0) return;
               const file = fileInput.files[0];
               if (!file.type.startsWith("image/")) return;
               const reader = new FileReader();
               reader.onload = function (e) {
                  if (photoContainer.querySelectorAll(".image-preview").length >= 6) return;
                  const imageWrapper = document.createElement("div");
                  imageWrapper.classList.add("image-preview");
                  const img = document.createElement("img");
                  img.src = e.target.result;
                  const removeBtn = document.createElement("button");
                  removeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.14882 11.2297L0.97168 10.0526L5.14784 5.87641L0.97168 1.72792L2.14882 0.550781L6.32498 4.72694L10.4735 0.550781L11.6506 1.72792L7.47445 5.87641L11.6506 10.0526L10.4735 11.2297L6.32498 7.05355L2.14882 11.2297Z" fill="#1C1B1F"/></svg>';
                  removeBtn.classList.add("remove-image");
                  removeBtn.addEventListener("click", () => {
                     imageWrapper.remove();
                     if (photoContainer.querySelectorAll(".image-preview").length < 6) {
                        addNewFileInput();
                     }
                  });
                  imageWrapper.appendChild(img);
                  imageWrapper.appendChild(removeBtn);
                  photoContainer.appendChild(imageWrapper);
                  // Удаляем старый input и создаем новый, если изображений < 6
                  fileInput.remove();
                  if (photoContainer.querySelectorAll(".image-preview").length < 6) {
                     addNewFileInput();
                  }
               };
               reader.readAsDataURL(file);
            });
         }
         // Функция для добавления нового input file
         function addNewFileInput() {
            const newFileInput = document.createElement("input");
            newFileInput.type = "file";
            newFileInput.title = "";
            photoContainer.appendChild(newFileInput);
            handleFileInput(newFileInput);
         }
         // Запускаем обработку для существующего input
         const existingFileInput = photoContainer.querySelector('input[type="file"]');
         if (existingFileInput) {
            handleFileInput(existingFileInput);
         }
      });
   }

   // Roting form reviews
   function updateStarsRating(rating, starsRating) {
      if (!starsRating) return; // Если блока нет, выходим
      starsRating.classList.remove('rating-1', 'rating-2', 'rating-3', 'rating-4', 'rating-5');
      starsRating.classList.add(`rating-${rating}`);
   }
   function attachRatingHandlers(starsRating) { // Функция для навешивания обработчиков на конкретный блок
      let ratingButtons = starsRating.querySelectorAll('input[type="radio"]');
      if (ratingButtons.length === 0) return; // Если кнопок нет, выходим
      ratingButtons.forEach(button => {
         button.addEventListener('click', () => {
            let rating = parseInt(button.value);
            updateStarsRating(rating, starsRating);
         });
      });
   }
   function initAllRatingBlocks() { // Функция для инициализации всех существующих блоков
      document.querySelectorAll('.rate-this-article__wrapStarsRating').forEach(attachRatingHandlers);
   }
   const observer4 = new MutationObserver(mutations => { // Наблюдатель за появлением новых блоков с рейтингом
      mutations.forEach(mutation => {
         mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // Только для элементов
               let starsBlocks = node.querySelectorAll('.rate-this-article__wrapStarsRating');
               if (node.classList.contains('rate-this-article__wrapStarsRating')) {
                  attachRatingHandlers(node);
               }
               starsBlocks.forEach(attachRatingHandlers);
            }
         });
      });
   });
   observer4.observe(document.body, { childList: true, subtree: true }); // Запускаем наблюдатель за `body`
   initAllRatingBlocks(); // Инициализируем уже существующие блоки при загрузке
});

// Check for touch device
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
   document.addEventListener('DOMContentLoaded', () => {
      // Handler for elements with class .chat__user
      document.querySelectorAll('.chat__user').forEach(user => {
         user.addEventListener('touchstart', (e) => {
            // Remove the show class from all other .chat__user
            document.querySelectorAll('.chat__user').forEach(otherUser => {
               if (otherUser !== user) {
                  otherUser.classList.remove('show');
               }
            });
            user.classList.add('show'); // Add the show class to the .chat__user element
         });
      });

      // Handler for elements with class .show-messages
      document.querySelectorAll('.show-messages').forEach(showMessage => {
         showMessage.addEventListener('click', (e) => {
            const parentUser = showMessage.closest('.chat__user');
            if (parentUser) {
               parentUser.classList.remove('show'); // Remove the show class from all .chat__user
            }
         });
      });

      // Handler for elements with class .delete-chat
      document.querySelectorAll('.delete-chat').forEach(showMessage => {
         showMessage.addEventListener('click', (e) => {
            const deleteChat = showMessage.closest('.chat__user');
            if (deleteChat) {
               deleteChat.classList.remove('show'); // Remove the show class from all .chat__user
            }
         });
      });

      // Handler for elements with class .saved-chat
      document.querySelectorAll('.saved-chat').forEach(showMessage => {
         showMessage.addEventListener('click', (e) => {
            e.preventDefault();
            const savedChat = showMessage.closest('.chat__user');
            if (savedChat) {
               savedChat.classList.remove('show'); // Remove the show class from all .chat__user
            }
         });
      });
   });
}

// If the touch screen adds class... to...
function addTouchClassToChat() {
   const chatElement = document.querySelector('.main.chat');
   if (!chatElement) return; // Check if the element exists
   if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      chatElement.classList.add('touch-device');
   }
}
document.addEventListener('DOMContentLoaded', addTouchClassToChat); // Run the function after the page loads