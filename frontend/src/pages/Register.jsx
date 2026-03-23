import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtpRegistration } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSendOtp = async () => {
    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Name, email, and password are required before sending OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await sendOtp(form.email);

      setOtpRequested(true);
      toast.success(response.msg || "OTP sent successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    try {
      setLoading(true);
      const response = await verifyOtpRegistration(form);

      toast.success("Account created successfully");
      navigate(response.user.role === "admin" ? "/admin" : "/user");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!otpRequested) {
      await handleSendOtp();
      return;
    }

    await handleVerifyAndRegister();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      >
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          Create an account
        </h1>
        <p className="mb-6 text-sm text-slate-600">
          Users and admins both register here. A real OTP is sent to the email
          address you enter, and only `@gov.in` emails become admins after
          verification.
        </p>

        <input
          className="input"
          placeholder="Full name"
          value={form.username}
          onChange={handleChange("username")}
          disabled={loading}
        />

        <input
          className="input"
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange("email")}
          disabled={loading || otpRequested}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange("password")}
          disabled={loading}
        />

        {otpRequested && (
          <>
            <input
              className="input"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange("otp")}
              disabled={loading}
            />
          </>
        )}

        <button
          className="btn btn-primary mt-2 w-full"
          disabled={loading}
          type="submit"
        >
          {loading
            ? "Please wait..."
            : otpRequested
              ? "Verify OTP & Create Account"
              : "Send OTP"}
        </button>
      </form>
    </div>
  );
};

export default Register;
