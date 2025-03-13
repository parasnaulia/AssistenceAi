"use client";
import { URL } from "@/app/constants/constants";
import { addUser } from "@/Store/UserStore";
import { credFetcher } from "@/utlis/credFetcher";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ChatSection = () => {
  const [assitence, setAssitences] = useState([]);
  const credOrg = useSelector((store: any) => {
    return store.user;
  });
  const [selected, setSelected] = useState(null);
  const dispatch = useDispatch();

  const [chat, setChats] = useState("");

  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    const datafetcher = async () => {
      if (!credOrg.id) {
        return;
      }
      try {
        const data = await fetch(`${URL}/${credOrg.id}`);
        const resData = await data.json();
        if (resData?.success) {
          setAssitences(resData?.data);
        }
      } catch (e) {
        console.log("There is Some Error In Fetching The User Data " + e);
      }
    };
    datafetcher();
  }, [credOrg]);
  console.log(assitence);

  useEffect(() => {
    const datfetch = async () => {
      const data = await credFetcher();

      dispatch(addUser(data));
    };
    datfetch();
  }, []);

  const handleClickSelect = (data: any) => {
    setSelected(data);

    setInstructions(data?.description);
  };

  const handleChange = (e) => {
    setInstructions(e.target.value);
  };

  console.log(instructions);

  const handleSave = async () => {
    try {
      const data = await fetch(`${URL}/updateins`, {
        method: "PATCH",
        headers: {
          "content-type": "appication/json",
        },
        body: JSON.stringify({ selected, disc: instructions }),
      });
      const resData = await data.json();
      if (resData?.success) {
        alert("Nice data saved");
      } else {
        alert("Something Went Wrong");
      }
    } catch (e) {
      console.log("There is Some Error in Fetching the data " + e);
    }
  };

  const handleChangeChats = (e: any) => {
    setChats(e.target.value);
  };

  const handleSendMessage = () => {
    // alert("ncie");


    
  };

  return (
    <div className="grid grid-cols-5 h-[100vh]">
      <div className="col-span-1 border-2">
        <div className="m-auto flex justify-center items-center text-3xl font-bold p-4">
          Ai Assitences
        </div>
        <div className="flex justify-center items-center">
          <button className="bg-red-400 p-2 m-4 cursor-pointer">
            Add Assistence
          </button>
        </div>
        <div className="flex flex-col gap-6 mt-5">
          {assitence?.length > 0 &&
            assitence.map((item, index) => {
              return (
                <div
                  onClick={handleClickSelect.bind(this, item)}
                  key={index}
                  className="flex gap-10 items-center justify-center cursor-pointer"
                >
                  <div>
                    <Image
                      src={item.src}
                      alt="No Image"
                      height={100}
                      width={100}
                    />
                  </div>
                  <div>{item?.aName}</div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="col-span-3 border-2 flex justify-between h-full flex-col items-center p-10">
        <h1 className="font-bold text-3xl">Chat Here</h1>
        <div>Messages are here</div>
        <div>
          {" "}
          <input
            value={chat}
            onChange={handleChangeChats}
            placeholder="Type Here"
            className="bg-white p-2 rounded-2xl w-[40vw] text-black"
          />
          <button
            onClick={handleSendMessage}
            className="bg-white text-black p-2  rounded-2xl px-3 ml-2 cursor-pointer"
          >
            sent
          </button>
        </div>
      </div>
      <div className="col-span-1 border-2">
        {" "}
        {selected && (
          <div className="mt-10 flex justify-center items-center flex-col gap-10">
            <div className="">
              <Image
                src={selected.src}
                alt="No Image"
                width={300}
                height={300}
              />
            </div>
            <div>
              <h1 className="font-bold text-3xl font-sans ">
                {selected?.aName}
              </h1>
            </div>
            <div>
              <textarea
                onChange={handleChange}
                cols={40}
                rows={8}
                className="bg-white text-black"
                value={instructions}
              />
            </div>
          </div>
        )}
        <div className="mt-20 flex justify-around gap-10">
          <div>
            <button className="p-2 bg-gray-400 cursor-pointer ">cancel</button>
          </div>
          <div>
            <button
              className="p-2 bg-gray-600 cursor-pointer "
              onClick={handleSave}
            >
              {" "}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
