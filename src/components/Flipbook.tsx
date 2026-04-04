import React, { useEffect, useState } from "react";
import { Calendar, Quote, ImagePlus } from "lucide-react";
import "./Flipbook.css";

interface FlipBookProps {
  entries: EntryProp[];
  theme: 1 | 2 | 3;
  title: string;
  createdAt: string;
  description: string;
  pgNo: number;
}

interface EntryProp {
  name: string;
  content: string;
  createdAt: string;
  image: string[];
}

const Flipbook = ({
  entries,
  theme,
  createdAt,
  title,
  description,
  pgNo = 0,
}: FlipBookProps) => {
  const totalPages = entries.length + 2;
  const [pageTurned, setPageTurned] = useState<boolean[]>(
    Array(totalPages).fill(false)
  );
  const [currentIndex, setCurrentIndex] = useState(pgNo + 1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageTurned((prevPageTurned) =>
        prevPageTurned.map((turned, i) => (i <= pgNo ? true : turned))
      );
    }, 100);

    return () => clearTimeout(timeout);
  }, [pgNo, totalPages]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        if (currentIndex < totalPages - 1) {
          turnPage(currentIndex);
          setCurrentIndex(currentIndex + 1);
        }
      } else if (event.key === "ArrowLeft") {
        if (currentIndex > 0) {
          turnPage(currentIndex - 1);
          setCurrentIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, totalPages]);

  const turnPage = (index: number) => {
    setPageTurned((prevPageTurned) =>
      prevPageTurned.map((turned, i) => (i === index ? !turned : turned))
    );
  };

  const getZIndex = (index: number) => {
    return pageTurned[index] ? totalPages + index : totalPages - index;
  };

  const renderEmptyPageContent = (createdAt: string) => (
    <div className="empty-page-content flex flex-col items-center justify-center h-full p-8 bg-gray-50 bg-opacity-5">
      <div className="space-y-8 text-center">
        <Calendar className="w-8 h-8 mx-auto text-gray-400" />
        <p className="text-gray-500 italic text-sm">
          {createdAt}
        </p>
        <div className="upload-prompt space-y-2">
          <ImagePlus className="w-12 h-12 mx-auto text-gray-300" />
          <p className="text-sm text-gray-400">Add memories to your journal</p>
        </div>
        <div className="mt-12 space-y-4">
          <Quote className="w-6 h-6 mx-auto text-gray-300" />
          <p className="text-sm text-gray-400 italic">
            "Every memory tells a story..."
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`book ${pageTurned[0] ? "moved" : ""}`}>
      {/* Cover */}
      <div
        className={`cover ${pageTurned[0] ? "rotated" : ""}`}
        style={{
          zIndex: totalPages,
          backgroundImage: `url(/card-image-${theme}.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <label
          onClick={() => {
            if (pageTurned[1] === false) {
              turnPage(0);
              setCurrentIndex(!pageTurned[0] ? 1 : 0);
            }
          }}
        ></label>
      </div>

      {/* Welcome Page */}
      <div
        key="welcome"
        onClick={() => {
          if (pageTurned[0] === true) {
            turnPage(1);
            setCurrentIndex(!pageTurned[1] ? 2 : 1);
          }
        }}
        className={`page ${pageTurned[1] ? "rotated" : ""}`}
        style={{ zIndex: getZIndex(1) }}
      >
        <div className="front-page justify-center items-center flex overflow-auto">
          <div className="bg-[#252321] w-[90%] h-[90%] rounded-2xl p-8">
            <div className="h-full flex flex-col justify-center items-center text-white space-y-6">
              <h2 className="text-2xl font-semibold">{title}</h2>
              <p className="text-center text-gray-400">{description}</p>
              <p className="text-sm text-gray-500">{createdAt}</p>
            </div>
          </div>
        </div>
        <div className="back-page">
          {entries.length > 0 && entries[0].image && entries[0].image.length > 0 ? (
            <div className="image-gallery grid gap-4 p-6">
              {entries[0].image.map((link) => (
                <img
                  src={link}
                  className="w-full h-auto rounded-lg shadow-md"
                  alt=""
                  key={link}
                />
              ))}
            </div>
          ) : (
            renderEmptyPageContent(entries[0].createdAt)
          )}
        </div>
      </div>

      {/* Dynamically generate pages from entries */}
      {entries.map((entry, index) => (
        <div
          key={index}
          onClick={() => {
            if (index < entries.length - 1) {
              turnPage(index + 2);
              setCurrentIndex(!pageTurned[index + 2] ? index + 3 : index + 2);
            }
          }}
          className={`page ${pageTurned[index + 2] ? "rotated" : ""}`}
          style={{ zIndex: getZIndex(index + 2) }}
        >
          <div className="front-page overflow-auto p-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">{entry.name}</h3>
              <div className="prose max-w-none">
                <p className="text-gray-600">{entry.content}</p>
              </div>
            </div>
          </div>
          <div className="back-page">
            {index < entries.length - 1 && entries[index + 1].image && 
             entries[index + 1].image.length > 0 ? (
              <div className="image-gallery grid gap-4 p-6">
                {entries[index + 1].image.map((link) => (
                  <img
                    src={link}
                    alt=""
                    key={link}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                ))}
              </div>
            ) : (
              entries[index + 1] ? renderEmptyPageContent(entries[index + 1].createdAt) : null
            )}
          </div>
        </div>
      ))}

      {/* Back Cover */}
      <div
        className="back-cover"
        style={{
          zIndex: -1,
          backgroundImage: `url(/card-image-${theme}.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="cover-content flex flex-col items-center justify-center h-full text-white opacity-75">
          <p className="text-sm">The End</p>
        </div>
      </div>
    </div>
  );
};

export default Flipbook;