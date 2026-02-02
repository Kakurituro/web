import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Setting from "./pages/setting";
import Support from "./pages/support";
import Characters from "./pages/characters";
import { HopupProvider, useHopupContext } from "./context/hopup";
import Hopup from "./components/Hopup";
import { useEffect } from "react";
import Players from "./pages/game/local/players";
import GameLocalCharacters from "./pages/game/local/characters";
import { LocalProvider } from "./context/game/local";
import Opening from "./pages/game/opening";
import GameLocalNotice from "./pages/game/local/notice";
import GameLocalNoon from "./pages/game/local/noon";
import GameLocalVote from "./pages/game/local/vote";
import GameLocalNight from "./pages/game/local/night";
import GameLocalResult from "./pages/game/local/result";
import { AnimatePresence } from "motion/react";
import VoteResult from "./pages/game/local/voteResult";
import GameLocalOption from "./pages/game/local/option";

function App() {
  return (
    <div className="relative w-[100svw] h-[100svh] overflow-hidden">
      <img
        src="images/common/back.jpg"
        className="object-cover w-[100svw] h-[100svh] absolute top-0 left-0 z-0"
        alt=""
      />
      <div className="App overflow-x-hidden overflow-y-hidden w-[100svw] h-[100svh] hidden-scrollbar relative z-10">
        <LocalProvider>
          <HopupProvider>
            <HopupWrapper />
          </HopupProvider>
        </LocalProvider>
      </div>
    </div>
  );
}

function HopupWrapper() {
  const { isVisible, hopups, setHopups, setIsVisible } = useHopupContext();
  const location = useLocation();

  useEffect(() => {
    setHopups([
      {
        src: "/images/hopup/rule/test.png",
        text: "試験に合格して、ライブ出場を目指しましょう。ライブに出場するためには、中間試験と最終試験に合格する必要があります。",
      },
    ]);
  }, [setHopups]);

  return (
    <>
      <Hopup data={hopups} />
      <div
        className={
          isVisible
            ? "blur-sm backdrop-blur-sm w-[100lvw] h-[100lvh]"
            : "blur-none backdrop-blur-none w-[100lvw] h-[100lvh]"
        }
      >
        <div
          className={`absolute w-[100lvw] h-[100lvh] z-999 opacity-10 bg-[#1e1e1e] top-0 left-0 ${
            isVisible ? "inline" : "hidden"
          }`}
          onClick={() => setIsVisible(false)}
        ></div>

        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/support" element={<Support />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/game/local/players" element={<Players />} />
            <Route
              path="/game/local/characters"
              element={<GameLocalCharacters />}
            />
            <Route path="/game/local/notice" element={<GameLocalNotice />} />
            <Route path="/game/local/noon" element={<GameLocalNoon />} />
            <Route path="/game/local/vote" element={<GameLocalVote />} />
            <Route path="/game/local/night" element={<GameLocalNight />} />
            <Route path="/game/local/result" element={<GameLocalResult />} />
            <Route path="/game/opening" element={<Opening />} />
            <Route path="/game/local/vote-result" element={<VoteResult />} />
            <Route path="/game/local/option" element={<GameLocalOption />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
