<template>
  <div>
    <UCard>
    <p>No.Exp: {{ loggedUserProfile?.worker?.record_number }}</p>
    <p> Nombre completo: {{ loggedUserProfile?.worker?.first_name }} {{ loggedUserProfile?.worker?.middle_name }} {{ loggedUserProfile?.worker?.last_name }} {{ loggedUserProfile?.worker?.second_last_name }}</p>
     <p>Carnet de Identidad:{{ loggedUserProfile?.worker?.ci }}</p>
     <p>Dirección:{{ loggedUserProfile?.worker?.address }}</p>
     <p>Correo:{{ loggedUserProfile?.worker?.email }}</p>       
     <p>Grupo de Trabajo:{{ loggedUserProfile?.worker?.group_id }}</p>
     <p>Nivel:{{ loggedUserProfile?.worker?.level }}</p>
     <p>Cargo:{{ loggedUserProfile?.worker?.position_code }}</p>
    </UCard>
   
  </div>
</template>

<script lang="ts" setup>


const loggedUserProfile = useState<WorkerProfile | null>(
    "logged-user-profile",
    () => null
  );


  
</script>

