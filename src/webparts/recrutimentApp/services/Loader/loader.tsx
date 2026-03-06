import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center">
      <div 
        className="h-12 w-12 animate-[spin_1s_steps(10)_infinite] rounded-full p-[1px]"
        style={{
          background: "conic-gradient(#0000 10%, #597b98) content-box",
          WebkitMask: `
            repeating-conic-gradient(#0000 0deg, #000 1deg 20deg, #0000 21deg 36deg),
            radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 calc(100% - 8px))
          `,
          WebkitMaskComposite: "destination-in",
          maskComposite: "intersect",
        }}
      />
    </div>
  );
};

export default Loader;