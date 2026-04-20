document.addEventListener("DOMContentLoaded", function () {

   let notificationsCustomAlerts = document.querySelectorAll('.notifications__custom-alert');
   if (notificationsCustomAlerts.length > 0) {
      notificationsCustomAlerts.forEach(alert => {
         // Кнопка закрытия
         let closeButton = alert.querySelector('.notifications__custom-alertClose');
         if (closeButton) {
            closeButton.addEventListener('click', () => hideAlert(alert));
         }
         // Все ссылки внутри notifications__custom-alertButtons
         let alertButtons = alert.querySelector('.notifications__custom-alertButtons');
         if (alertButtons) {
            alertButtons.querySelectorAll('a').forEach(link => {
               link.addEventListener('click', () => hideAlert(alert));
            });
         }
      });
   }
   function hideAlert(alert) {
      alert.classList.remove('show');
   }

   let notificationsBlocksRemove = document.querySelectorAll('.notifications__blockRemove');
   if (notificationsBlocksRemove.length > 0) {
      notificationsBlocksRemove.forEach(notificationsBlockRemove => {
         notificationsBlockRemove.addEventListener('click', () => {
            notificationsBlockRemove.parentNode.remove();
         });
      });
   }

   // DEMO
   setTimeout(() => document.querySelector('.notifications__custom-alert').classList.add('show'), 600);
});