import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const LoginCard = ({
  title,
  description,
  expectedRole,
  successPath,
  wrongRolePath,
  wrongRoleMessage,
}) => {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const nextUser = await login(form);

      if (nextUser.role !== expectedRole) {
        logout();
        toast.error(wrongRoleMessage);
        navigate(wrongRolePath);
        return;
      }

      toast.success("Logged in successfully");
      navigate(successPath);
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
        <h2 className="mb-2 text-2xl font-bold text-slate-900">{title}</h2>
        <p className="mb-6 text-sm text-slate-600">{description}</p>

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

        <p className="mt-4 text-center text-sm text-slate-500">
          Need an account?{" "}
          <Link to="/register" className="font-semibold text-sky-700">
            Create one here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginCard;
