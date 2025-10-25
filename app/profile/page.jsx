"use client";
import React, { useState, useEffect } from "react";
import Profile from "@/components/Profile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
function Page() {
  const [posts, setPosts] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const id = session?.user.id;
  useEffect(() => {
    const fetchPosts = async () => {
      const data = await fetch(`api/users/${id}/prompts`);
      const posts = await data.json();
      setPosts(posts);
    };
    if (id) fetchPosts();
  }, [id]);
  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        toast.promise(
          new Promise((reslove, reject) =>
            fetch(`/api/prompt/${post._id.toString()}`, {
              method: "DELETE",
            })
              .then((rs) => reslove())
              .catch((er) => reject())
          ),

          {
            pending: "Delete Prompt ",
            success: "Delete Prompt Done 👌",
            error: "Delete Prompt Faild 🤯",
          }
        );

        const filteredPosts = posts.filter((item) => item._id !== post._id);
        setPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div>
      <Profile
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        name="My"
        data={posts}
        description="My Profile  in  this Awasome Profile"
      />
    </div>
  );
}

export default Page;
