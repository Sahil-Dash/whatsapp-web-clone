import { reducerCases } from "@/context/constants";
import { useStateProvider } from "@/context/StateContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function Container({ data }) {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const [callAccepted, setCallAccepted] = useState(false);

  useEffect(() => {
    if (data.type === "out-going") {
      socket.current.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    let joinCall = async () => {
      // generate Call Token
      const appID = process.env.NEXT_PUBLIC_ZEGO_APP_ID;
      const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER;
      const roomID = data.roomId.toString();
      const callToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userInfo.id.toString(),
        userInfo.name,
        3600
      );

      // Create instance object from Call Token.
      const zp = ZegoUIKitPrebuilt.create(callToken);
      const boolVal = data.callType === "video" ? true : false;
      let c = 0;
      // start the call
      zp.joinRoom({
        maxUsers: 2,
        showPreJoinView: false,
        showScreenSharingButton: false,
        showUserCount: false,
        showLocalVideo: true,
        showRemoteVideo: true,
        showAudio: true,
        showTextChat: false,
        showUserList: false,
        showRoomDetailsButton: false,

        videoResolutionList: [
          ZegoUIKitPrebuilt.VideoResolution_180P,
          ZegoUIKitPrebuilt.VideoResolution_360P,
          ZegoUIKitPrebuilt.VideoResolution_480P,
          ZegoUIKitPrebuilt.VideoResolution_720P,
        ],
        videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_360P,

        showAudioVideoSettingsButton: boolVal,
        turnOnCameraWhenJoining: boolVal,
        showMyCameraToggleButton: boolVal,
        showVideo: boolVal,

        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },

        onUserAvatarSetter: (userList) => {
          c += 1;
          userList[0].setUserAvatar(
            c === 1 ? userInfo.profileImage : data.profilePicture
          );
        },

        onLeaveRoom: () => {
          zp.destroy();
          window.location.href = "/";
        },

        onUserLeave: () => {
          zp.destroy();
          window.location.href = "/";
        },
      });
    };
    if (callAccepted) {
      joinCall();
    }
  }, [callAccepted]);

  const endCall = () => {
    const id = data.id;
    if (data.callType === "voice") {
      socket.current.emit("reject-voice-call", { from: id });
    } else {
      socket.current.emit("reject-voice-call", { from: id });
    }
    dispatch({ type: reducerCases.END_CALL });
  };

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.name}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video"
            ? "On Going Call"
            : "Calling"}
        </span>
      </div>
      {(!callAccepted || data.callType === "audio") && (
        <div className="my-24">
          <Image
            src={data.profilePicture}
            alt="avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}
      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5 " id="local-video"></div>
      </div>
      <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
        <MdOutlineCallEnd
          className="text-3xl cursor-pointer"
          onClick={endCall}
        />
      </div>
    </div>
  );
}

export default Container;
