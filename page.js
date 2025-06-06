'use client';
import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logoutUser } from "../Redux/slices/userSlice";
import { logout } from "../auth/authFunctions";
export default function Dashboard() {
  // const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();
  const router = useRouter();

  // useEffect(() => {
  //   if (!user) {
  //     router.push("/login");
  //   }
  // }, [user, router]);

  const user = useSelector((state) => state.user.currentUser);
const token = useSelector((state) => state.user.token);

useEffect(() => {
  if (!user || !token) {
    router.push("/login");
  }
}, [user, token]);

  // const handleLogout = async () => {
  //   await logout();
  //   dispatch(logoutUser());
  //   router.push("/login");
  // };

  const handleLogout = async () => {
    await logout(); // Firebase logout
    dispatch(logoutUser()); // clear Redux and localStorage
    router.push("/login");
  };
  
  return user ? (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  ) : null;
}
