"use client";
import React, { useState, useEffect } from "react";
import PromptCard from "@/components/PromptCard";
import { useRouter, useSearchParams } from "next/navigation";
function Feed() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [posts, setPosts] = useState("");
  const HandelSerachTerm = (e) => setSearchTerm(e.target.value);
  useEffect(() => {
    console.log(searchParams.has("search"), searchParams.get("search"));
    (async () => {
      const res = await fetch(
        searchParams.has("search")
          ? `/api/prompt?search=${searchParams.get("search")}`
          : "/api/prompt"
      );
      const posts = await res.json();
      console.log(posts);
      setPosts(posts.prompts);
    })();
  }, [searchTerm, searchParams]);

  const router = useRouter();

  const onSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) router.push(`/?search=${searchTerm}`);
    console.log(searchTerm);
  };
  return (
    <section className="feed">
      <form className="relative w-full flex-center" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="search for tag and username"
          value={searchTerm}
          onChange={HandelSerachTerm}
          className="search_input peer"
        />
      </form>
      <PromptCardList data={posts} />
    </section>
  );
}

const PromptCardList = ({ data }) => {
  let handleEdit = () => "jksa";
  let handleDelete = () => "jksa";
  let handleTagClick = () => "jksa";

  return (
    <section className="prompt_layout">
      {data &&
        data.map((el, index) => (
          <PromptCard
            handleTagClick={handleTagClick}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            post={el}
            key={el.id + " " + index}
          />
        ))}
    </section>
  );
};

export default Feed;
