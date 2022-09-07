import type { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react";
import axios from "axios";
import SubmitButton from "../components/common/SubmitButton";
import Title from "../components/common/Title";

function validURL(str: string): boolean {
  var pattern = new RegExp(
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

type Props = { host: string | null };

interface PageProps {
  host: null | string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => ({
  props: { host: ctx.req.headers.referer || null },
});

const Home: NextPage<PageProps> = ({ host }) => {
  const [url, setURL] = useState("");
  const [shortLink, setShortLink] = useState("");
  const submitForm = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    e.preventDefault();
    if (!validURL(url)) {
      alert("URL is not valid");
      return;
    }

    axios
      .post(`${host}/api/examples`)
      .then((res) => {
        console.log(res);
        if (res?.data?.url) setShortLink(res.data.url);
        else throw new Error("Data is of invalid shape");
      })
      .catch((err) => {
        console.error(err);

        alert("URL could not be created at this time");
      });
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
          {shortLink ? (
            <h3>
              Created link at <a>{shortLink}</a>
            </h3>
          ) : null}
        </div>
      </main>
    </>
  );
};

export default Home;
