<script>
    // You can add reactive props for user data
    export let userName = "Dwayne Tatum";
    export let userRole = "CEO Assistant";
  </script>
  
  <div class="flex items-center gap-2">
    <div class="relative">
    </div>
    <div>
      <div class="font-medium">{userName}</div>
      <div class="text-xs text-gray-500">{userRole}</div>
    </div>
  </div>