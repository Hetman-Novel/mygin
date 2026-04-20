$(document).ready(function () { // Make sure the DOM is fully loaded before initializing Select2
    
   $('select').each(function () {
      $(this).select2(); // Initialize Select2
      $(this).on('select2:select', function (e) { // Handler for the value selection event
         const selectedValue = e.params.data.text; // Get the text of the selected value
         const parentBlock = $(this).closest('.wrap-select-form'); // Parent block
         const hiddenField = parentBlock.find('input[type="hidden"]').first(); // Hidden field above select

         // If a hidden field is found, write the selected value into it
         if (hiddenField.length) {
            hiddenField.val(selectedValue);
         }
      });

      // Очищаем скрытое поле при снятии выбора (клик по кресту)
      $(this).on('select2:unselect', function (e) {
         const parentBlock = $(this).closest('.wrap-select-form');
         const hiddenField = parentBlock.find('input[type="hidden"]').first();

         if (hiddenField.length) {
            hiddenField.val('');
         }
      });
   });

   $('#sidebar-filters-categories').select2({
      placeholder: "Category",
      theme: 'sidebar-filters',
      allowClear: true
   });
   $('#sidebar-filters-categories').on('select2:open', function () {

      setTimeout(function () {
         $('.select2-container--open .select2-search__field').attr('placeholder', 'Поиск');
      }, 0);
   });
   $('#sidebar-filters-address').select2({
      placeholder: "Address",
      theme: 'sidebar-filters',
      allowClear: true
   });
   $('#sidebar-filters-address').on('select2:open', function () {

      setTimeout(function () {
         $('.select2-container--open .select2-search__field').attr('placeholder', 'Поиск');
      }, 0);
   });
   $('#sidebar-filters-subcategory').select2({
      placeholder: "Подкатегория",
      theme: 'sidebar-filters',
      allowClear: true
   });
   $('#sidebar-filters-subcategory').on('select2:open', function () {

      setTimeout(function () {
         $('.select2-container--open .select2-search__field').attr('placeholder', 'Поиск');
      }, 0);
   });
   $('#sidebar-filters-country').select2({
      placeholder: "Страна",
      theme: 'sidebar-filters',
      allowClear: true
   });
   $('#sidebar-filters-country').on('select2:open', function () {

      setTimeout(function () {
         $('.select2-container--open .select2-search__field').attr('placeholder', 'Поиск');
      }, 0);
   });
   $('#sidebar-filters-provinces').select2({
      placeholder: "Провинция",
      theme: 'sidebar-filters',
      allowClear: true
   });
   $('#sidebar-filters-provinces').on('select2:open', function () {

      setTimeout(function () {
         $('.select2-container--open .select2-search__field').attr('placeholder', 'Поиск');
      }, 0);
   });
   $('#sidebar-filters-autonomous-community').select2({
      placeholder: "Автономное сообщество",
      theme: 'sidebar-filters',
      allowClear: true
   });
   $('#sidebar-filters-autonomous-community').on('select2:open', function () {

      setTimeout(function () {
         $('.select2-container--open .select2-search__field').attr('placeholder', 'Поиск');
      }, 0);
   });
   $('#sidebar-filters-city').select2({
      placeholder: "Город",
      theme: 'sidebar-filters',
      allowClear: true
   });
   $('#sidebar-filters-city').on('select2:open', function () {

      setTimeout(function () {
         $('.select2-container--open .select2-search__field').attr('placeholder', 'Поиск');
      }, 0);
   });
});

$('select').on('select2:unselecting', function(e) {
   $(this).data('unselecting', true);
});
$('select').on('select2:opening', function(e) {
   if ($(this).data('unselecting')) {
     $(this).removeData('unselecting');
     e.preventDefault();
   }
});

/*
$('#sidebar-filters-categories').on('select2:unselecting', function(e) {
   // Заблокировать открытие выпадающего списка при сбросе
   $(this).data('unselecting', true);
});
 
$('#sidebar-filters-categories').on('select2:opening', function(e) {
   if ($(this).data('unselecting')) {
      $(this).removeData('unselecting');
      e.preventDefault(); // не даём открыться
   }
});
*/