import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api-client";

type UpdateProfileData = {
  name?: string;
  bio?: string;
  avatar?: File;
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const formData = new FormData();

      if (data.name) {
        formData.append("name", data.name);
      }
      if (data.bio !== undefined) {
        formData.append("bio", data.bio);
      }
      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      return api.put("profile/", { body: formData }).json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending,
    error: mutation.error,
  };
};
