import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import LatestArrivals from "./components/LatestArrivals";
import ThirtyPercentOff from "./components/ThirtyPercentOff";

export default function Home() {
  return (
    <>
      <Navbar />
      <Welcome />
      <LatestArrivals />
      <ThirtyPercentOff />
    </>
  );
}
