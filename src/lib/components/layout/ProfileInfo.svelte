<script>
    // You can add reactive props for user data
    export let userName = "Misha Gurevich";
    export let userRole = "Admin";
  </script>
  
  <div class="flex items-center gap-2">
    <div class="relative">
    </div>
    <div>
      <div class="font-medium">{userName}</div>
      <div class="text-end text-xs text-gray-500">{userRole}</div>
    </div>
  </div>