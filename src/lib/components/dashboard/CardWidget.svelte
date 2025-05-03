<script>
    // Props
    export let marginBottom = true;
  </script>
  
  <div class="bg-gray-50 p-6 rounded-xl {marginBottom ? 'mb-6' : ''}">
    <slot></slot>
  </div>