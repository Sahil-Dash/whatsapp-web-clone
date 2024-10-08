import Avatar from "@/components/common/Avatar";
import Input from "@/components/common/Input";
import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import { ONBOARD_USER_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function onboarding() {
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  const router = useRouter();

  const [name, setName] = useState(userInfo?.name || "");
  const [userName, setUserName] = useState(userInfo?.userName || "");

  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/default_avatar.png");

  useEffect(() => {
    if (!newUser && !userInfo?.email) router.push("/login");
    else if (!newUser && userInfo?.email) router.push("/");
  }, [newUser, userInfo, router]);

  const onBoardUserHandler = async () => {
    if (validateDetails()) {
      const email = userInfo.email;

      try {
        const { data } = await axios.post(ONBOARD_USER_ROUTE, {
          email,
          name,
          userName,
          about,
          image,
        });
        console.log(data);

        if (data.status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: false });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.user.id,
              name,
              userName,
              email,
              profileImage: image,
              status: about,
            },
          });
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validateDetails = () => {
    if (name.length < 3) {
      alert("Name should be at least 3 characters long");
      return false;
    }
    if (userName.length < 3) {
      alert("User Name should be at least 3 characters long");
      return false;
    }
    return true;
  };

  console.log("onboard :- ", userInfo);

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image src="/whatsapp.gif" alt="whatsapp" height={300} width={300} />
        <span className="text-7xl">Whatsapp</span>
      </div>
      <h2 className="text-2xl">Create your profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input name="Name" state={name} setState={setName} label />
          <Input
            name="UserName"
            state={userName}
            setState={setUserName}
            label
          />

          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button
              className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
              onClick={onBoardUserHandler}
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}

export default onboarding;
