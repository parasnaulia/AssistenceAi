"use client";
import InputBox from "@/app/Components/LandingPage/InputBox/InputBox";
import { URL } from "@/app/constants/constants";
import { dataObj } from "@/app/Types/Types";
import { addUser } from "@/Store/UserStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [data, setData] = useState<dataObj>({
    name: "",
    email: "",
    password: "",
  });

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState<boolean>(false);

  const credOrg = useSelector((store: any) => {
    return store.user;
  });

  const [isLogin, setIslogin] = useState<boolean>(true);

  const dispatch = useDispatch();

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    const { name, value } = e.target;

    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // alert(process.env.Next_paras);

    // alert("ncie");

    if (data?.name === "" && !isLogin) {
      alert("Name is Required");
      return;
    }
    if (data.email === "" && !data.email.includes("@")) {
      alert("Email Proper Format is Reqiured ");
      return;
    }
    if (data.password === "" && data?.password?.length < 4) {
      alert("Password is Required and It should be Greater then 4");
      return;
    }

    let url: string = "";
    if (isLogin) {
      url = `${URL}/Login`;
    } else {
      url = `${URL}/Signup`;
    }

    try {
      setLoader(true);
      const data1 = await fetch(`${url}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await data1.json();
      // console.log(resData);
      if (resData?.success) {
        // alert(resData?.message + url);
        setData(() => {
          return { name: "", email: "", password: "" };
        });
        setIslogin(true);

        const isData = { ...resData?.data, isLogin: true };
        dispatch(addUser(isData));
        setError(false);

        router.push("/Dashboard");
      } else {
        setError(true);
      }
      // console.log(object)
    } catch (e) {
      setError(true);
      console.log("There is Some error in fetching the data  " + e);
    } finally {
      setLoader(false);
    }
  };
  console.log(data);

  useEffect(() => {
    if (credOrg?.isLogin) {
      router.push("/Dashboard");
    }
  }, [credOrg]);
  return (
    <div className="flex  justify-around items-center h-[80vh] gap-10 w-full mt-16 flex-wrap">
      <div className="flex flex-col justify-between gap-32">
        <div>
          <h1 className="mb-5 font-bold text-5xl">
            {isLogin ? "Login" : "Sign up"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-xl flex gap-10 flex-col">
          {!isLogin && (
            <InputBox
              name="name"
              onDataChange={handleChange}
              value={data?.name}
              placeholder="Name"
              required={true}
            />
          )}
          <InputBox
            name="email"
            onDataChange={handleChange}
            value={data?.email}
            placeholder="Email"
            required={true}
          />
          <InputBox
            name="password"
            onDataChange={handleChange}
            value={data?.password}
            placeholder="Password"
            required={true}
          />
          <div className="flex justify-center items-center">
            {isLogin ? (
              <button
                type="submit"
                className="font-bold text-2xl bg-blue-600 p-4 cursor-pointer"
              >
                {loader ? "Loading..." : "Login In"}
              </button>
            ) : (
              <button
                type="submit"
                className="font-bold text-2xl bg-blue-600 p-4 cursor-pointer"
              >
                {loader ? "Loading..." : "Sign Up"}
              </button>
            )}
          </div>

          {isLogin ? (
            <div>
              New here ? Please Sign Up{" "}
              <button
                className="text-2xl text-blue-500 cursor-pointer"
                onClick={() => {
                  setIslogin(false);
                }}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div>
              Already have an Account? Please Login{" "}
              <button
                type="submit"
                className="text-2xl text-blue-500 cursor-pointer"
                onClick={() => {
                  setIslogin(true);
                }}
              >
                Login
              </button>
            </div>
          )}
          <div>
            {" "}
            <div>
              {error === true ? (
                <div className="text-red-600 ">Something went Wrong</div>
              ) : (
                ""
              )}
            </div>{" "}
          </div>
        </form>
      </div>
      <div>
        <Image
          className="w-full rounded-2xl shadow-2xl "
          src={"/s1.jpeg"}
          width={1000}
          height={500}
          alt="No Image"
        />
      </div>
    </div>
  );
};

export default Login;
