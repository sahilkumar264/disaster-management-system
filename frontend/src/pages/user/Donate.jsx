import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { donate } from "../../api/donationApi";

const schema = z
  .object({
    donorName: z.string().min(2, "Name must be at least 2 characters"),
    donorContact: z
      .string()
      .min(10, "Contact must be at least 10 digits")
      .regex(/^[0-9]+$/, "Only numbers allowed"),
    donationType: z.enum(["Money", "Food", "Clothes"]),
    amount: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.donationType === "Money") {
        return data.amount && Number(data.amount) > 0;
      }

      return true;
    },
    {
      message: "Valid amount is required for money donation",
      path: ["amount"],
    }
  );

const Donate = () => {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      donationType: "Money",
    },
  });

  const donationType = watch("donationType");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const payload = {
        ...data,
        amount: data.donationType === "Money" ? Number(data.amount) : undefined,
      };

      await donate(payload);
      toast.success("Donation successful");
      reset({ donorName: "", donorContact: "", donationType: "Money", amount: "" });
    } catch (error) {
      console.error(error);
      toast.error("Donation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md rounded bg-white p-6 shadow"
      >
        <h2 className="mb-4 text-center text-xl font-bold">Make a Donation</h2>

        <input
          {...register("donorName")}
          placeholder="Your Name"
          className="input"
        />
        <p className="text-sm text-red-500">{errors.donorName?.message}</p>

        <input
          {...register("donorContact")}
          placeholder="Contact Number"
          className="input"
        />
        <p className="text-sm text-red-500">{errors.donorContact?.message}</p>

        <select {...register("donationType")} className="input">
          <option value="Money">Money</option>
          <option value="Food">Food</option>
          <option value="Clothes">Clothes</option>
        </select>

        {donationType === "Money" && (
          <>
            <input
              type="number"
              {...register("amount")}
              placeholder="Enter Amount"
              className="input"
            />
            <p className="text-sm text-red-500">{errors.amount?.message}</p>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`mt-3 w-full rounded p-2 text-white ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading ? "Processing..." : "Donate"}
        </button>
      </form>
    </div>
  );
};

export default Donate;
