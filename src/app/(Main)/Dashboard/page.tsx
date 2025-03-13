"use client";
import InputBox from "@/app/Components/LandingPage/InputBox/InputBox";
import { AI_ASSISTANTS, URL } from "@/app/constants/constants";
import { addUser } from "@/Store/UserStore";
import { credFetcher } from "@/utlis/credFetcher";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {
  const [values, setvalues] = useState<string>("");
  const [assistence, setAssitence] = useState(AI_ASSISTANTS);

  const credOrg = useSelector((store: any) => {
    return store.user;
  });

  const router = useRouter();

  const dispatch = useDispatch();

  const [selectedData, setselecteddata] = useState([]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    console.log(value);
    setvalues(value);

    const newFilterData = AI_ASSISTANTS.filter((item) => {
      return item.name.toLowerCase().includes(value.toLowerCase());
    });
    setAssitence(newFilterData);
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const valuesData = AI_ASSISTANTS[value];

    for (let i = 0; i < selectedData.length; i++) {
      if (selectedData[i].id === value) {
        const filterDataMain = selectedData.filter((item) => {
          return item.id !== value;
        });

        setselecteddata(filterDataMain);
        return;
      }
    }

    setselecteddata((prev: any) => {
      return [...prev, { valuesData, id: value, userId: credOrg.id }];
    });
  };

  console.log(selectedData);

  const handleclick = async () => {
    try {
      const data = await fetch(`${URL}/selectai`, {
        method: "POST",
        headers: {
          "contect-type": "application/json",
        },
        body: JSON.stringify(selectedData),
      });

      const resData = await data.json();
      if (resData?.success) {
        alert("data is Inserted Sucessfully ");

        router.push("/chatsection");
      } else {
        alert("data is Not instered");
      }
    } catch (e) {
      console.log("THere is Some errror in Fetching the User data " + e);
    }
  };

  useEffect(() => {
    const datfetch = async () => {
      const data = await credFetcher();

      dispatch(addUser(data));
    };
    datfetch();
  }, []);

  useEffect(() => {
    const datfetch = async () => {
      if (!credOrg.id) return;
      const data = await fetch(`${URL}/${credOrg.id}`);
      const resData = await data.json();
      if (resData.success) {
        router.push("/chatsection");
      }
    };
    datfetch();
  }, [credOrg]);

  return (
    <div className="p-10">
      <h1 className="lg:text-4xl font-bold mb-5 md:text-2xl sm:text-xl flex justify-center items-center ">
        Ai Assistence
      </h1>
      <div className="w-[30%] m-auto mb-10">
        <InputBox
          onDataChange={handleSearchChange}
          name="search"
          placeholder="Search Ai"
          value={values}
        />
      </div>
      <div className="flex justify-end p-3 m-2 mb-2.5">
        <button
          onClick={handleclick}
          disabled={!(selectedData?.length > 0)}
          className={`p-2 m-2 rounded-lg shadow-2xl transition-all duration-300 
    ${
      selectedData?.length > 0
        ? "bg-red-600 text-white cursor-pointer hover:bg-red-700"
        : "bg-gray-400 text-gray-200 cursor-not-allowed"
    }
  `}
        >
          Continue
        </button>
      </div>

      <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-2 gap-10">
        {assistence?.length > 0 ? (
          assistence?.map((item, index) => (
            <div
              key={index}
              className="w-[300px] relative h-[300px] flex items-center justify-center flex-col  bg-gray-200 rounded-lg overflow-hidden text-black p-5 m-5"
            >
              <div className="absolute  top-0 left-0 p-2 ml-2">
                <input
                  type="checkbox"
                  className="w-6 h-6 cursor-pointer accent-blue-500"
                  value={index}
                  name={item.name}
                  onChange={handleCheckBoxChange}
                />
              </div>
              {/* Ensuring all images are of equal size */}
              <div>
                <Image
                  src={item.src}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="w-full h-full cursor-pointer "
                />
              </div>
              <div className="text-2xl font-semibold font-sans ">
                {item?.name}
              </div>
            </div>
          ))
        ) : (
          <div className="text-white w-[100vw] m-auto text-center flex justify-center items-center font-extrabold text-4xl">
            No Assistence Found{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
