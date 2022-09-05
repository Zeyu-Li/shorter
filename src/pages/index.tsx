import type { NextPage } from "next";
import React, { useState } from "react";
import SubmitButton from "../components/common/SubmitButton";
import Title from "../components/common/Title";

const Home: NextPage = () => {
  const [url, setURL] = useState("");
  const submitForm = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.preventDefault();
    if (!url) {
      alert("URL is not valid");
      return;
    }
  };

  return (
    <>
      <Title title="Shorter" />
      <main className="flex align-middle min-h-screen">
        <div className="text-center justify-center max-w-4xl m-auto text-4xl">
          <h1 className="mb-8">URL Shortener</h1>
          <form>
            <input
              type="url"
              placeholder="Enter URL Here"
              onChange={(e) => setURL(e.target.value)}
              className="transition-all block w-full outline-gray-800 rounded-md px-7 py-3 focus-visible:border-indigo-500 focus-visible:ring-indigo-500 text-2xl"
            />
            <SubmitButton text={"Generate URL"} onClick={submitForm} />
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
