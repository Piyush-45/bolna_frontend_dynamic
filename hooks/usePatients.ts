import { useQuery, useMutation } from "@tanstack/react-query";
import { getPatients, createPatient, callPatient } from "@/lib/api";
import { toast } from "sonner";

export function usePatients(token: string | null) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["patients", token],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      return await getPatients(token);
    },
    enabled: !!token,
    retry: false,
  });

  const create = useMutation({
    mutationFn: async ({ name, phone }: { name: string; phone: string }) => {
      if (!token) throw new Error("Not authenticated");
      return await createPatient(token, name, phone);
    },
    onSuccess: () => {
      toast.success("Patient added successfully");
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to add patient");
    },
  });

  const call = useMutation({
    mutationFn: async (patientId: string) => {
      if (!token) throw new Error("Not authenticated");
      return await callPatient(token, patientId);
    },
    onSuccess: (res) => {
      toast.success("AI call triggered successfully!");
      console.log("📞 Call result:", res);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to trigger call");
    },
  });

  return { patients: data || [], isLoading, error, refetch, create, call };
}
