import { URL } from "@/app/constants/constants";

export const credFetcher = async () => {
  try {
    const data = await fetch(`${URL}/usercred`);
    const resData = await data.json();

    const obj = {
      Name: resData.data.name,
      Email: resData.data.email,
      isLogin: true,
      id: resData.data.id,
    };
    return obj;
  } catch (e) {
    console.log("There is Some Error in fetching The Cred " + e);
  }
};
