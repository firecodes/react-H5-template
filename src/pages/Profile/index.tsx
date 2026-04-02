import React from "react";
import { Image, Avatar, Button } from "antd-mobile";
import { useAppSelector } from "@/store";

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.user);

  return (
    <div className="bg-[#FFFFFF]">
      {/* 顶部背景区域 */}
      <div className="relative">
        <Image
          src="/src/assets/image/profile/profile-header-background.png"
          className="w-full h-[185px] object-cover relative"
        />

        {/* 用户信息覆盖层 */}
        <div className="absolute top-[0px] left-1/2 transform -translate-x-1/2 w-[342px] h-[185px] flex items-center justify-between px-6 z-10">
          {" "}
          <div className="flex items-center">
            <div className="mr-[16px]">
              <Avatar
                src="/src/assets/image/profile/profile-header-background.png"
                style={{ "--size": "64px", "--border-radius": "50%" }}
              />
            </div>

            {/* 用户信息 */}
            <div className="flex flex-col h-[64px] justify-center">
              <div className="text-[#1A1A1A] text-[18px]  font-medium mb-1">
                {user?.name || "用户昵称"}
              </div>
              <div className="text-[#767676] text-[12px]">
                {user?.id || "3552638596"}
              </div>
            </div>
          </div>
          {/* 右侧：查看普通用户 */}
          <div>
            <Button
              color="primary"
              size="small"
              className="px-6 py-1 rounded-full"
              style={{
                backgroundColor: "#4E7FFF",
                border: "none",
                fontSize: "14px",
              }}
            >
              普通用户
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        
      </div>
    </div>
  );
};

export default Profile;
