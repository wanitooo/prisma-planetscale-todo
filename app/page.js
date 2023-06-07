import InputBox from "@/components/InputBox";
import Image from "next/image";

export default function Home() {
  return (
    <main className="w-screen h-screen ">
      <div className="h-screen flex flex-col items-center ">
        <span className="text-5xl font-bold p-4 border-b-2 w-1/2 text-center m-4">
          Tasks
        </span>
        <InputBox />
      </div>
    </main>
  );
}