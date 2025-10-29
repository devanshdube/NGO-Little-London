import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import SignInputField from "../../Components/SignInputField";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is Required";
    if (!formData.password) newErrors.password = "Password is Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log(formData);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0c18] text-white px-4">
      <div className="bg-[#111326] p-10 rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg transition-all duration-300">
        <h2 className="text-3xl font-semibold mb-3 text-center">Sign In</h2>
        <p className="text-sm text-gray-400 mb-8 text-center">
          Enter your email and password to login
        </p>

        <form onSubmit={handleSubmit}>
          <SignInputField
            lable="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            error={errors.email}
            icon={Mail}
          />

          <SignInputField
            lable="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            error={errors.password}
            icon={Lock}
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 mt-2 rounded-md font-semibold transition-all text-sm tracking-wide shadow-md hover:shadow-purple-700/40"
          >
            SIGN IN
          </button>
        </form>

        <div className="flex items-center my-8">
          <hr className="flex-1 border-gray-700" />
          <span className="px-3 text-gray-500 text-sm">Or continue with</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <a href="#" className="text-purple-400 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
