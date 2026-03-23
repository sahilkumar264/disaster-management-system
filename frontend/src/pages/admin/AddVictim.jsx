import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { addVictim } from "../../api/victimApi";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  age: z.string().min(1, "Age required"),
  gender: z.string().min(1, "Select gender"),
  contactNo: z.string().min(10, "Invalid contact"),
  address: z.string().min(5, "Address required"),
  medicalCondition: z.string().optional(),
  image: z.any().optional(),
});

const AddVictim = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "image" && data[key] !== undefined) {
          formData.append(key, data[key]);
        }
      });

      if (data.image?.[0]) {
        formData.append("image", data.image[0]);
      }

      await addVictim(formData);
      toast.success("Victim added successfully");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add victim");
    }
  };

  return (
    <div className="max-w-lg">
      <h2 className="mb-4 text-xl font-bold">Add Victim</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name")} placeholder="Name" className="input" />
        <p className="text-red-500">{errors.name?.message}</p>

        <input {...register("age")} placeholder="Age" className="input" />
        <p className="text-red-500">{errors.age?.message}</p>

        <select {...register("gender")} className="input">
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <p className="text-red-500">{errors.gender?.message}</p>

        <input
          {...register("contactNo")}
          placeholder="Contact"
          className="input"
        />
        <p className="text-red-500">{errors.contactNo?.message}</p>

        <input
          {...register("address")}
          placeholder="Address"
          className="input"
        />
        <p className="text-red-500">{errors.address?.message}</p>

        <input
          {...register("medicalCondition")}
          placeholder="Medical Condition"
          className="input"
        />

        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="input"
        />

        <button className="mt-2 w-full bg-blue-500 p-2 text-white">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddVictim;
