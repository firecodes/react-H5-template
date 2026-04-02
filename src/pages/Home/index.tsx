import React from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Divider, Ellipsis, Image } from "antd-mobile";
const Home: React.FC = () => {
  const { t } = useLanguage();

  // 统计数据
  const statisticsData: {
    value: string;
    label: string;
  }[] = [
    {
      value: "856",
      label: t("home.statistics.volunteers"),
    },
    {
      value: "856",
      label: t("home.statistics.serviceCount"),
    },
    {
      value: "856",
      label: t("home.statistics.serviceTime"),
    },
  ];

  // 服务项目数据
  const serviceItems: {
    imageUrl: string;
  }[] = [
    {
      imageUrl: "/src/assets/image/home/rural-points1.png",
    },
    {
      imageUrl: "/src/assets/image/home/rural-points2.png",
    },
    {
      imageUrl: "/src/assets/image/home/rural-points3.png",
    },
    {
      imageUrl: "/src/assets/image/home/rural-points4.png",
    },
    {
      imageUrl: "/src/assets/image/home/rural-points5.png",
    },
    {
      imageUrl: "/src/assets/image/home/rural-points6.png",
    },
  ];

  const handleServiceClick = (title: string) => {
    console.log(`点击了服务: ${title}`);
  };

  return (
    <div className="bg-[#ffffff]">
      {/* 可滚动的整个内容区 */}
      <div>
        {/* 顶部背景图片区域 */}
        <div className="h-[158px] relative ">
          <Image
            src="/src/assets/image/home/service-hall-bg.png"
            className="w-full h-full object-cover "
          />
          {/* 统计数据卡片 */}
          <div className="absolute top-[90px] left-1/2 transform -translate-x-1/2 h-[80px] ">
            <div
              className=" rounded-xl p-4 w-[342px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.3)] h-[80px]"
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
              }}
            >
              <div className="flex justify-around items-center h-full ">
                {statisticsData.map((item, index) => (
                  <div className="text-center" key={index}>
                    <div className="text-[18px] font-bold text-[#4E7FFF]">
                      {item.value}
                    </div>
                    <div className="text-[#0B2B33] text-[12px] mt-5">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* 快速服务卡片 */}
          <div className="mt-[30px] px-4 mb-4">
            <div className="w-full bg-white rounded-xl p-4 flex justify-center">
              <div className="flex justify-between items-center w-[342px]">
                <Image
                  src="/src/assets/image/home/quick-response.png"
                  className="w-[167px] h-[71px] object-cover"
                />
                <Image
                  src="/src/assets/image/home/ai-service.png"
                  className="w-[167px] h-[71px] object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-[10px] w-[342px] mx-auto">
            {/* 服务项目标题 */}
            <div className="px-4 mb-[10px] flex items-center">
              <div className="w-[2px] h-[24px] bg-[#4E7FFF] rounded-[137px]"></div>
              <div className="text-[#0B2B33] text-[18px] font-bold ml-[10px]">
                {t("home.youClickIHandle")}
              </div>
            </div>

            {/* 服务项目网格 */}
            <div className="px-4 mb-6 ">
              <div className="grid grid-cols-2 gap-4">
                {serviceItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 cursor-pointer flex justify-center items-center mt-[10px]"
                    onClick={() => handleServiceClick(item.imageUrl)}
                  >
                    <Image
                      src={item.imageUrl}
                      className="w-[156px] h-[56px] object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 注册按钮 */}
            <div className="px-4 mb-6 mt-[10px]">
              <div className="flex gap-4 justify-center">
                <Image
                  src="/src/assets/image/home/volunteer-register-btn.png"
                  className="w-[169px] h-[70px] object-cover"
                />
                <Image
                  src="/src/assets/image/home/volunteer-org-register-btn.png"
                  className="w-[169px] h-[70px] object-cover"
                />
              </div>
            </div>

            <div className="mt-[10px] w-[342px] mx-auto">
              <Image
                src="/src/assets/image/home/focus-on-people-banner.png"
                className="w-full h-[71px] object-cover"
              />
            </div>

            {/* 服务项目标题 */}
            <div className="px-4 mb-[10px] flex justify-between mt-[10px]">
              <div className="flex  justify-between">
                <div className="w-[2px] h-[24px] bg-[#4E7FFF] rounded-[137px]"></div>
                <div className="text-[#0B2B33] text-[18px] font-bold ml-[10px]">
                  热点资讯
                </div>
              </div>
              <div className="text-[#767676] text-[16px]">查看更多</div>
            </div>

            {/* 热点资讯 */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-gray-800 mb-1 text-[16px] text-[#1A1A1A]">
                    <Ellipsis
                      direction="end"
                      rows={2}
                      content="爱心助老，情暖金秋公益活动圆满完成"
                    />
                  </div>
                  <div className="text-gray-500 text-sm">2,530 次浏览</div>
                </div>
                <Image
                  src="/src/assets/image/home/focus-on-people-banner.png"
                  className="w-[114px] h-[76px] object-cover rounded-lg ml-4"
                />
              </div>
              <Divider />
              <div className="flex items-center">
                <div className="flex-1">
                  <div className="text-gray-800 mb-1 text-[16px] text-[#1A1A1A]">
                    <Ellipsis
                      direction="end"
                      rows={2}
                      content="青年志愿者服务队走进社区开展便民服务"
                    />
                  </div>
                  <div className="text-gray-500 text-sm">1,856 次浏览</div>
                </div>
                <Image
                  src="/src/assets/image/home/focus-on-people-banner.png"
                  className="w-[114px] h-[76px] object-cover rounded-lg ml-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
