import React from 'react';
import { FaCheck, FaCheckCircle } from 'react-icons/fa';
import { LuPaintbrush } from 'react-icons/lu';

interface ThemeSelectorProps {
  theme: 1 | 2 | 3 | null;
  setTheme: React.Dispatch<React.SetStateAction<1 | 2 | 3 | null>>;
  onThemeConfirm: (e: boolean) => void; // New prop for theme confirmation
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, setTheme, onThemeConfirm }) => {
  return (
    <div>
      <div className="journal-inner-container">
        {/* Journal Cards */}
        <div className="flex flex-row justify-between rounded-3xl my-20px w-[90%] bg-[#252321] py-14 px- lg:p-14">
          
          {/* Card 1 */}
          <div
            onClick={() => setTheme(1)}
            className={`journal-card scale-75 lg:scale-90 xl:scale-100 relative link-pointer transition-all drop-shadow-[10px_10px_20px_rgba(0,0,0,0.6)] duration-300 rounded-[0px_30px_30px_0px] 
            ${(theme === 1) ? "brightness-100 drop-shadow-[10px_10px_20px_rgba(255,255,255,0.3)]" : theme===null ? "brightness-100" :"brightness-50"}`}
          >
            <img
              src="/card-image-1.png"
              alt="Journal 1"
              className="journal-image"
            />
            {theme === 1 && (
              <FaCheckCircle className="absolute inset-0 m-auto text-4xl text-[#252321]" />
            )}
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setTheme(2)}
            className={`journal-card scale-75 lg:scale-90 xl:scale-100 relative link-pointer transition-all drop-shadow-[10px_10px_20px_rgba(0,0,0,0.6)] duration-300 rounded-[0px_30px_30px_0px] 
              ${(theme === 2) ? "brightness-100 drop-shadow-[10px_10px_20px_rgba(255,255,255,0.3)]" : theme===null ? "brightness-100" :"brightness-50"}`}
          >
            <img
              src="/card-image-2.png"
              alt="Journal 2"
              className="journal-image"
            />
            {theme === 2 && (
              <FaCheckCircle className="absolute inset-0 m-auto text-4xl text-[#252321]" />
            )}
          </div>

          {/* Card 3 */}
          <div
            onClick={() => setTheme(3)}
            className={`journal-card scale-75 lg:scale-90 xl:scale-100 relative link-pointer transition-all drop-shadow-[10px_10px_20px_rgba(0,0,0,0.6)] duration-300 rounded-[0px_30px_30px_0px] 
              ${(theme === 3) ? "brightness-100 drop-shadow-[10px_10px_20px_rgba(255,255,255,0.3)]" : theme===null ? "brightness-100" :"brightness-50"}`}
          >
            <img
              src="/card-image-3.png"
              alt="Journal 3"
              className="journal-image"
            />
            {theme === 3 && (
              <FaCheckCircle className="absolute inset-0 m-auto text-4xl text-[#252321]" />
            )}
          </div>
        </div>

        {/* Create Button */}
        <div className={`absolute h-auto p-3 rounded-3xl -bottom-10 bg-white ${ theme != null? "link-pointer  hover:scale-105 transition-all duration-200": "" } `}>
          <div 
            onClick={() => theme != null && onThemeConfirm(true)} className={`p-4 flex flex-row items-center gap-4 bg-[#302E2C] rounded-2xl text-white font-Khyay ${ theme != null? "link-pointer  hover:scale-105 transition-all duration-500": "" }  `}>
            {theme == null ? (
              <>
                <LuPaintbrush /> <span>Select a theme</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>Confirm</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
