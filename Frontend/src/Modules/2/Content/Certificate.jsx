import React from "react";
import { useSelector } from "react-redux";
import imgCertificate from "./../../../assets/Apple 250.png";

export default function Certificate({
  presidentName = "Keerti Sharma",
  viceName = "Pradeep Ingalkar",
  logo = imgCertificate,
}) {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <div className="min-h-screen flex items-center justify-center box-border">
      <div
        className="relative w-full max-w-[1200px] rounded-md shadow-2xl overflow-hidden"
        style={{
          background: "#FFF3D9",
        }}
      >
        <svg
          viewBox="0 0 200 200"
          className="absolute top-0 left-0 w-[200px] h-[200px]"
          preserveAspectRatio="none"
        >
          <path d="M0,0 L200,0 L0,200 Z" fill="#f79e1b" opacity="0.95" />
          <path d="M0,0 L150,0 L0,150 Z" fill="#ffb845" opacity="0.6" />
        </svg>

        {/* Bottom-right corner */}
        <svg
          viewBox="0 0 200 200"
          className="absolute bottom-0 right-0 w-[260px] h-[260px]"
          preserveAspectRatio="none"
        >
          <path d="M200,200 L0,200 L200,0 Z" fill="#f7b33b" opacity="0.95" />
          <path d="M200,200 L50,200 L200,50 Z" fill="#ffb845" opacity="0.6" />
        </svg>

        {/* Inner border */}
        <div
          className="absolute inset-0 rounded-md"
          style={{
            boxShadow: "inset 0 0 0 10px rgba(247,158,27,0.95)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full w-full p-6 md:p-10 flex flex-col">
          {/* --- HEADER: logo + title --- */}
          <div className="flex flex-col items-center justify-center mt-2 md:mt-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              {/* Logo */}
              <div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full overflow-hidden flex items-center justify-center bg-white shadow-inner">
                {logo ? (
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: "center" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "75%",
                      height: "75%",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle at 30% 30%, #ffd37a 0%, #ffb844 40%, #f79e1b 100%)",
                    }}
                  />
                )}
              </div>

              {/* Text beside logo */}
              <div className="text-center sm:text-left">
                <div
                  className="font-extrabold text-[#0d2b5b]"
                  style={{
                    fontSize: "clamp(24px, 2.6vw, 42px)",
                    lineHeight: 1,
                  }}
                >
                  Future Kids
                </div>
                <div
                  className="font-semibold text-[#0d2b5b] -mt-1"
                  style={{
                    fontSize: "clamp(18px, 1.8vw, 32px)",
                    lineHeight: 1.2,
                  }}
                >
                  Foundation
                </div>
              </div>
            </div>
          </div>

          {/* --- MAIN TITLE --- */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 mt-4 md:mt-6">
            <div
              className="text-[#0d2b5b] font-extrabold text-center tracking-tight"
              style={{ fontSize: "clamp(26px, 4.5vw, 56px)", lineHeight: 1 }}
            >
              CERTIFICATE OF
            </div>
            <div
              className="text-[#0d2b5b] font-extrabold text-center tracking-tight"
              style={{ fontSize: "clamp(26px, 4.5vw, 56px)", lineHeight: 1 }}
            >
              APPRECIATION
            </div>

            <div className="mt-6 text-center w-full max-w-[820px]">
              <div
                className="text-[#0d2b5b] mb-4 font-medium"
                style={{ fontSize: "clamp(12px, 1.25vw, 18px)" }}
              >
                This certificate is proudly presented to
              </div>

              <div className="mt-2">
                <div
                  className="text-[#0d2b5b] font-semibold"
                  style={{ fontSize: "clamp(20px, 3.6vw, 40px)" }}
                >
                  {currentUser?.name}
                </div>
              </div>

              <hr className="border-t border-[#d6d6d6] my-6 w-3/4 mx-auto" />

              <p
                className="text-[#0d2b5b] mx-auto max-w-[720px]"
                style={{ fontSize: "clamp(12px, 1.25vw, 16px)" }}
              >
                for outstanding participation and contribution
                <br />
                in various foundation activities.
              </p>
            </div>
          </div>

          {/* --- SIGNATURES --- */}
          <div className="mt-8 flex flex-col md:flex-row items-center md:items-end justify-between px-2 md:px-8 gap-4">
            <div className="text-left">
              <div
                className="font-semibold text-[#0d2b5b]"
                style={{ fontSize: "clamp(14px, 1.4vw, 18px)" }}
              >
                {presidentName}
              </div>
              <div className="text-sm text-[#0d2b5b] opacity-90">President</div>
            </div>

            <div className="text-right">
              <div
                className="font-semibold text-[#0d2b5b]"
                style={{ fontSize: "clamp(14px, 1.4vw, 18px)" }}
              >
                {viceName}
              </div>
              <div className="text-sm text-[#0d2b5b] opacity-90">
                Vice President
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
