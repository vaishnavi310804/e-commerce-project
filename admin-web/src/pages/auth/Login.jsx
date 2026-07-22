import React from 'react'
import LoginForm from "../../components/auth/LoginForm"
import logo from "../../assets/logo2.png"

const Login = () => {
  return (
    <div className="min-h-screen bg-[#F8F7FF] flex">

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#6C63FF] to-[#8B5CF6] relative overflow-hidden">


        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-center px-20 text-white">
          <img
            src={logo}
            alt="ShopEase Logo"
            className="w-32 h-32 mb-2 object-contain"
          />

          <h1 className="text-5xl font-bold leading-tight">
            ShopEase <br /> Admin
          </h1>

          <p className="mt-6 text-lg text-white/90 max-w-md leading-8">
            Manage your products, orders, customers and business insights from
            one beautiful dashboard.
          </p>

          <div className="mt-12 flex gap-8">
            <div>
              <h2 className="text-3xl font-bold">10K+</h2>
              <p className="text-white/80">Products Managed</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">5K+</h2>
              <p className="text-white/80">Orders Processed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login
