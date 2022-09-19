import type { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react";
import axios from "axios";
import SubmitButton from "../components/common/SubmitButton";
import Title from "../components/common/Title";
import CONSTANTS from "../components/constants/constants";

function validURL(str: string): boolean {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

const Home: NextPage = () => {
  const [url, setURL] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [copied, setCopied] = useState(false);
  const submitForm = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.preventDefault();
    if (!validURL(url)) {
      alert("URL is not valid");
      return;
    }

    axios
      .post(`${CONSTANTS.DEFAULT_BASE_URL}api/create/create`, { url })
      .then((res) => {
        console.log(res);
        if (res?.data?.url)
          setShortLink(`${CONSTANTS.DEFAULT_BASE_URL}api/${res.data.slug}`);
        else throw new Error("Data is of invalid shape");
      })
      .catch((err) => {
        console.error(err);

        alert("URL could not be created at this time");
      });
  };

  const copyToClipboard = (): void => {
    setCopied(true);
    navigator.clipboard.writeText(shortLink);
  };

  // autoclose alert after 3 seconds
  setTimeout(() => {
    setCopied(false);
  }, 3000);

  return (
    <>
      <Title title="Shorter" />
      <main className="flex align-middle min-h-screen">
        <div className="text-center justify-center max-w-lg m-auto text-4xl">
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
          {shortLink ? (
            <h3>
              Created link at{" "}
              <a
                className="text-blue-700 cursor-pointer underline hover:text-blue-500 transition"
                title={shortLink}
                onClick={() => copyToClipboard()}
              >
                {shortLink}
              </a>
            </h3>
          ) : null}
        </div>
      </main>

      {/* bottom toast to say copied to clipboard */}
      {/* {copied ? ( */}
      <div
        className={`fixed bottom-0 right-0 m-4 transition`}
        style={{ opacity: copied ? 100 : 0 }}
      >
        <div className="bg-gray-800 text-white font-bold rounded-lg border shadow-lg p-4">
          Copied to clipboard!
        </div>
      </div>
      {/* ) : null} */}
    </>
  );
};

export default Home;
