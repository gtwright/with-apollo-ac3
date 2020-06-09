import { useState } from "react";
import Router from "next/router";
export default function SerachBox() {
  const [search, setSearch] = useState("");

  return (
    <div className="search">
      <input
        type="text"
        placeholder="Search by post title"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
        label="search"
      />
      <button
        disabled={search === ""}
        onClick={() => Router.push("/p/[slug]", `/p/${search}`)}
      >
        Search
      </button>
      <style jsx>{`
        input {
          display: block;
          margin-bottom: 10px;
          margin-right: 10px;
        }
        .search {
          display: flex;
          align-items: baseline;
        }
      `}</style>
    </div>
  );
}
