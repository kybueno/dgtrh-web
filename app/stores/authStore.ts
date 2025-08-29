
// composables/useProfileStore.ts
export const useAuthStore = () => {
  // Global state using useState (Nuxt's built-in state management)
  const loggedUserProfile = useState<WorkerProfile | null>(
    "logged-user-profile",
    () => null
  );

  const supabase = useSupabaseClient();
  const loggedUser = useSupabaseUser();
  const fetchLoggedUserProfile = async () => {
    try {
      if (!loggedUser.value) throw new Error("No logged user");
      const { data, error } = await supabase
        .from("profiles_with_worker")
        .select(`*`)
        .eq("user_id", loggedUser.value.id)
        .single();

      if (error) throw error;

      loggedUserProfile.value = data;
      return data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  const clearLoggedUser = () => {
    loggedUserProfile.value = null;
  };

  return {
    loggedUserProfile: readonly(loggedUserProfile),
    fetchLoggedUserProfile,
    clearLoggedUser,
  };
};
