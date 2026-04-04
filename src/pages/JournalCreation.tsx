import { useState } from "react";
import "../components/JournalInnerMaterial.css";
import ThemeSelector from "../components/ThemeSelector";
import AngledPanel from "../components/AngledPanel"; 

const JournalCreation = ({setDoing}:{setDoing: (e:boolean) => void} ) => {
  const [theme, setTheme] = useState<1 | 2 | 3 | null>(null); 
  const [isThemeConfirmed, setIsThemeConfirmed] = useState(false);  

  // Theme Confirm Handler
  const handleThemeConfirm = (value: boolean) => {
    setIsThemeConfirmed(value); // Set state to true when theme is confirmed
  };

  return (
    <>
      <div className="h-max mb-10 w-full">
        {!isThemeConfirmed ? (
          <ThemeSelector
            theme={theme}
            setTheme={setTheme}
            onThemeConfirm={(e: boolean) => handleThemeConfirm(e)}
          />
        ) : (
          <AngledPanel
            theme={theme ? theme : 1}
            onThemeConfirm={(e: boolean) => handleThemeConfirm(e)} 
            setDoing = {setDoing}
          ></AngledPanel>
        )}
      </div>
 
    </>
  );
};

export default JournalCreation;
