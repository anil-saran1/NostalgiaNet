import React from "react";

interface TierBadgeProps {
  tier: string;
}

const TierBadge: React.FC<TierBadgeProps> = ({ tier }) => {
  switch (tier) {
    case "diamond":
      return (
        <div className="flex items-center w-max bg-opacity-[85%] font-Inter gap-2 bg-black text-white px-4 py-2 rounded-lg">
          <span>Diamond</span>
          <img
            src="/diamondTier.svg"
            alt="Diamond"
            className="w-6 h-6"
          />
        </div>
      );

    case "vip":
      return (
        <div className="flex items-center w-max bg-opacity-[85%] font-Inter gap-2 bg-black text-white px-4 py-2 rounded-lg">
          <span>VIP</span>
          <img src="/vipTier.svg" alt="VIP" className="w-6 h-6" />
        </div>
      );

    case "free":
    default:
      return (
        <div className="flex items-center w-max bg-opacity-[85%] font-Inter gap-2 bg-black text-white px-4 py-2 rounded-lg">
          <span>Free</span>
          <img src="/freeTier.svg" alt="Free" className="w-6 h-6" />
        </div>
      );
  }
};

export default TierBadge;
