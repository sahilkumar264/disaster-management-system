import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const nextUser = await login(form);
      toast.success("Logged in successfully");
      navigate(nextUser.role === "admin" ? "/admin" : "/");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      >
        <h2 className="mb-2 text-2xl font-bold text-slate-900">Login</h2>
        <p className="mb-6 text-sm text-slate-600">
          Users can access search and donation after login. `@gov.in` accounts
          are redirected to the admin dashboard.
        </p>

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              email: event.target.value,
            }))
          }
        />

        <input
          type="password"
          className="input"
          placeholder="Password"
          value={form.password}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
        />

        <button className="btn btn-primary w-full">Login</button>
      </form>
    </div>
  );
};

export default Login;
