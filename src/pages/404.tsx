import { NextPage } from "next";
import LinkButton from "../components/common/LinkButton";
import Title from "../components/common/Title";

const Custom404: NextPage = () => {
  return (
    <>
      <Title title="Page expired or invalid ☠️" />
      <main className="flex align-middle min-h-screen">
        <div className="text-center justify-center max-w-4xl m-auto text-4xl">
          <h1 className="mb-16">Page expired or invalid ¯\(°_o)/¯</h1>
          <LinkButton text={"Create a new link"} />
        </div>
      </main>
    </>
  );
};
export default Custom404;
