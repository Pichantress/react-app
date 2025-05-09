import { useState } from "react";
import { useNavigate } from "react-router-dom";

const dummyLogin = {
  username: "admin",
  password: "12345678",
};

const AuthPage = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = form;

    if (username === dummyLogin.username && password === dummyLogin.password) {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/table");
    } else {
      setError("username atau password salah");
    }
  };

  return (
    <>
      <title>Login</title>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded"
            value={form.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
            value={form.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default AuthPage;
