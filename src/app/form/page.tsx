"use client";
import { useState } from "react";

function form() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      setErrors({ ...errors, email: "Please enter a valid email" });
    }
    if (formData.password.length < 8) {
      setErrors({
        ...errors,
        password: "Password must be at least 8 characters",
      });
    }
    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: "Passwords do not match" });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateForm();
    if (Object.values(errors).every((error) => error === "")) {
      console.log(formData);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen shadow-sm">
      <h1 className="">Form Validation App</h1>
      <form onSubmit={handleSubmit}>
        <div className="p-4 size-8">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div className="p-4 size-8">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>
        <div className="p-4 size-8">
          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
        </div>
        <button className="p-4" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default form;
